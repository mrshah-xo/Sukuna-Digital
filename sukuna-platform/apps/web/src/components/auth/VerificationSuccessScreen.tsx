'use client';

/**
 * VerificationSuccessScreen
 * ─────────────────────────────────────────────────────────────────────────
 * Thin "smart" wrapper rendered by app/verify-success/page.tsx via Suspense.
 *
 * Responsibilities:
 *   1. Read the verified phone number from the URL search param written
 *      by OTPVerificationScreen after a successful OTP call.
 *   2. Fetch the real user display profile from /api/auth/otp/verified-profile.
 *   3. Map the returned fields to the VerifiedProfile prop shape.
 *   4. Render <VerificationSuccess /> (the converted design) with real data.
 *   5. Wire onContinue → /dashboard (existing app destination).
 *   6. Wire onNotYou → /login (return to login flow).
 *
 * What this component does NOT do:
 *   - It does not modify the OTP flow.
 *   - It does not create or modify a NextAuth session.
 *   - It does not hardcode profile data.
 *   - It does not modify middleware, JWT, or RBAC.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VerificationSuccess, { type VerifiedProfile } from '@/components/auth/VerificationSuccess';

// ─── Loading skeleton: matches the card's visual weight ──────────────────────
function LoadingSkeleton() {
  return (
    <div
      className="min-h-screen flex flex-col items-start sm:items-center justify-start sm:justify-center overflow-y-auto px-4 sm:px-8 py-5 sm:py-10"
      style={{ backgroundColor: '#f5f5f7' }}
    >
      <div
        className="w-full animate-pulse"
        style={{
          maxWidth: 560,
          margin: '0 auto',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 18,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <div className="h-8 w-28 rounded-lg" style={{ backgroundColor: '#e0e0e0' }} />
        </div>
        {/* Body */}
        <div className="px-8 pt-8 pb-7 flex flex-col items-center gap-5">
          <div className="rounded-full" style={{ width: 72, height: 72, backgroundColor: '#e0e0e0' }} />
          <div className="h-7 w-48 rounded-lg" style={{ backgroundColor: '#e0e0e0' }} />
          <div className="h-4 w-64 rounded" style={{ backgroundColor: '#e0e0e0' }} />
          <div className="w-full h-32 rounded-xl" style={{ backgroundColor: '#e0e0e0' }} />
          <div className="w-full h-12 rounded-full" style={{ backgroundColor: '#e0e0e0' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Error fallback ───────────────────────────────────────────────────────────
function ErrorFallback({ phone, onReturnToLogin }: { phone: string; onReturnToLogin: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#f5f5f7' }}
    >
      <div
        className="w-full max-w-sm text-center"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 18,
          border: '1px solid #e0e0e0',
          padding: '32px 24px',
        }}
      >
        <p style={{ fontSize: 28, marginBottom: 12 }}>✓</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1d1d1f', marginBottom: 8 }}>
          Verification Successful
        </h1>
        <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 8, lineHeight: 1.5 }}>
          Your identity has been verified for{' '}
          <span style={{ color: '#1d1d1f', fontWeight: 600 }}>+977 {phone}</span>.
        </p>
        <p style={{ fontSize: 13, color: '#8e8e93', marginBottom: 24 }}>
          Profile details could not be loaded. Proceed to the dashboard to continue.
        </p>
        <button
          onClick={() => (window.location.href = '/dashboard')}
          style={{
            width: '100%',
            backgroundColor: '#0066cc',
            color: '#ffffff',
            borderRadius: 9999,
            padding: '14px 0',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          Continue to Dashboard
        </button>
        <button
          onClick={onReturnToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#d4183d',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          Not You?
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function VerificationSuccessScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The OTPVerificationScreen encodes the 10-digit local phone in the query.
  const phoneParam = searchParams.get('phone') || '';

  const [profile, setProfile] = useState<VerifiedProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!phoneParam) {
      // No phone in URL — likely a direct navigation; send back to login.
      router.replace('/login');
      return;
    }

    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `/api/auth/otp/verified-profile?phone=${encodeURIComponent(phoneParam)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) {
          if (!cancelled) setStatus('error');
          return;
        }
        const json = await res.json();
        if (!cancelled && json.success && json.data) {
          setProfile(json.data as VerifiedProfile);
          setStatus('ready');
        } else {
          if (!cancelled) setStatus('error');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [phoneParam, router]);

  // ── Navigation callbacks ────────────────────────────────────────────────
  // onContinue: navigate to the main authenticated destination.
  // The existing Sukuna application routes authenticated users to /dashboard.
  const handleContinue = () => {
    router.push('/dashboard');
  };

  // onNotYou: user wants to use a different account.
  // Return to the login page so they can start the auth flow again.
  const handleNotYou = () => {
    router.push('/login');
  };

  // ── Render states ───────────────────────────────────────────────────────
  if (status === 'loading') {
    return <LoadingSkeleton />;
  }

  if (status === 'error' || !profile) {
    return <ErrorFallback phone={phoneParam} onReturnToLogin={handleNotYou} />;
  }

  return (
    <VerificationSuccess
      profile={profile}
      onContinue={handleContinue}
      onNotYou={handleNotYou}
    />
  );
}
