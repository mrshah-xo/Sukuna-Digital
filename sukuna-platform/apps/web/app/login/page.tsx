'use client';

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SplashScreen } from "@/components/auth/codex/SplashScreen";
import { PhoneVerification } from "@/components/auth/codex/PhoneVerification";
import { OTPVerification } from "@/components/auth/codex/OTPVerification";
import { VerificationSuccess } from "@/components/auth/codex/VerificationSuccess";
import { NotRegisteredScreen } from "@/components/auth/codex/NotRegisteredScreen";
import type { Language } from "@/components/auth/codex/types";

type Screen = "splash" | "phone" | "otp" | "success" | "notRegistered";

export default function LoginPage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [phone, setPhone] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSendOTP = (phoneNumber: string) => {
    setPhone(phoneNumber);
    // Real OTP has been sent via the API inside PhoneVerification.
    // If it succeeds, it calls this callback.
    setScreen("otp");
  };

  const langProps = { language, onLanguageChange: setLanguage };

  return (
    <div className="size-full min-h-screen" style={{ background: "#f5f5f7" }}>
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div key="splash" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <SplashScreen onComplete={() => setScreen("phone")} />
          </motion.div>
        )}
        {screen === "phone" && (
          <motion.div key="phone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <PhoneVerification onSendOTP={handleSendOTP} isMobile={isMobile} {...langProps} />
          </motion.div>
        )}
        {screen === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <OTPVerification phone={phone} onVerify={() => setScreen("success")} onBack={() => setScreen("phone")} isMobile={isMobile} language={language} />
          </motion.div>
        )}
        {screen === "success" && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <VerificationSuccess isMobile={isMobile} language={language} />
          </motion.div>
        )}
        {screen === "notRegistered" && (
          <motion.div key="notRegistered" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <NotRegisteredScreen phone={phone} onBack={() => setScreen("phone")} isMobile={isMobile} language={language} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
