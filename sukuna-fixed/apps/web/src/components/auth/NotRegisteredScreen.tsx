'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, AlertCircle } from 'lucide-react';

export function NotRegisteredScreen() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-14 pb-8">
      <button onClick={() => router.push('/login')} className="flex items-center gap-2 mb-8 self-start" style={{ color: '#007AFF', fontSize: 17 }}>
        <ArrowLeft className="w-5 h-5" /><span>Back</span>
      </button>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="flex-1 flex flex-col max-w-sm w-full mx-auto">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFF1F2' }}>
          <AlertCircle className="w-8 h-8" style={{ color: '#FF3B30' }} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 10 }}>
          Number Not Registered
        </h1>
        <p style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.47, marginBottom: 32 }}>
          This phone number is not registered with Sukuna School. Please contact your school administrator to get access.
        </p>
        <div className="rounded-3xl border overflow-hidden mb-8" style={{ borderColor: '#E5E5EA' }}>
          <div className="px-5 py-4 border-b" style={{ backgroundColor: '#F5F5F7', borderColor: '#E5E5EA' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F' }}>Contact School Admin</p>
          </div>
          <div className="bg-white divide-y" style={{ borderColor: '#F5F5F7' }}>
            {[
              { icon: Phone, color: '#007AFF', label: 'Phone', value: '+977 9876543210' },
              { icon: Mail, color: '#007AFF', label: 'Email', value: 'admin@sukuna.school' },
            ].map(({ icon: Icon, color, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EBF5FF' }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#6E6E73' }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1D1D1F' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => router.push('/login')} className="w-full flex items-center justify-center gap-2"
          style={{ height: 56, borderRadius: 16, backgroundColor: '#007AFF', color: '#ffffff', fontSize: 17, fontWeight: 600 }}>
          <ArrowLeft className="w-5 h-5" />Back to Login
        </button>
      </motion.div>
    </div>
  );
}
