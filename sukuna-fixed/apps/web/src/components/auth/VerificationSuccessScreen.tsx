'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, GraduationCap, User } from 'lucide-react';

export function VerificationSuccessScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || '9876543210';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className="relative mb-8 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div key={i} initial={{ scale: 0.6, opacity: 0.6 }} animate={{ scale: 1.6 + i * 0.3, opacity: 0 }}
            transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute rounded-full" style={{ width: 80, height: 80, backgroundColor: 'rgba(0,122,255,0.15)' }} />
        ))}
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EBF5FF' }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: '#007AFF' }} strokeWidth={2} />
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ fontSize: 32, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', lineHeight: 1.15, textAlign: 'center', marginBottom: 8 }}>
        Verification Successful
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
        style={{ fontSize: 15, color: '#6E6E73', textAlign: 'center', lineHeight: 1.47, marginBottom: 36 }}>
        Your identity has been confirmed.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-sm border rounded-3xl overflow-hidden mb-8" style={{ borderColor: '#E5E5EA' }}>
        <div className="px-6 pt-6 pb-5 flex items-center gap-4" style={{ backgroundColor: '#F5F5F7', borderBottom: '1px solid #E5E5EA' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#007AFF' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>AS</span>
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em' }}>Ayush Shah</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="rounded-full px-2.5 py-0.5" style={{ fontSize: 11, fontWeight: 600, backgroundColor: '#EBF5FF', color: '#007AFF' }}>
                Student
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white divide-y" style={{ borderColor: '#F5F5F7' }}>
          {[
            { label: 'Student ID', value: 'STU-10284' },
            { label: 'School', value: 'Sukuna Secondary School' },
            { label: 'Phone', value: `+977 ${phoneNumber}` },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-6 py-4">
              <span style={{ fontSize: 14, color: '#6E6E73' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1F' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="w-full max-w-sm space-y-3">
        <button onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2"
          style={{ height: 56, borderRadius: 16, backgroundColor: '#007AFF', color: '#ffffff', fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <GraduationCap className="w-5 h-5" />
          Continue to Dashboard
        </button>
        <button onClick={() => router.push('/dashboard?tab=settings&sub=edit_profile')}
          className="w-full flex items-center justify-center gap-2"
          style={{ height: 56, borderRadius: 16, backgroundColor: 'transparent', border: '1.5px solid #007AFF', color: '#007AFF', fontSize: 17, fontWeight: 400, letterSpacing: '-0.02em' }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
          <User className="w-5 h-5" />
          View Profile
        </button>
      </motion.div>
    </div>
  );
}
