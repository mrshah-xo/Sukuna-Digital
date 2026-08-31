'use client';
import { useEffect } from "react";
import { motion } from "framer-motion";
import { SukunaLogo } from "./SukunaLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    // Purely cosmetic hold — nothing is loading here (no auth/session/data
    // call happens in this component), so this only needs to last as long
    // as the entrance choreography below takes to finish playing:
    //   logo:    0.7s
    //   tagline: 0.5s delay + 0.6s duration = 1.1s
    //   dots:    0.8s delay + 0.4s duration = 1.2s  <- last element in
    // 1200ms is the shortest hold that lets every element finish
    // appearing before we transition away, so nothing gets cut off.
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "#F5F5F7" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex items-center justify-center"
      >
        <SukunaLogo size="lg" variant="light" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-14 text-center px-8"
      >
        <p
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            color: "#6E6E73",
            letterSpacing: "0.1px",
            lineHeight: 1.5,
          }}
        >
          A School That Adapts Today, Leads Tomorrow
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute bottom-8 flex items-center gap-1.5"
      >
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#007AFF" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
