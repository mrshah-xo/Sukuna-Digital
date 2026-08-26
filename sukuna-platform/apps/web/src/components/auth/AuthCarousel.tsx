'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: 'Notes Mandir',
    description: 'Access all your study materials, PDFs, and past papers instantly. Never lose a note again.',
    color: 'bg-blue-50',
    accent: 'text-blue-600'
  },
  {
    title: 'Sukuna Book',
    description: 'Connect with peers, share knowledge, and participate in school discussions on a safe platform.',
    color: 'bg-indigo-50',
    accent: 'text-indigo-600'
  },
  {
    title: 'Live Teacher',
    description: 'Message teachers directly, attend live sessions, and clear your doubts in real-time.',
    color: 'bg-emerald-50',
    accent: 'text-emerald-600'
  },
  {
    title: 'School Transport',
    description: 'Track your bus in real-time. Know exactly when it will arrive at your stop.',
    color: 'bg-amber-50',
    accent: 'text-amber-600'
  }
];

export default function AuthCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current] ?? slides[0]!;

  return (
    <div className="w-full h-full flex flex-col p-12 overflow-hidden relative">
      <div className="flex-1 flex flex-col justify-center items-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`w-full max-w-md aspect-square ${slide.color} rounded-[32px] flex flex-col items-center justify-center p-10 text-center shadow-sm border border-white`}
          >
            <div className={`w-20 h-20 bg-white rounded-2xl shadow-sm mb-8 flex items-center justify-center ${slide.accent}`}>
               <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-4">{slide.title}</h3>
            <p className="text-[#6E6E73] leading-relaxed text-lg">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-[#007AFF]' : 'w-2 bg-[#E5E7EB]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
