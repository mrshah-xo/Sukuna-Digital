import { NextResponse } from 'next/server';
import { otpService } from '@/services/otp.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Sanitize — only allow digits, strip leading country code if needed
    phone = String(phone).replace(/\D/g, '').slice(-10);
    if (phone.length !== 10) {
      return NextResponse.json({ error: 'Enter a valid 10-digit phone number' }, { status: 400 });
    }

    // TODO: Add Redis-based rate limiting here (max 3 OTP requests per phone per 10 mins)
    // await rateLimiter.check(phone);

    await otpService.sendOTP(phone);

    // Generic success — never reveal if phone exists to prevent enumeration
    return NextResponse.json({ message: 'If this number is registered, an OTP has been sent.' }, { status: 200 });

  } catch (error: unknown) {
    // Do NOT expose 404 for unregistered numbers in production (enumeration risk)
    // For now in development, we keep it descriptive
    const message = error instanceof Error ? error.message : undefined;
    if (process.env.NODE_ENV === 'development' && message?.includes('not registered')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again later.' }, { status: 500 });
  }
}
