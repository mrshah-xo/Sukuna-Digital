'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VerificationSuccess({ onComplete }: { onComplete: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();

  // Mocking profile data until we fetch real data in the component
  const name = session?.user?.name || 'Ayush Sharma';
  const role = (session?.user as any)?.role || 'Student';
  const id = (session?.user as any)?.id ? `STU-${(session?.user as any).id.substring(0, 5).toUpperCase()}` : 'STU-10284';

  useEffect(() => {
    // Hold on screen for 3 seconds before auto-redirecting
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-full bg-[#F8FAFC] border-4 border-white shadow-md overflow-hidden">
          {/* Avatar Placeholder */}
          <img src="https://ui-avatars.com/api/?name=Ayush+Sharma&background=007AFF&color=fff&size=200" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="absolute bottom-0 right-0 w-8 h-8 bg-[#34C759] border-[3px] border-white rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">{name}</h2>
        <p className="text-[#007AFF] font-medium text-sm mt-1 uppercase tracking-widest">{role}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="bg-[#F8FAFC] w-full rounded-[16px] py-4 mt-6 mb-8 border border-[#E5E7EB]"
      >
        <p className="text-xs text-[#6E6E73] uppercase tracking-wider mb-1">ID Number</p>
        <p className="text-lg font-medium text-[#1D1D1F] font-mono">{id}</p>
        <div className="h-[1px] w-12 bg-[#E5E7EB] mx-auto my-3" />
        <p className="text-sm text-[#1D1D1F] font-medium">Sukuna Secondary School</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onComplete}
        className="w-full bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-medium py-4 rounded-[16px] transition-colors shadow-sm mb-3"
      >
        Continue to Dashboard
      </motion.button>
      
      <motion.button
        onClick={() => router.push('/dashboard?tab=settings&sub=edit_profile')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[#6E6E73] font-medium text-sm hover:text-[#1D1D1F] transition-colors"
      >
        View Profile
      </motion.button>
    </div>
  );
}
