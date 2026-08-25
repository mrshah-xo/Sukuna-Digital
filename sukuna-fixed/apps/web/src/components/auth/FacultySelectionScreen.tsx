'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FlaskConical, Scale, Briefcase, Check } from 'lucide-react';

const faculties = [
  { id: 'science', name: 'Science', icon: FlaskConical, gradient: 'from-blue-500 to-cyan-500', description: 'Physics, Chemistry, Biology' },
  { id: 'law', name: 'Law', icon: Scale, gradient: 'from-purple-500 to-pink-500', description: 'Legal Studies & Practice' },
  { id: 'management', name: 'Management', icon: Briefcase, gradient: 'from-orange-500 to-red-500', description: 'Business & Administration' },
];

export function FacultySelectionScreen() {
  const router = useRouter();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedFaculty) {
      if (typeof window !== 'undefined') localStorage.setItem('sukuna-faculty', selectedFaculty);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      <div className="pt-12 pb-32 px-6 rounded-b-[3rem] shadow-xl"
        style={{ background: 'linear-gradient(135deg, #1d5bd6, #2563EB)' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-white mb-3">Select Faculty</h2>
          <p className="text-blue-100 text-lg">Choose your academic stream</p>
        </motion.div>
      </div>
      <div className="flex-1 px-6 -mt-20 pb-6">
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="space-y-4 mb-6">
          {faculties.map((faculty, index) => {
            const Icon = faculty.icon;
            const isSelected = selectedFaculty === faculty.id;
            return (
              <motion.button key={faculty.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                onClick={() => setSelectedFaculty(faculty.id)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${faculty.gradient} rounded-xl p-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: '#1D1D1F' }}>{faculty.name}</h3>
                    <p className="text-sm" style={{ color: '#6E6E73' }}>{faculty.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <button onClick={handleContinue} disabled={!selectedFaculty}
            className="w-full h-14 rounded-xl text-lg font-semibold transition-all"
            style={{ backgroundColor: selectedFaculty ? '#007AFF' : '#E5E5EA', color: selectedFaculty ? '#ffffff' : '#6E6E73', cursor: selectedFaculty ? 'pointer' : 'not-allowed' }}>
            Continue to Dashboard
          </button>
        </motion.div>
        <p className="text-center text-sm mt-6" style={{ color: '#6E6E73' }}>You can change your faculty later from settings</p>
      </div>
    </div>
  );
}
