import { Suspense } from 'react';
import { OTPVerificationScreen } from '@/components/auth/OTPVerificationScreen';
export default function VerifyOTPPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}><OTPVerificationScreen /></Suspense>;
}
