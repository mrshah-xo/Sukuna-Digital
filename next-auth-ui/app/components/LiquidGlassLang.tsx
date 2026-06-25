import { motion } from "motion/react";
import type { Language } from "../App";

interface LiquidGlassLangProps {
  language: Language;
  onChange: (lang: Language) => void;
  variant?: "light" | "dark";
}

const options: { value: Language; flag: string; label: string }[] = [
  { value: "en", flag: "🇺🇸", label: "English" },
  { value: "ne", flag: "🇳🇵", label: "नेपाली" },
];

export function LiquidGlassLang({ language, onChange, variant = "light" }: LiquidGlassLangProps) {
  const isDark = variant === "dark";
  return (
    <div
      className="inline-flex items-center p-1 rounded-2xl relative"
      style={{
        background: isDark ? "rgba(255,255,255,0.14)" : "rgba(120,120,128,0.10)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.18)" : "inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <motion.div
        layout
        className="absolute rounded-xl"
        style={{
          width: "calc(50% - 4px)",
          height: "calc(100% - 8px)",
          top: "4px",
          left: language === "en" ? "4px" : "calc(50%)",
          background: isDark ? "rgba(255,255,255,0.2)" : "#ffffff",
          backdropFilter: "blur(12px)",
          boxShadow: isDark
            ? "0 1px 3px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
        }}
        transition={{ type: "spring", stiffness: 480, damping: 36 }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl select-none"
          style={{ border: "none", background: "transparent", cursor: "pointer", minWidth: "72px", justifyContent: "center" }}
        >
          <span style={{ fontSize: "13px", lineHeight: 1 }}>{opt.flag}</span>
          <span style={{
            fontSize: "13px",
            fontWeight: language === opt.value ? 600 : 400,
            color: isDark
              ? language === opt.value ? "#ffffff" : "rgba(255,255,255,0.55)"
              : language === opt.value ? "#1d1d1f" : "#7a7a7a",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            letterSpacing: "-0.1px",
            transition: "color 0.18s",
          }}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
}
