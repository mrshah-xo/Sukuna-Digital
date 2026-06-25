import { useState } from "react";
import { motion } from "motion/react";
import { HelpCircle, ChevronDown, Loader2, ShieldCheck } from "lucide-react";
import { HelpModal } from "./HelpModal";
import { EducationalCarousel } from "./EducationalCarousel";
import { LiquidGlassLang } from "./LiquidGlassLang";
import { SukunaLogo } from "./SukunaLogo";
import type { Language } from "../App";

interface PhoneVerificationProps {
  onSendOTP: (phone: string) => void;
  isMobile?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const strings = {
  en: {
    title: "Verify Your\nPhone Number",
    subtitle: "Enter the mobile number registered with your school account.",
    placeholder: "9XXXXXXXXX",
    sendOtp: "Send Verification Code",
    sending: "Sending…",
    trust: "Only school-approved phone numbers can access Sukuna Digital.",
    errorFormat: "Enter a valid Nepal number starting with 97 or 98.",
    errorLength: "Phone number must be 10 digits.",
  },
  ne: {
    title: "आफ्नो फोन नम्बर\nप्रमाणित गर्नुहोस्",
    subtitle: "तपाईंको विद्यालय खातामा दर्ता गरिएको मोबाइल नम्बर प्रविष्ट गर्नुहोस्।",
    placeholder: "९XXXXXXXXX",
    sendOtp: "प्रमाणीकरण कोड पठाउनुहोस्",
    sending: "पठाउँदैछ…",
    trust: "केवल विद्यालय-अनुमोदित फोन नम्बरहरूले Sukuna Digital पहुँच गर्न सक्छन्।",
    errorFormat: "97 वा 98 बाट सुरु हुने नेपाल मोबाइल नम्बर प्रविष्ट गर्नुहोस्।",
    errorLength: "फोन नम्बर १० अंकको हुनुपर्छ।",
  },
};

export function PhoneVerification({ onSendOTP, isMobile = false, language, onLanguageChange }: PhoneVerificationProps) {
  const [phone, setPhone] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const t = strings[language];

  const validate = (num: string): string => {
    if (num.length < 10) return t.errorLength;
    if (!num.startsWith("97") && !num.startsWith("98")) return t.errorFormat;
    return "";
  };

  const isValid = phone.length === 10 && (phone.startsWith("97") || phone.startsWith("98"));

  const handleSend = async () => {
    const err = validate(phone);
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSendOTP(phone);
  };

  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            fontSize: isMobile ? "28px" : "32px",
            fontWeight: 600,
            color: "#1d1d1f",
            letterSpacing: "-0.374px",
            lineHeight: 1.1,
            whiteSpace: "pre-line" as const,
          }}>
            {t.title}
          </h1>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
            style={{ background: "#f5f5f7", border: "1px solid #e0e0e0", cursor: "pointer" }}
          >
            <HelpCircle size={14} style={{ color: "#7a7a7a" }} />
          </button>
        </div>
        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Phone input */}
      <div className="mb-6">
        <div
          className="flex items-center overflow-hidden transition-all duration-200"
          style={{
            border: `1px solid ${error ? "#ff3b30" : focused ? "#0066cc" : "#e0e0e0"}`,
            borderRadius: "11px",
            height: "48px",
            background: "#ffffff",
            outline: focused && !error ? "3px solid rgba(0,102,204,0.12)" : error ? "3px solid rgba(255,59,48,0.1)" : "none",
            outlineOffset: "0px",
          }}
        >
          <div
            className="flex items-center gap-1.5 px-3.5 h-full flex-shrink-0 select-none"
            style={{ borderRight: "1px solid #e0e0e0" }}
          >
            <span style={{ fontSize: "14px" }}>🇳🇵</span>
            <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#1d1d1f", letterSpacing: "-0.224px" }}>+977</span>
            <ChevronDown size={12} style={{ color: "#7a7a7a" }} />
          </div>
          <input
            type="tel"
            placeholder={t.placeholder}
            value={phone}
            onChange={e => { setPhone(e.target.value.replace(/[^0-9]/g, "")); setError(""); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={10}
            className="flex-1 h-full px-4 outline-none bg-transparent"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, color: "#1d1d1f", letterSpacing: "0.4px" }}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", color: "#ff3b30", marginTop: "6px", marginLeft: "2px", letterSpacing: "-0.12px" }}
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 transition-transform active:scale-95"
        style={{
          height: "44px",
          borderRadius: "9999px",
          background: isValid ? "#0066cc" : "#c7c7cc",
          color: "#ffffff",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          fontSize: "17px",
          fontWeight: 400,
          letterSpacing: "-0.374px",
          border: "none",
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          padding: "11px 22px",
        }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /><span>{t.sending}</span></> : t.sendOtp}
      </button>

      {isMobile && (
        <div className="mt-5 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "#f5f5f7", border: "1px solid #e0e0e0" }}>
          <ShieldCheck size={15} style={{ color: "#0066cc", flexShrink: 0 }} />
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.5, letterSpacing: "-0.12px" }}>
            {t.trust}
          </p>
        </div>
      )}
    </motion.div>
  );

  if (isMobile) {
    return (
      <>
        <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        <div className="w-full min-h-screen flex flex-col items-center" style={{ background: "#f5f5f7", padding: "20px 16px" }}>
          <div className="w-full flex flex-col" style={{ background: "#ffffff", borderRadius: "18px", border: "1px solid #e0e0e0", overflow: "hidden", maxWidth: "420px" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
              <SukunaLogo size="sm" variant="light" />
              <LiquidGlassLang language={language} onChange={onLanguageChange} variant="light" />
            </div>
            <div className="px-5 py-7">{formContent}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#f5f5f7", padding: "48px" }}>
        <div
          className="w-full flex overflow-hidden"
          style={{
            maxWidth: "1100px",
            borderRadius: "18px",
            border: "1px solid #e0e0e0",
            minHeight: "min(640px, 80vh)",
            maxHeight: "calc(100vh - 96px)",
          }}
        >
          <div className="flex flex-col" style={{ width: "45%", background: "#ffffff", flexShrink: 0 }}>
            <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
              <SukunaLogo size="sm" variant="light" />
              <LiquidGlassLang language={language} onChange={onLanguageChange} variant="light" />
            </div>
            <div className="flex-1 flex items-center px-10 py-8">
              <div style={{ width: "100%", maxWidth: "360px" }}>{formContent}</div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <EducationalCarousel />
          </div>
        </div>
      </div>
    </>
  );
}
