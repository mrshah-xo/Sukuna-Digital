import { NextResponse } from 'next/server';
import { otpService } from '@/services/otp.service';
import { z } from 'zod';
import { createHmac } from 'crypto';

const schema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6),
});

/**
 * Produces a short-lived, server-signed proof that `phone` was OTP-verified.
 *
 * Format (URL-safe base64):  base64(phone + ":" + expiresAtMs + ":" + hmac)
 *
 * The HMAC is computed with NEXTAUTH_SECRET so it cannot be forged without
 * server-side knowledge. The expiry is embedded and re-validated on
 * consumption so the token cannot be reused after 5 minutes.
 */
function makeVerificationToken(phone: string): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || '';
  if (!secret) {
    // Fail closed: without a secret we cannot produce a trustworthy token.
    throw new Error('Server misconfiguration: NEXTAUTH_SECRET is not set.');
  }
  // Token is valid for 5 minutes — long enough for the page transition,
  // short enough to limit its usefulness if somehow captured.
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const payload = `${phone}:${expiresAt}`;
  const hmac = createHmac('sha256', secret).update(payload).digest('hex');
  // Encode as a single URL-safe string: payload + "." + hmac
  return Buffer.from(`${payload}.${hmac}`).toString('base64url');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, code } = schema.parse(body);

    const isValid = await otpService.verifyOTP(phone, code);

    if (isValid) {
      // Issue a short-lived, HTTP-only, server-signed verification token in a
      // cookie. This proves to /api/auth/otp/verified-profile that the bearer
      // completed OTP verification for this specific phone number without
      // requiring a full NextAuth session to be established first.
      const token = makeVerificationToken(phone);

      const response = NextResponse.json(
        { status: 'success', message: 'Phone verified!' },
        { status: 200 }
      );

      response.cookies.set('otp_verified', token, {
        httpOnly: true,     // JS cannot read this; prevents XSS token theft
        secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod
        sameSite: 'lax',    // Allows same-site redirects; blocks CSRF from other origins
        path: '/api/auth/otp/verified-profile', // Scoped: only sent to this one endpoint
        maxAge: 5 * 60,     // 5 minutes — matches the token expiry above
      });

      return response;
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ status: 'error', message }, { status: 400 });
  }
}
