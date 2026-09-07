"use client";

/**
 * VerificationSuccess
 * ────────────────────────────────────────────────────────────────────────
 * "Verification Completed" screen shown after a user's identity/OTP
 * verification succeeds. Converted from the original Figma/Make export
 * (src/app/App.tsx) that was supplied as the visual source of truth.
 *
 * Visual design (layout, spacing, typography, colors, icons, motion
 * timing) is preserved as closely as possible from the source file.
 * All backend/auth concerns (who the user is, where "Continue" goes,
 * what "Not You?" does) are lifted out into props so this component has
 * no dependency on Sukuna's authentication implementation.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Info,
  X,
  Mail,
  Phone,
  Shield,
  User,
  Hash,
  BookOpen,
  Users,
  GraduationCap,
  AlertCircle,
} from "lucide-react";

// ─── Design tokens (from source design) ───────────────────────────────────
const C = {
  primary: "#0066cc",
  ink: "#1d1d1f",
  inkMuted: "#6e6e73",
  inkFaint: "#8e8e93",
  canvas: "#ffffff",
  parchment: "#f5f5f7",
  pearl: "#fafafc",
  hairline: "#e0e0e0",
  divider: "#f0f0f0",
  chipGray: "rgba(210,210,215,0.64)",
  onPrimary: "#ffffff",
  destructive: "#d4183d",
  green: "#78BE21",
  greenBg: "rgba(120,190,33,0.10)",
} as const;

const FONT = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

// ─── Public types ──────────────────────────────────────────────────────────
export type SukunaRole = "student" | "teacher" | "worker";

export interface VerifiedProfile {
  fullName: string;
  role: SukunaRole;
  /** Student ID or Staff ID, depending on role. */
  id: string;
  phone: string;
  /** Student-only. Ignored for teacher/worker roles. */
  classSection?: string;
  /** Student-only. Ignored for teacher/worker roles. */
  guardianName?: string;
}

export interface VerificationSuccessProps {
  /** The verified user's profile, shown in the "Review Your Information" card. */
  profile: VerifiedProfile;
  /**
   * Called when the user taps "Continue to Dashboard".
   * The host app owns navigation — e.g. `() => router.push("/dashboard")`.
   */
  onContinue: () => void;
  /**
   * Called when the user taps "Not You?".
   * The host app owns what this means (e.g. sign out and return to login).
   */
  onNotYou: () => void;
  /** Support contact shown in the "Account & Support" modal. */
  supportEmail?: string;
  /** Support contact shown in the "Account & Support" modal. */
  supportPhone?: string;
  /** Optional hrefs for the legal links in the footer. Rendered as plain text if omitted. */
  legalLinks?: {
    privacyPolicyHref?: string;
    termsOfServiceHref?: string;
    dataProtectionHref?: string;
  };
}

const ROLE_LABEL: Record<SukunaRole, string> = {
  student: "Student",
  teacher: "Teacher",
  worker: "Worker",
};
const ID_LABEL: Record<SukunaRole, string> = {
  student: "Student ID",
  teacher: "Staff ID",
  worker: "Staff ID",
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function VerificationSuccess({
  profile,
  onContinue,
  onNotYou,
  supportEmail = "support@sukuna.edu.np",
  supportPhone = "+977-01-4XXXXXX",
  legalLinks,
}: VerificationSuccessProps) {
  const [showModal, setShowModal] = useState(false);
  const p = profile;
  const isStudent = p.role === "student";

  // Desktop 2-column grid pairs — mirrors the original design exactly.
  const desktopPairs: [
    { label: string; value: string },
    { label: string; value: string } | null,
  ][] = [
    [
      { label: "Full Name", value: p.fullName },
      { label: "Role", value: ROLE_LABEL[p.role] },
    ],
    [
      { label: ID_LABEL[p.role], value: p.id },
      { label: "Phone Number", value: p.phone },
    ],
    ...(isStudent
      ? ([
          [
            { label: "Class & Section", value: p.classSection ?? "—" },
            { label: "Guardian Name", value: p.guardianName ?? "—" },
          ],
        ] as [
          { label: string; value: string },
          { label: string; value: string },
        ][])
      : []),
  ];

  return (
    <>
      {/* ── Page ──────────────────────────────────────────────────────────── */}
      {/*
        Mobile:  px-4, items-start — card sits at top, page scrolls naturally.
        Desktop: sm:px-8 sm:items-center sm:justify-center — card centred in viewport.
      */}
      <div
        className="min-h-screen flex flex-col items-start sm:items-center justify-start sm:justify-center overflow-y-auto px-4 sm:px-8 py-5 sm:py-10"
        style={{
          backgroundColor: C.parchment,
          fontFamily: FONT,
          paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
        }}
      >
        {/* ── Card ────────────────────────────────────────────────────────── */}
        <motion.div
          className="w-full flex flex-col"
          style={{
            maxWidth: 560,
            margin: "0 auto",
            backgroundColor: C.canvas,
            border: `1px solid ${C.hairline}`,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          }}
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.08, 0.64, 1] }}
        >
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between"
            style={{ padding: "16px 20px", borderBottom: `1px solid ${C.divider}` }}
          >
            {/* Sukuna wordmark */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 34, height: 34, backgroundColor: C.primary, borderRadius: 8 }}
              >
                <GraduationCap style={{ width: 17, height: 17, color: C.onPrimary }} />
              </div>
              <div style={{ lineHeight: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.3px", color: C.ink }}>
                  Sukuna
                </p>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "1.1px",
                    color: C.inkFaint,
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  Digital
                </p>
              </div>
            </div>

            {/* (i) button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9999,
                backgroundColor: C.parchment,
                border: `1.5px solid ${C.hairline}`,
                cursor: "pointer",
              }}
              aria-label="Account & Support"
            >
              <Info style={{ width: 15, height: 15, color: C.inkMuted }} />
            </button>
          </div>

          {/* ── Card body ───────────────────────────────────────────────── */}
          <div className="px-4 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-7">
            {/* Success indicator */}
            <div className="flex justify-center" style={{ marginBottom: 20 }}>
              <motion.div
                className="relative flex items-center justify-center"
                style={{ width: 72, height: 72 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.5, 0.64, 1] }}
              >
                {/* Ambient glow */}
                <motion.div
                  className="absolute rounded-full"
                  style={{ width: 88, height: 88, backgroundColor: C.green, filter: "blur(16px)" }}
                  animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.08, 0.2] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Soft fill */}
                <div
                  className="absolute rounded-full"
                  style={{ width: 72, height: 72, backgroundColor: C.greenBg }}
                />
                {/* Animated ring */}
                <svg className="absolute" width="72" height="72" viewBox="0 0 72 72">
                  <motion.circle
                    cx="36"
                    cy="36"
                    r="32"
                    fill="none"
                    stroke={C.green}
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.35, ease: "easeInOut" }}
                  />
                </svg>
                {/* Checkmark */}
                <motion.div
                  className="relative flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.72, ease: "easeOut" }}
                >
                  <Check style={{ width: 28, height: 28, color: C.green }} strokeWidth={2.5} />
                </motion.div>
              </motion.div>
            </div>

            {/* Heading */}
            <motion.div
              className="text-center"
              style={{ marginBottom: 20 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.78 }}
            >
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                  color: C.ink,
                  marginBottom: 8,
                }}
              >
                Verification Completed
              </h1>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.47,
                  letterSpacing: "-0.2px",
                  color: C.inkMuted,
                }}
              >
                Your identity has been successfully verified.
              </p>
            </motion.div>

            {/* ── Information card ────────────────────────────────────── */}
            <motion.div
              className="w-full"
              style={{
                border: `1px solid ${C.hairline}`,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 18,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.88 }}
            >
              {/* Card label */}
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: `1px solid ${C.divider}`,
                  backgroundColor: C.parchment,
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.8px",
                    color: C.inkFaint,
                    textTransform: "uppercase",
                  }}
                >
                  Review Your Information
                </p>
              </div>

              {/* ── MOBILE rows: single column with icons ── */}
              <div className="block sm:hidden">
                <MobileRow icon={<User />} label="Full Name" value={p.fullName} />
                <MobileRow icon={<Shield />} label="Role" value={ROLE_LABEL[p.role]} />
                <MobileRow icon={<Hash />} label={ID_LABEL[p.role]} value={p.id} />
                <MobileRow icon={<Phone />} label="Phone Number" value={p.phone} />
                {isStudent && p.classSection && (
                  <MobileRow icon={<BookOpen />} label="Class & Section" value={p.classSection} />
                )}
                {isStudent && p.guardianName && (
                  <MobileRow icon={<Users />} label="Guardian Name" value={p.guardianName} isLast />
                )}
                {!isStudent && <MobileRow icon={<Phone />} label="Department" value="—" isLast />}
              </div>

              {/* ── DESKTOP rows: 2-column grid, no icons ── */}
              <div className="hidden sm:block">
                {desktopPairs.map((pair, pi) => (
                  <div
                    key={pi}
                    className="grid grid-cols-2"
                    style={{
                      borderBottom: pi < desktopPairs.length - 1 ? `1px solid ${C.divider}` : "none",
                    }}
                  >
                    {pair.map((cell, ci) =>
                      cell ? (
                        <div
                          key={ci}
                          style={{
                            padding: "14px 16px",
                            borderRight: ci === 0 ? `1px solid ${C.divider}` : "none",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 400,
                              letterSpacing: "-0.1px",
                              color: C.inkFaint,
                              marginBottom: 4,
                            }}
                          >
                            {cell.label}
                          </p>
                          <p
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              letterSpacing: "-0.3px",
                              lineHeight: 1.3,
                              color: C.ink,
                              wordBreak: "break-word",
                            }}
                          >
                            {cell.value}
                          </p>
                        </div>
                      ) : (
                        <div key={ci} />
                      ),
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Actions ─────────────────────────────────────────────── */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              {/* Continue to Dashboard */}
              <button
                type="button"
                onClick={onContinue}
                className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97]"
                style={{
                  backgroundColor: C.primary,
                  color: C.onPrimary,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  lineHeight: 1,
                  borderRadius: 9999,
                  padding: "15px 24px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: FONT,
                  boxShadow: "0 2px 8px rgba(0,102,204,0.28)",
                }}
              >
                <GraduationCap style={{ width: 17, height: 17 }} />
                Continue to Dashboard
              </button>

              {/* Not You? */}
              <button
                type="button"
                onClick={onNotYou}
                className="transition-all duration-150 active:scale-95 hover:opacity-60"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: "-0.2px",
                  lineHeight: 1.5,
                  color: C.destructive,
                  fontFamily: FONT,
                  padding: "4px 0",
                }}
              >
                Not You?
              </button>
            </motion.div>

            {/* Legal */}
            <motion.p
              className="text-center"
              style={{
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: "-0.08px",
                lineHeight: 1.55,
                color: C.inkFaint,
                marginTop: 14,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 1.1 }}
            >
              By using Sukuna Digital, you agree to our{" "}
              <LegalLink href={legalLinks?.privacyPolicyHref}>Privacy Policy</LegalLink>,{" "}
              <LegalLink href={legalLinks?.termsOfServiceHref}>Terms of Service</LegalLink> and{" "}
              <LegalLink href={legalLinks?.dataProtectionHref}>Data Protection</LegalLink>.
            </motion.p>

            {/* Mobile-only safe-area spacer */}
            <div className="block sm:hidden" style={{ height: "env(safe-area-inset-bottom, 12px)", minHeight: 12 }} />
          </div>
        </motion.div>
      </div>

      {/* ── Account & Support modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{
                backgroundColor: "rgba(0,0,0,0.38)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setShowModal(false)}
            />

            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-8 pointer-events-none">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Account & Support"
                className="w-full sm:max-w-md pointer-events-auto"
                style={{
                  backgroundColor: "rgba(255,255,255,0.97)",
                  backdropFilter: "saturate(180%) blur(20px)",
                  WebkitBackdropFilter: "saturate(180%) blur(20px)",
                  borderRadius: "20px 20px 0 0",
                  fontFamily: FONT,
                  maxHeight: "92dvh",
                  overflowY: "auto",
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 32, stiffness: 340 }}
              >
                <div className="flex justify-center pt-3 sm:hidden">
                  <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#d1d1d6" }} />
                </div>

                <div
                  className="px-5 sm:px-6 pt-5 sm:pt-6"
                  style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))" }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        letterSpacing: "-0.3px",
                        lineHeight: 1.2,
                        color: C.ink,
                      }}
                    >
                      Account & Support
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9999,
                        backgroundColor: C.chipGray,
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label="Close"
                    >
                      <X style={{ width: 14, height: 14, color: C.ink }} />
                    </button>
                  </div>

                  <div className="flex flex-col" style={{ gap: 10, marginBottom: 16 }}>
                    <ModalInfoItem
                      number={1}
                      title="Review Your Profile Details"
                      body="Review your information carefully before continuing to the dashboard."
                    />
                    <ModalInfoItem
                      number={2}
                      title="Your Account Role"
                      body="Your role is automatically assigned by your school administrator."
                    />
                    <ModalInfoItem
                      number={3}
                      title="Your Data Is Protected"
                      body="Your personal information is protected under school policies and applicable government data protection requirements."
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: "rgba(255,149,0,0.07)",
                      border: "1px solid rgba(255,149,0,0.2)",
                      borderRadius: 12,
                      padding: "13px 14px",
                      marginBottom: 16,
                    }}
                  >
                    <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                      <AlertCircle style={{ width: 14, height: 14, color: "#c07000", flexShrink: 0 }} />
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#7a4800", letterSpacing: "-0.15px" }}>
                        Is any information incorrect?
                      </p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: "#7a5500", letterSpacing: "-0.1px" }}>
                      If any of your profile information is incorrect, please contact your school administrator or
                      Sukuna Digital support to request an update.
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: C.pearl,
                      border: `1px solid ${C.divider}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      marginBottom: 18,
                    }}
                  >
                    <div
                      className="flex items-center gap-3"
                      style={{ padding: "12px 14px", borderBottom: `1px solid ${C.divider}` }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{ width: 28, height: 28, borderRadius: 9999, backgroundColor: "rgba(0,102,204,0.08)" }}
                      >
                        <Mail style={{ width: 13, height: 13, color: C.primary }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.inkFaint, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 1 }}>
                          Email
                        </p>
                        <p style={{ fontSize: 14, color: C.primary, fontWeight: 400, letterSpacing: "-0.2px" }}>
                          {supportEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3" style={{ padding: "12px 14px" }}>
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{ width: 28, height: 28, borderRadius: 9999, backgroundColor: "rgba(0,102,204,0.08)" }}
                      >
                        <Phone style={{ width: 13, height: 13, color: C.primary }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.inkFaint, letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: 1 }}>
                          Contact
                        </p>
                        <p style={{ fontSize: 14, color: C.primary, fontWeight: 400, letterSpacing: "-0.2px" }}>
                          {supportPhone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full transition-all duration-150 active:scale-[0.97]"
                    style={{
                      backgroundColor: C.primary,
                      color: C.onPrimary,
                      fontSize: 16,
                      fontWeight: 500,
                      letterSpacing: "-0.2px",
                      lineHeight: 1,
                      borderRadius: 9999,
                      padding: "14px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: FONT,
                    }}
                  >
                    Got It
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── LegalLink: renders as a real link when an href is provided, plain text otherwise ──
function LegalLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <a href={href} style={{ color: C.primary }}>
        {children}
      </a>
    );
  }
  return <span style={{ color: C.primary }}>{children}</span>;
}

// ─── MobileRow: single-column with icon badge (mobile only) ──────────────────
function MobileRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-3 py-3" style={{ borderBottom: isLast ? "none" : `1px solid ${C.divider}` }}>
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 30, height: 30, borderRadius: 9999, backgroundColor: "rgba(0,102,204,0.07)", marginTop: 1 }}
      >
        <span style={{ color: C.primary, display: "flex" }}>
          <span className="[&>svg]:w-[14px] [&>svg]:h-[14px]">{icon}</span>
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 400, letterSpacing: "-0.1px", color: C.inkFaint, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", lineHeight: 1.3, color: C.ink, wordBreak: "break-word" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── ModalInfoItem ────────────────────────────────────────────────────────────
function ModalInfoItem({ number, title, body }: { number: number; title: string; body: string }) {
  return (
    <div className="flex gap-3 items-start" style={{ backgroundColor: C.parchment, borderRadius: 12, padding: "12px 14px" }}>
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 22, height: 22, borderRadius: 9999, backgroundColor: "rgba(0,102,204,0.10)", marginTop: 1 }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>{number}</span>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, letterSpacing: "-0.2px", marginBottom: 3 }}>{title}</p>
        <p style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5, color: C.inkMuted, letterSpacing: "-0.1px" }}>{body}</p>
      </div>
    </div>
  );
}
