'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, HelpCircle, ChevronRight, X, BookOpen, BarChart3, CalendarDays, MessageSquare } from 'lucide-react';

type Lang = 'en' | 'np';

const slides = [
  { icon: BookOpen, title: 'Sukuna Book', subtitle: 'Educational discussions · Teacher stars · Student achievements', bg: '#EBF5FF', iconColor: '#007AFF' },
  { icon: BookOpen, title: 'Notes Mandir', subtitle: 'Subject notes · Learning resources · PDF materials', bg: '#F0FDF4', iconColor: '#34C759' },
  { icon: BarChart3, title: 'Attendance Dashboard', subtitle: 'Attendance percentage · Academic insights · Student progress', bg: '#FFF7ED', iconColor: '#FF9500' },
  { icon: MessageSquare, title: 'Live Teacher', subtitle: 'Teacher communication · Homework support · Question sharing', bg: '#FDF4FF', iconColor: '#AF52DE' },
  { icon: CalendarDays, title: 'School Calendar', subtitle: 'Exams · Events · Holidays', bg: '#FFF1F2', iconColor: '#FF3B30' },
];

const t = {
  en: {
    title: 'Verify Your Phone Number',
    subtitle: 'Enter the mobile number registered with your school account.',
    placeholder: '98XXXXXXXX',
    sendOTP: 'Send OTP',
    privacy: 'By continuing, you agree to the',
    privacyLink: 'Privacy Policy',
    andText: 'and',
    termsLink: 'Terms of Service',
    trust: 'Only school-approved phone numbers can access Sukuna.',
    helpTitle: 'Why do we need your phone number?',
    helpItems: ['Verify school identity', 'Secure account access', 'Protect student information', 'Enable official communication'],
    helpCTA: 'Got It',
  },
  np: {
    title: 'आफ्नो फोन नम्बर प्रमाणित गर्नुहोस्',
    subtitle: 'तपाईंको स्कूल खातामा दर्ता भएको मोबाइल नम्बर प्रविष्ट गर्नुहोस्।',
    placeholder: '98XXXXXXXX',
    sendOTP: 'OTP पठाउनुहोस्',
    privacy: 'जारी राखेर, तपाईं सहमत हुनुहुन्छ',
    privacyLink: 'गोपनीयता नीति',
    andText: 'र',
    termsLink: 'सेवाका शर्तहरू',
    trust: 'केवल स्कूल-अनुमोदित फोन नम्बरहरूले Sukuna पहुँच गर्न सक्छन्।',
    helpTitle: 'हामीलाई तपाईंको फोन नम्बर किन चाहिन्छ?',
    helpItems: ['स्कूल पहिचान प्रमाणित गर्न', 'सुरक्षित खाता पहुँच', 'विद्यार्थी जानकारी सुरक्षित राख्न', 'आधिकारिक सञ्चार सक्षम गर्न'],
    helpCTA: 'ठीक छ',
  },
};

export function LoginScreen() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [phone, setPhone] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const tx = t[lang];

  useEffect(() => {
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const handleSend = async () => {
    if (phone.length !== 10) return;
    setIsLoading(true);
    try {
      // Send real OTP via Aakash SMS
      await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+977${phone}` }),
      });
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } catch {
      // Dev mode: still navigate even if SMS fails
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const slide = slides[slideIndex];
  const SlideIcon = slide?.icon;

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT / FORM PANEL */}
      <div className="flex flex-col w-full lg:w-[45%] px-6 py-8 lg:px-12 lg:py-12 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10 lg:mb-14">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em' }}>Sukuna</span>
          </div>
          <div className="flex rounded-full overflow-hidden border" style={{ borderColor: '#E5E5EA' }}>
            {(['en', 'np'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)} className="px-3 py-1.5 transition-colors"
                style={{ fontSize: 13, fontWeight: lang === l ? 600 : 400, backgroundColor: lang === l ? '#007AFF' : '#ffffff', color: lang === l ? '#ffffff' : '#6E6E73' }}>
                {l === 'en' ? '🇬🇧 EN' : '🇳🇵 NP'}
              </button>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto lg:mx-0">
          <div className="flex items-start gap-2 mb-2">
            <motion.h1 key={lang + 'title'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 32, fontWeight: 700, color: '#1D1D1F', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
              {tx.title}
            </motion.h1>
            <button onClick={() => setShowHelp(true)} className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-[#F5F5F7]">
              <HelpCircle className="w-5 h-5" style={{ color: '#007AFF' }} />
            </button>
          </div>
          <motion.p key={lang + 'sub'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ fontSize: 15, color: '#6E6E73', lineHeight: 1.47, marginBottom: 32 }}>
            {tx.subtitle}
          </motion.p>

          {/* Phone field */}
          <div className="mb-6">
            <label style={{ fontSize: 13, fontWeight: 600, color: '#6E6E73', letterSpacing: '-0.01em', display: 'block', marginBottom: 8 }}>
              {lang === 'en' ? 'Phone Number' : 'फोन नम्बर'}
            </label>
            <div className="flex items-center border rounded-2xl overflow-hidden" style={{ borderColor: '#E5E5EA', height: 56 }}>
              <div className="flex items-center gap-2 px-4 border-r h-full flex-shrink-0" style={{ borderColor: '#E5E5EA', backgroundColor: '#F5F5F7' }}>
                <span style={{ fontSize: 20 }}>🇳🇵</span>
                <span style={{ fontSize: 13, color: '#1D1D1F', fontWeight: 400 }}>+977</span>
              </div>
              <input type="tel" placeholder={tx.placeholder} value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 h-full px-4 outline-none bg-white"
                style={{ fontSize: 17, color: '#1D1D1F', letterSpacing: '-0.02em' }}
              />
            </div>
          </div>

          {/* Send OTP button */}
          <motion.button onClick={handleSend} disabled={phone.length !== 10 || isLoading} whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 mb-6"
            style={{
              height: 56, borderRadius: 16,
              backgroundColor: phone.length === 10 ? '#007AFF' : '#E5E5EA',
              color: phone.length === 10 ? '#ffffff' : '#6E6E73',
              fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em',
              cursor: phone.length === 10 ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s',
            }}>
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (<>{tx.sendOTP}<ChevronRight className="w-4 h-4" /></>)}
          </motion.button>

          <p style={{ fontSize: 12, color: '#6E6E73', textAlign: 'center', lineHeight: 1.5 }}>
            {tx.privacy}{' '}<span style={{ color: '#007AFF', cursor: 'pointer' }}>{tx.privacyLink}</span>{' '}{tx.andText}{' '}
            <span style={{ color: '#007AFF', cursor: 'pointer' }}>{tx.termsLink}</span>.
          </p>
        </div>

        <div className="mt-8 rounded-2xl px-5 py-4 flex items-center gap-3" style={{ backgroundColor: '#F5F5F7' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#007AFF' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <p style={{ fontSize: 12, color: '#6E6E73', lineHeight: 1.5 }}>{tx.trust}</p>
        </div>
      </div>

      {/* RIGHT / CAROUSEL PANEL (desktop only) */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#F5F5F7' }}>
        <div className="w-full max-w-lg px-12">
          <AnimatePresence mode="wait">
            <motion.div key={slideIndex} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-3xl overflow-hidden" style={{ backgroundColor: slide?.bg, padding: '48px 40px' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: slide?.iconColor + '20' }}>
                {SlideIcon && <SlideIcon className="w-8 h-8" style={{ color: slide?.iconColor }} />}
              </div>
              <h2 style={{ fontSize: 34, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 12 }}>
                {slide?.title}
              </h2>
              <p style={{ fontSize: 17, color: '#6E6E73', lineHeight: 1.47, marginBottom: 32 }}>{slide?.subtitle}</p>
              <div className="space-y-3">
                {[100, 85, 70].map((w, i) => (
                  <div key={i} className="h-3 rounded-full" style={{ width: `${w}%`, backgroundColor: slide?.iconColor + '30' }} />
                ))}
                <div className="flex gap-3 mt-4">
                  <div className="h-10 rounded-xl flex-1" style={{ backgroundColor: slide?.iconColor + '20' }} />
                  <div className="h-10 rounded-xl" style={{ width: 64, backgroundColor: slide?.iconColor }} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIndex(i)} className="transition-all rounded-full"
                style={{ width: i === slideIndex ? 20 : 6, height: 6, backgroundColor: i === slideIndex ? '#007AFF' : '#D1D1D6' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setShowHelp(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full"
              style={{ boxShadow: 'rgba(0,0,0,0.22) 0 8px 40px 0' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontSize: 21, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em' }}>{tx.helpTitle}</h3>
                <button onClick={() => setShowHelp(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F7' }}>
                  <X className="w-4 h-4" style={{ color: '#6E6E73' }} />
                </button>
              </div>
              <ul className="space-y-3 mb-8">
                {tx.helpItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#007AFF' }}>
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span style={{ fontSize: 15, color: '#1D1D1F', lineHeight: 1.47 }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowHelp(false)} className="w-full"
                style={{ height: 56, borderRadius: 16, backgroundColor: '#007AFF', color: '#ffffff', fontSize: 17, fontWeight: 600 }}>
                {tx.helpCTA}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
