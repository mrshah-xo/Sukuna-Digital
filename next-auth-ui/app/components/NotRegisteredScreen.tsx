import { motion } from "motion/react";
import { ArrowLeft, Phone, Mail, AlertCircle } from "lucide-react";
import { SukunaLogo } from "./SukunaLogo";
import type { Language } from "../App";

interface NotRegisteredScreenProps {
  phone: string;
  onBack: () => void;
  isMobile?: boolean;
  language: Language;
}

const strings = {
  en: {
    title: "Phone Number\nNot Registered",
    message: "This phone number is not registered with Sukuna School.",
    description: "Please contact your school administrator to gain access.",
    adminLabel: "School Administrator",
    adminPhone: "+977-01-4XXXXXX",
    adminEmail: "admin@sukuna.edu.np",
    tryAnother: "Try Another Number",
    contactSchool: "Contact School",
    phoneLabel: "Phone",
    emailLabel: "Email",
    back: "Back",
    unregistered: "Unregistered",
  },
  ne: {
    title: "फोन नम्बर\nदर्ता छैन",
    message: "यो फोन नम्बर Sukuna School मा दर्ता गरिएको छैन।",
    description: "पहुँच प्राप्त गर्न कृपया आफ्नो विद्यालय प्रशासकसँग सम्पर्क गर्नुहोस्।",
    adminLabel: "विद्यालय प्रशासक",
    adminPhone: "+977-01-4XXXXXX",
    adminEmail: "admin@sukuna.edu.np",
    tryAnother: "अर्को नम्बर प्रयास गर्नुहोस्",
    contactSchool: "विद्यालयसँग सम्पर्क गर्नुहोस्",
    phoneLabel: "फोन",
    emailLabel: "इमेल",
    back: "फिर्ता",
    unregistered: "दर्ता नभएको",
  },
};

function Content({ phone, onBack, isMobile, t }: { phone: string; onBack: () => void; isMobile: boolean; t: typeof strings["en"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button onClick={onBack} className="flex items-center gap-2 mb-8 transition-opacity hover:opacity-60"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f5f5f7", border: "1px solid #e0e0e0" }}>
          <ArrowLeft size={14} style={{ color: "#1d1d1f" }} />
        </div>
        <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#7a7a7a", letterSpacing: "-0.224px" }}>
          {t.back}
        </span>
      </button>

      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: "rgba(255,59,48,0.07)", border: "1px solid rgba(255,59,48,0.12)" }}>
        <AlertCircle size={22} style={{ color: "#ff3b30" }} />
      </div>

      <div className="mb-8">
        <h1 style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
          fontSize: isMobile ? "28px" : "32px",
          fontWeight: 600,
          color: "#1d1d1f",
          letterSpacing: "-0.374px",
          lineHeight: 1.1,
          marginBottom: "12px",
          whiteSpace: "pre-line" as const,
        }}>
          {t.title}
        </h1>
        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, color: "#1d1d1f", lineHeight: 1.47, letterSpacing: "-0.374px", marginBottom: "4px" }}>
          {t.message}
        </p>
        <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, color: "#7a7a7a", lineHeight: 1.47, letterSpacing: "-0.374px" }}>
          {t.description}
        </p>
      </div>

      {/* Unregistered number */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6" style={{ background: "rgba(255,59,48,0.04)", border: "1px solid rgba(255,59,48,0.1)" }}>
        <Phone size={14} style={{ color: "#ff3b30", flexShrink: 0 }} />
        <div>
          <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", fontWeight: 400, color: "#ff3b30", letterSpacing: "-0.12px", display: "block" }}>
            {t.unregistered}
          </span>
          <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.374px" }}>
            +977 {phone}
          </span>
        </div>
      </div>

      {/* Admin contact */}
      <div className="rounded-xl overflow-hidden mb-7" style={{ border: "1px solid #e0e0e0" }}>
        <div className="px-4 py-3" style={{ background: "#f5f5f7", borderBottom: "1px solid #e0e0e0" }}>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "12px", fontWeight: 600, color: "#7a7a7a", letterSpacing: "0.4px", textTransform: "uppercase" as const }}>
            {t.adminLabel}
          </p>
        </div>
        {[{ icon: Phone, label: t.phoneLabel, value: t.adminPhone }, { icon: Mail, label: t.emailLabel, value: t.adminEmail }].map(({ icon: Icon, label, value }, i, arr) => (
          <div key={label} className="flex items-center gap-3 px-4 py-3.5" style={{ background: "#ffffff", borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,102,204,0.07)", border: "1px solid rgba(0,102,204,0.1)" }}>
              <Icon size={13} style={{ color: "#0066cc" }} />
            </div>
            <div>
              <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "11px", fontWeight: 400, color: "#7a7a7a", letterSpacing: "-0.08px", display: "block" }}>{label}</span>
              <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, color: "#1d1d1f", letterSpacing: "-0.224px" }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <a href={`mailto:${strings.en.adminEmail}`}>
          <button className="w-full flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ height: "44px", borderRadius: "9999px", background: "#0066cc", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "17px", fontWeight: 400, letterSpacing: "-0.374px", border: "none", cursor: "pointer", padding: "11px 22px" }}>
            {t.contactSchool}
          </button>
        </a>
        <button onClick={onBack} className="w-full flex items-center justify-center transition-transform active:scale-95"
          style={{ height: "44px", borderRadius: "11px", background: "#fafafc", color: "#333333", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", fontSize: "14px", fontWeight: 400, letterSpacing: "-0.224px", border: "1px solid #f0f0f0", cursor: "pointer", padding: "8px 14px" }}>
          {t.tryAnother}
        </button>
      </div>
    </motion.div>
  );
}

export function NotRegisteredScreen({ phone, onBack, isMobile = false, language }: NotRegisteredScreenProps) {
  const t = strings[language];

  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center" style={{ background: "#f5f5f7", padding: "20px 16px" }}>
        <div className="w-full flex flex-col" style={{ background: "#ffffff", borderRadius: "18px", border: "1px solid #e0e0e0", overflow: "hidden", maxWidth: "420px" }}>
          <div className="flex items-center px-5 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <SukunaLogo size="sm" variant="light" />
          </div>
          <div className="px-5 py-7">
            <Content phone={phone} onBack={onBack} isMobile={true} t={t} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "#f5f5f7", padding: "48px" }}>
      <div className="w-full flex overflow-hidden"
        style={{ maxWidth: "1100px", borderRadius: "18px", border: "1px solid #e0e0e0", minHeight: "min(640px, 80vh)", maxHeight: "calc(100vh - 96px)" }}>
        <div className="flex flex-col" style={{ width: "45%", background: "#ffffff", flexShrink: 0 }}>
          <div className="flex items-center px-8 py-5" style={{ borderBottom: "1px solid #f0f0f0" }}>
            <SukunaLogo size="sm" variant="light" />
          </div>
          <div className="flex-1 flex items-center px-10 py-8">
            <div style={{ width: "100%", maxWidth: "360px" }}>
              <Content phone={phone} onBack={onBack} isMobile={false} t={t} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden" style={{ background: "#1a1a1a" }}>
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&h=1100&fit=crop&auto=format"
            alt="School building"
            className="w-full h-full object-cover"
            style={{ opacity: 0.65 }}
          />
        </div>
      </div>
    </div>
  );
}
