'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function OTPVerificationScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '9876543210';

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Incorrect code. Please try again.');
  const [isVerifying, setIsVerifying] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown === 0) { setCanResend(true); return; }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const focusNext = (index: number) => { if (index < 5) inputRefs.current[index + 1]?.focus(); };
  const focusPrev = (index: number) => { if (index > 0) inputRefs.current[index - 1]?.focus(); };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...otp]; next[index] = digit;
    setOtp(next); setError(false);
    if (digit) focusNext(index);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (otp[index]) { const next = [...otp]; next[index] = ''; setOtp(next); }
      else focusPrev(index);
    } else if (e.key === 'ArrowLeft') focusPrev(index);
    else if (e.key === 'ArrowRight') focusNext(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    const next = Array(6).fill('');
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const filled = otp.join('');
  const isComplete = filled.length === 6;

  const handleVerify = async () => {
    if (!isComplete || isVerifying) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+977${phoneNumber}`, code: filled }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        router.push(`/verify-success?phone=${encodeURIComponent(phoneNumber)}`);
      } else {
        setErrorMsg(data.message || 'Incorrect code. Please try again.');
        setError(true);
        setShakeKey((k) => k + 1);
        setOtp(Array(6).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setError(true);
      setShakeKey((k) => k + 1);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setCountdown(60); setCanResend(false);
    setOtp(Array(6).fill('')); setError(false);
    inputRefs.current[0]?.focus();
    try {
      await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+977${phoneNumber}` }),
      });
    } catch { /* dev mode */ }
  };

  const mm = String(Math.floor(countdown / 60)).padStart(1, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-14 pb-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-8" style={{ color: '#007AFF', fontSize: 17 }}>
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontWeight: 400 }}>Back</span>
        </button>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#EBF5FF' }}>
          <ShieldCheck className="w-8 h-8" style={{ color: '#007AFF' }} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 32, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', lineHeight: 1.15 }} className="mb-2">
          Verification Code
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.47 }}>
          Enter the 6-digit code sent to{' '}
          <span style={{ color: '#1D1D1F', fontWeight: 600 }}>+977 {phoneNumber}</span>
        </motion.p>
      </div>

      <div className="flex-1 px-6 pt-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-3xl border p-6 mb-4" style={{ borderColor: '#E5E5EA', backgroundColor: '#FAFAFA' }}>
          <motion.div key={shakeKey} animate={error ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}
            className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => { inputRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                autoFocus={i === 0}
                className="text-center transition-all outline-none"
                style={{
                  width: 46, height: 56, borderRadius: 14,
                  border: `2px solid ${error ? '#FF3B30' : digit ? '#007AFF' : '#E5E5EA'}`,
                  backgroundColor: digit ? '#EBF5FF' : '#ffffff',
                  fontSize: 24, fontWeight: 700, color: '#1D1D1F',
                  boxShadow: digit && !error ? '0 0 0 3px rgba(0,122,255,0.12)' : 'none',
                }}
              />
            ))}
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center mb-4" style={{ fontSize: 13, color: '#FF3B30' }}>
                {errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Dev mode hint */}
          <div className="mb-4 p-3 rounded-xl text-center" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p style={{ fontSize: 12, color: '#92400E' }}>🔧 Dev Mode: Check VS Code terminal for OTP</p>
          </div>

          <motion.button onClick={handleVerify} disabled={!isComplete || isVerifying} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2"
            style={{
              height: 56, borderRadius: 16,
              backgroundColor: isComplete ? '#007AFF' : '#E5E5EA',
              color: isComplete ? '#ffffff' : '#6E6E73',
              fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', transition: 'background-color 0.2s',
            }}>
            {isVerifying ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : 'Verify OTP'}
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
          {!canResend ? (
            <p style={{ fontSize: 14, color: '#6E6E73' }}>
              Resend code in{' '}
              <span style={{ color: '#1D1D1F', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</span>
            </p>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: '#6E6E73', marginBottom: 8 }}>Didn&apos;t receive the code?</p>
              <button onClick={handleResend} style={{ fontSize: 15, color: '#007AFF', fontWeight: 600 }}>Resend Code</button>
            </div>
          )}
        </motion.div>

        <div className="mt-auto pt-8 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" style={{ color: '#34C759' }} />
          <p style={{ fontSize: 12, color: '#6E6E73' }}>Secured by Sukuna · End-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
}
