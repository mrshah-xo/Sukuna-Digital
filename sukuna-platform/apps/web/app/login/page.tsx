'use client';

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/auth/codex/SplashScreen";
import { PhoneVerification } from "@/components/auth/codex/PhoneVerification";
import { OTPVerification } from "@/components/auth/codex/OTPVerification";
import { NotRegisteredScreen } from "@/components/auth/codex/NotRegisteredScreen";
import VerificationSuccess, { type VerifiedProfile } from "@/components/auth/VerificationSuccess";
import type { Language } from "@/components/auth/codex/types";

type Screen = "splash" | "phone" | "otp" | "success" | "notRegistered";

// ─── Thin loader that fetches the verified profile and renders the target design ──
function VerificationSuccessLoader({ phone, onNotYou }: { phone: string; onNotYou: () => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<VerifiedProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await fetch(
          `/api/auth/otp/verified-profile?phone=${encodeURIComponent(phone)}`,
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
    return () => { cancelled = true; };
  }, [phone]);

  const handleContinue = () => router.push('/dashboard');
  const handleNotYou = () => onNotYou();

  // Loading state — matches the target card dimensions
  if (status === 'loading') {
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
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div className="h-8 w-28 rounded-lg" style={{ backgroundColor: '#e0e0e0' }} />
          </div>
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

  // Error fallback — still uses the target design's visual language
  if (status === 'error' || !profile) {
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
            onClick={handleNotYou}
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

  return (
    <VerificationSuccess
      profile={profile}
      onContinue={handleContinue}
      onNotYou={handleNotYou}
    />
  );
}

// ─── Main login page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [phone, setPhone] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSendOTP = (phoneNumber: string) => {
    setPhone(phoneNumber);
    // Real OTP has been sent via the API inside PhoneVerification.
    // If it succeeds, it calls this callback.
    setScreen("otp");
  };

  const langProps = { language, onLanguageChange: setLanguage };

  return (
    <div className="size-full min-h-screen" style={{ background: "#f5f5f7" }}>
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <SplashScreen onComplete={() => setScreen("phone")} />
          </motion.div>
        )}
        {screen === "phone" && (
          <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <PhoneVerification onSendOTP={handleSendOTP} isMobile={isMobile} {...langProps} />
          </motion.div>
        )}
        {screen === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <OTPVerification phone={phone} onVerify={() => setScreen("success")} onBack={() => setScreen("phone")} isMobile={isMobile} language={language} />
          </motion.div>
        )}
        {screen === "success" && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <VerificationSuccessLoader phone={phone} onNotYou={() => { setPhone(""); setScreen("phone"); }} />
          </motion.div>
        )}
        {screen === "notRegistered" && (
          <motion.div key="notRegistered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <NotRegisteredScreen phone={phone} onBack={() => setScreen("phone")} isMobile={isMobile} language={language} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
