import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EducationalCarousel } from "./EducationalCarousel";
import { SukunaLogo } from "./SukunaLogo";
import type { Language } from "../App";

interface OTPVerificationProps {
  phone: string;
  onVerify: () => void;
  onBack: () => void;
  isMobile?: boolean;
  language: Language;
}

const strings = {
  en: {
    title: "Verification Code",
    subtitle: (p: string) => <>Code sent to <span style={{ color: "#1d1d1f", fontWeight: 600 }}>+977 {p}</span></>,
    expiresIn: (m: string, s: string) => <>Expires in <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{m}:{s}</span></>,
    expired: "Code expired",
    resend: "Resend Code",
    verify: "Verify Code",
    verifying: "Verifying…",
    error: "Incorrect code. Please try again.",
    back: "Back",
  },
  ne: {
    title: "प्रमाणीकरण कोड",
    subtitle: (p: string) => <>+977 {p} <span style={{ color: "#7a7a7a" }}>मा पठाइयो</span></>,
    expiresIn: (m: string, s: string) => <><span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{m}:{s}</span> मा समाप्त</>,
    expired: "कोड समाप्त भयो",
    resend: "पुन: पठाउनुहोस्",
    verify: "कोड प्रमाणित गर्नुहोस्",
    verifying: "प्रमाणित गर्दैछ…",
    error: "गलत कोड। कृपया पुन: प्रयास गर्नुहोस्।",
    back: "फिर्ता",
  },
};

export function OTPVerification({ phone, onVerify, onBack, isMobile = false, language }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const t = strings[language];

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60));
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    if (value.length > 1) {
      value.slice(0, 6).split("").forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d; });
      setOtp(newOtp);
      inputRefs.current[Math.min(index + value.length, 5)]?.focus();
      return;
    }
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (code === "000000") {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      onVerify();
    }
  };

  const handleResend = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    setError(false);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(d => d !== "");

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-60"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f5f5f7", border: "1px solid #e0e0e0" }}>
          <ArrowLeft size={14} style={{ color: "#1d1d1f" }} />
        </div>
        <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#7a7a7a", letterSpacing: "-0.224px" }}>
          {t.back}
        </span>
      </button>

      <div className="mb-8">
        <h1 style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          fontSize: isMobile ? "28px" : "32px",
          fontWeight: 600,
          color: "#1d1d1f",
          letterSpacing: "-0.374px",
          lineHeight: 1.1,
          marginBottom: "8px",
        }}>
          {t.title}
        </h1>
        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
          {t.subtitle(phone)}
        </p>
      </div>

      {/* OTP boxes */}
      <motion.div
        animate={shaking ? { x: [-6, 6, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex gap-2 mb-2"
      >
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={e => handleInput(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="text-center outline-none transition-all duration-150"
            style={{
              flex: "1 1 0",
              minWidth: 0,
              aspectRatio: "1 / 1",
              maxHeight: "52px",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontSize: "20px",
              fontWeight: 600,
              color: error ? "#ff3b30" : "#1d1d1f",
              background: error ? "rgba(255,59,48,0.04)" : digit ? "rgba(0,102,204,0.04)" : "#f5f5f7",
              border: `1px solid ${error ? "#ff3b30" : digit ? "#0066cc" : "#e0e0e0"}`,
              borderRadius: "11px",
              caretColor: "#0066cc",
              outline: digit && !error ? "2px solid rgba(0,102,204,0.15)" : "none",
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", color: "#ff3b30", marginBottom: "8px", letterSpacing: "-0.12px" }}
          >
            {t.error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-4 mb-7">
        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: timeLeft > 0 ? "#7a7a7a" : "#ff3b30", letterSpacing: "-0.224px" }}>
          {timeLeft > 0 ? t.expiresIn(minutes, seconds) : t.expired}
        </p>
        <button
          onClick={handleResend}
          disabled={timeLeft > 0}
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            color: timeLeft > 0 ? "#c7c7cc" : "#0066cc",
            letterSpacing: "-0.224px",
            background: "none",
            border: "none",
            cursor: timeLeft > 0 ? "not-allowed" : "pointer",
            padding: 0,
          }}
        >
          {t.resend}
        </button>
      </div>

      <button
        onClick={handleVerify}
        disabled={!isComplete || loading}
        className="w-full flex items-center justify-center gap-2 transition-transform active:scale-95"
        style={{
          height: "44px",
          borderRadius: "9999px",
          background: isComplete ? "#0066cc" : "#c7c7cc",
          color: "#ffffff",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          fontSize: "17px",
          fontWeight: 400,
          letterSpacing: "-0.374px",
          border: "none",
          cursor: isComplete && !loading ? "pointer" : "not-allowed",
          padding: "11px 22px",
        }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /><span>{t.verifying}</span></> : t.verify}
      </button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center" style={{ background: "#f5f5f7", padding: "20px 16px" }}>
        <div className="w-full flex flex-col" style={{ background: "#ffffff", borderRadius: "18px", border: "1px solid #e0e0e0", overflow: "hidden", maxWidth: "420px" }}>
          <div className="flex items-center px-5 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <SukunaLogo size="sm" variant="light" />
          </div>
          <div className="px-5 py-7">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#f5f5f7", padding: "48px" }}>
      <div
        className="w-full flex overflow-hidden"
        style={{ maxWidth: "1100px", borderRadius: "18px", border: "1px solid #e0e0e0", minHeight: "min(640px, 80vh)", maxHeight: "calc(100vh - 96px)" }}
      >
        <div className="flex flex-col" style={{ width: "45%", background: "#ffffff", flexShrink: 0 }}>
          <div className="flex items-center px-8 py-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <SukunaLogo size="sm" variant="light" />
          </div>
          <div className="flex-1 flex items-center px-10 py-8">
            <div style={{ width: "100%", maxWidth: "360px" }}>{content}</div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <EducationalCarousel />
        </div>
      </div>
    </div>
  );
}
