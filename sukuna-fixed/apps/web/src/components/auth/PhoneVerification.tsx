'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PhoneVerification({ onSendOTP }: { onSendOTP: (phone: string) => void }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      onSendOTP(phone);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-3">Welcome Back</h2>
        <p className="text-[#6E6E73] text-sm leading-relaxed">
          Enter your registered mobile number to continue. We'll send you a verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#1D1D1F] ml-1">Mobile Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98XXXXXXXX"
            className={`w-full px-5 py-4 rounded-[16px] border ${error ? 'border-[#FF3B30]' : 'border-[#E5E7EB]'} bg-[#F8FAFC] text-[#1D1D1F] placeholder:text-[#6E6E73] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all text-lg tracking-wide`}
          />
          {error && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[#FF3B30] text-xs mt-1 ml-1 font-medium">{error}</motion.p>}
        </div>

        <button
          type="submit"
          disabled={loading || phone.length < 10}
          className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium py-4 rounded-[16px] transition-colors disabled:opacity-50 mt-2 shadow-sm"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-[#6E6E73]">
          By continuing, you agree to our <a href="#" className="text-[#007AFF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#007AFF] hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
