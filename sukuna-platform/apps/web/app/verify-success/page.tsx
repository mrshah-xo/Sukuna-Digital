import { Suspense } from 'react';
import { VerificationSuccessScreen } from '@/components/auth/VerificationSuccessScreen';
export default function VerifySuccessPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white" />}><VerificationSuccessScreen /></Suspense>;
}
