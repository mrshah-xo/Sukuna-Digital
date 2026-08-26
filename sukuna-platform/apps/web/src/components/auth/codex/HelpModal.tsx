'use client';
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, UserCheck, Lock, Bell } from "lucide-react";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const reasons = [
  { icon: UserCheck, text: "Verify school identity" },
  { icon: Shield, text: "Secure account access" },
  { icon: Lock, text: "Protect student information" },
  { icon: Bell, text: "Enable official communication" },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-sm rounded-3xl p-8"
              style={{ background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: "#F5F5F7" }}
                >
                  <Shield size={20} style={{ color: "#007AFF" }} />
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#F5F5F7" }}
                >
                  <X size={14} style={{ color: "#6E6E73" }} />
                </button>
              </div>

              <h3
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", fontSize: "20px", fontWeight: 700, color: "#1D1D1F", marginBottom: "6px" }}
              >
                Why do we need your phone number?
              </h3>
              <p style={{ fontSize: "14px", color: "#6E6E73", marginBottom: "24px", lineHeight: "1.5" }}>
                Your phone number helps us keep your school account safe and connected.
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {reasons.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(0,122,255,0.08)" }}
                    >
                      <Icon size={15} style={{ color: "#007AFF" }} />
                    </div>
                    <span style={{ fontSize: "15px", color: "#1D1D1F", fontWeight: 400 }}>{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]"
                style={{
                  background: "#007AFF",
                  color: "#fff",
                  height: "52px",
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Got It
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
