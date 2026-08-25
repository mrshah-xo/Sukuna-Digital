import { NextResponse } from 'next/server';
import { otpService } from '@/services/otp.service';
import { z } from 'zod';

const schema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, code } = schema.parse(body);

    const isValid = await otpService.verifyOTP(phone, code);

    if (isValid) {
      return NextResponse.json({ status: 'success', message: 'Phone verified!' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ status: 'error', message }, { status: 400 });
  }
}
