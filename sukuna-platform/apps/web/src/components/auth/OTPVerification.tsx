'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function OTPVerification({ phone, onVerify, onBack }: { phone: string; onVerify: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    setError(false);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit
    if (newOtp.every(v => v !== '')) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (code: string) => {
    setLoading(true);
    
    // Use NextAuth signIn with 'otp' credentials provider
    const res = await signIn('otp', {
      redirect: false,
      phone,
      otp: code
    });

    if (res?.error) {
      setError(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      onVerify();
    }
    setLoading(false);
  };

  return (
    <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex flex-col w-full">
      <button onClick={onBack} className="text-[#007AFF] text-sm font-medium mb-8 self-start hover:underline">← Back</button>
      
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-3">Verify Number</h2>
        <p className="text-[#6E6E73] text-sm leading-relaxed">
          We've sent a 6-digit code to <span className="font-semibold text-[#1D1D1F]">+977 {phone}</span>
        </p>
      </div>

      <div className="flex justify-between gap-2 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-medium rounded-[16px] border ${error ? 'border-[#FF3B30] bg-[#FF3B30]/5 text-[#FF3B30]' : 'border-[#E5E7EB] bg-[#F8FAFC] text-[#1D1D1F]'} focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all`}
          />
        ))}
      </div>

      <button
        disabled={loading || otp.join('').length < 6}
        onClick={() => verifyOTP(otp.join(''))}
        className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium py-4 rounded-[16px] transition-colors disabled:opacity-50 shadow-sm"
      >
        {loading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#6E6E73]">
          {countdown > 0 ? (
            <span>Resend code in <span className="text-[#1D1D1F] font-medium">{countdown}s</span></span>
          ) : (
            <button onClick={() => { setCountdown(60); /* call sendOTP */ }} className="text-[#007AFF] font-medium hover:underline">Resend Code</button>
          )}
        </p>
      </div>
    </motion.div>
  );
}
