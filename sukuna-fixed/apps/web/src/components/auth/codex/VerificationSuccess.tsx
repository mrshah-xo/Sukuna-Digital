'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Info, X, Phone, Mail, AlertCircle, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { SukunaLogo } from "./SukunaLogo";
import type { Language } from "./types";

interface VerificationSuccessProps {
  isMobile?: boolean;
  language: Language;
}

const strings = {
  en: {
    title: "Verification\nComplete",
    grade: "Grade 11, A",
    dashboard: "Continue to Dashboard",
    viewProfile: "View Profile",
    privacyLine: (
      <>By using Sukuna Digital, you agree to our{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>Privacy Policy</a>,{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>Terms of Service</a>{" "}
        and{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>Data Protection</a>.
      </>
    ),
    modalTitle: "Account & Support",
    guidelines: [
      "Review your profile details before continuing to the dashboard.",
      "Your role is automatically assigned by your school administrator.",
      "All personal data is protected under school data governance policies.",
    ],
    incorrectTitle: "Profile information incorrect?",
    incorrectDesc: "Contact your school administrator or Sukuna Digital support to update your details.",
    email: "support@sukuna.edu.np",
    phone: "+977-01-4XXXXXX",
    close: "Got It",
  },
  ne: {
    title: "प्रमाणीकरण\nसम्पन्न भयो",
    grade: "कक्षा ११, A",
    dashboard: "ड्यासबोर्डमा जारी राख्नुहोस्",
    viewProfile: "प्रोफाइल हेर्नुहोस्",
    privacyLine: (
      <>Sukuna Digital प्रयोग गरेर, तपाईं हाम्रो{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>गोपनीयता नीति</a>,{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>सेवा सर्तहरू</a>{" "}
        र{" "}
        <a href="#" style={{ color: "#0066cc", textDecoration: "none" }}>डेटा सुरक्षा</a> सँग सहमत हुनुहुन्छ।
      </>
    ),
    modalTitle: "खाता र सहायता",
    guidelines: [
      "ड्यासबोर्डमा जानु अघि आफ्नो प्रोफाइल विवरण समीक्षा गर्नुहोस्।",
      "तपाईंको भूमिका विद्यालय प्रशासकद्वारा स्वतः तोकिन्छ।",
      "सबै व्यक्तिगत डेटा विद्यालय डेटा शासन नीतिहरू अन्तर्गत सुरक्षित छ।",
    ],
    incorrectTitle: "प्रोफाइल जानकारी गलत छ?",
    incorrectDesc: "आफ्नो विवरण अद्यावधिक गर्न विद्यालय प्रशासक वा Sukuna Digital सहायतासँग सम्पर्क गर्नुहोस्।",
    email: "support@sukuna.edu.np",
    phone: "+977-01-4XXXXXX",
    close: "बुझियो",
  },
};

function InfoModal({ open, onClose, t }: { open: boolean; onClose: () => void; t: typeof strings["en"] }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #e0e0e0" }}>
              <div className="px-6 pt-5 pb-4" style={{ background: "#0066cc" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Info size={15} color="#ffffff" />
                    <h3 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", fontSize: "16px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.374px" }}>
                      {t.modalTitle}
                    </h3>
                  </div>
                  <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)", border: "none", cursor: "pointer" }}>
                    <X size={12} color="#ffffff" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col gap-3 mb-5">
                  {t.guidelines.map((g, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(0,102,204,0.1)", minWidth: "20px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "#0066cc" }}>{i + 1}</span>
                      </div>
                      <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#1d1d1f", lineHeight: 1.43, letterSpacing: "-0.224px" }}>{g}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(255,59,48,0.04)", border: "1px solid rgba(255,59,48,0.1)" }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertCircle size={13} style={{ color: "#ff3b30" }} />
                    <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", fontWeight: 600, color: "#ff3b30", letterSpacing: "-0.12px" }}>{t.incorrectTitle}</p>
                  </div>
                  <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.5, letterSpacing: "-0.12px" }}>{t.incorrectDesc}</p>
                </div>
                <div className="flex flex-col gap-2 mb-5">
                  {[{ icon: Mail, text: t.email }, { icon: Phone, text: t.phone }].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#f5f5f7", border: "1px solid #f0f0f0" }}>
                      <Icon size={13} style={{ color: "#0066cc" }} />
                      <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#1d1d1f", letterSpacing: "-0.224px" }}>{text}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onClose} className="w-full rounded-full flex items-center justify-center transition-transform active:scale-95"
                  style={{ height: "44px", background: "#0066cc", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.374px", border: "none", cursor: "pointer" }}>
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function VerificationSuccess({ isMobile = false, language }: VerificationSuccessProps) {
  const [visible, setVisible] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const router = useRouter(); // BACKEND WIRED: real Next.js router
  const t = strings[language];

  useEffect(() => { setTimeout(() => setVisible(true), 300); }, []);

  // BACKEND WIRED: navigates to dashboard after session is established
  const handleDashboard = () => router.push('/dashboard');

  const successIcon = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative flex items-center justify-center"
      style={{ marginBottom: "24px" }}
    >
      {[1, 2].map(i => (
        <motion.div key={i}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 2.0, 2.6], opacity: [0.25, 0.1, 0] }}
          transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity, repeatDelay: 1.2 }}
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(52,199,89,0.12)" }}
        />
      ))}
      <div className="relative w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(52,199,89,0.1)", zIndex: 10 }}>
        <CheckCircle size={32} style={{ color: "#34c759" }} strokeWidth={2} />
      </div>
    </motion.div>
  );

  const heading = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="text-center"
      style={{ marginBottom: "8px" }}
    >
      <h1 style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        fontSize: isMobile ? "32px" : "40px",
        fontWeight: 600,
        color: "#1d1d1f",
        letterSpacing: "-0.374px",
        lineHeight: 1.1,
        whiteSpace: "pre-line" as const,
      }}>
        {t.title}
      </h1>
    </motion.div>
  );

  const grade = (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="text-center"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        fontSize: "17px",
        fontWeight: 400,
        color: "#7a7a7a",
        letterSpacing: "-0.374px",
        lineHeight: 1.47,
        marginBottom: "32px",
      }}
    >
      {t.grade}
    </motion.p>
  );

  const mobileButtons = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-col gap-3 w-full"
    >
      <button onClick={handleDashboard} className="w-full flex items-center justify-center gap-2 transition-transform active:scale-95"
        style={{ height: "44px", borderRadius: "9999px", background: "#0066cc", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.374px", border: "none", cursor: "pointer", padding: "11px 22px" }}>
        <GraduationCap size={16} />{t.dashboard}
      </button>
      <button onClick={() => router.push('/dashboard?tab=settings&sub=edit_profile')} className="w-full flex items-center justify-center transition-transform active:scale-95"
        style={{ height: "44px", borderRadius: "11px", background: "#fafafc", color: "#333333", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.224px", border: "1px solid #f0f0f0", cursor: "pointer", padding: "8px 14px" }}>
        {t.viewProfile}
      </button>
    </motion.div>
  );

  const desktopButtons = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex items-center gap-3 justify-center"
    >
      <button onClick={handleDashboard} className="flex items-center justify-center gap-2 transition-transform active:scale-95"
        style={{ height: "44px", borderRadius: "9999px", background: "#0066cc", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.374px", border: "none", cursor: "pointer", padding: "11px 22px" }}>
        <GraduationCap size={16} />{t.dashboard}
      </button>
      <button onClick={() => router.push('/dashboard?tab=settings&sub=edit_profile')} className="flex items-center justify-center transition-transform active:scale-95"
        style={{ height: "44px", borderRadius: "11px", background: "#fafafc", color: "#333333", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.224px", border: "1px solid #f0f0f0", cursor: "pointer", padding: "8px 14px" }}>
        {t.viewProfile}
      </button>
    </motion.div>
  );

  const privacyLine = (
    <motion.p
      initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
      className="text-center"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "10px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.5, letterSpacing: "-0.08px", marginTop: "20px" }}
    >
      {t.privacyLine}
    </motion.p>
  );

  if (isMobile) {
    return (
      <>
        <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} t={t} />
        <div className="w-full min-h-screen flex flex-col items-center justify-center" style={{ background: "#f5f5f7", padding: "20px 16px" }}>
          <div
            className="w-full flex flex-col"
            style={{ maxWidth: "420px", background: "#ffffff", borderRadius: "18px", border: "1px solid #e0e0e0", padding: "24px 20px" }}
          >
            <div className="flex items-center justify-between mb-8">
              <SukunaLogo size="sm" variant="light" />
              <button onClick={() => setInfoOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95"
                style={{ background: "#f5f5f7", border: "1px solid #e0e0e0", cursor: "pointer" }}>
                <Info size={14} style={{ color: "#0066cc" }} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              {successIcon}
              {heading}
              {grade}
              <div className="w-full">{mobileButtons}</div>
              {privacyLine}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} t={t} />
      <div className="w-full min-h-screen flex flex-col items-center justify-center" style={{ background: "#f5f5f7", padding: "48px" }}>
        <div
          className="w-full"
          style={{ maxWidth: "860px", background: "#ffffff", borderRadius: "18px", border: "1px solid #e0e0e0", padding: "48px 64px" }}
        >
          <div className="flex items-center justify-between mb-12">
            <SukunaLogo size="sm" variant="light" />
            <button onClick={() => setInfoOpen(true)} className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95"
              style={{ background: "#f5f5f7", border: "1px solid #e0e0e0", cursor: "pointer" }}>
              <Info size={14} style={{ color: "#0066cc" }} />
            </button>
          </div>
          <div className="flex flex-col items-center">
            {successIcon}
            {heading}
            {grade}
            {desktopButtons}
            {privacyLine}
          </div>
        </div>
      </div>
    </>
  );
}
