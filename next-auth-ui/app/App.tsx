"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplashScreen } from "./components/SplashScreen";
import { PhoneVerification } from "./components/PhoneVerification";
import { OTPVerification } from "./components/OTPVerification";
import { VerificationSuccess } from "./components/VerificationSuccess";
import { NotRegisteredScreen } from "./components/NotRegisteredScreen";

type Screen = "splash" | "phone" | "otp" | "success" | "notRegistered";
export type Language = "en" | "ne";

export default function App() {
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
    // Simulate DB: 98XXXXXXXX = registered → OTP, 97XXXXXXXX = not registered
    if (phoneNumber.startsWith("98")) {
      setScreen("otp");
    } else {
      setScreen("notRegistered");
    }
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
