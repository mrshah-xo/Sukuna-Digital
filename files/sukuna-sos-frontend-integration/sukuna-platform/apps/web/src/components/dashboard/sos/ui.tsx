"use client";

import { ReactNode } from 'react';
import type { ResponderTimelineStep } from './types';

// ── Shared layout class for all SOS screen root divs ───────────────
// The dashboard's <main> (see DashboardLayout.tsx) is already the app's
// single scroll container, so screens just flow in normal document
// layout here rather than managing their own nested overflow region.
export const SOS_SCREEN = "flex flex-col min-h-full";

// ── Card ──────────────────────────────────────────────────────────
export function Card({
  children, className = '', padding = 24,
}: {
  children: ReactNode; className?: string; padding?: number;
}) {
  return (
    <div
      className={`bg-canvas border border-hairline ${className}`}
      style={{ borderRadius: 18, padding }}
    >
      {children}
    </div>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="type-caption text-ink-48" style={{ marginBottom: 8 }}>
      {children}
    </p>
  );
}

// ── InfoRow ───────────────────────────────────────────────────────
export function InfoRow({
  label, value, accent = false,
}: {
  label: string; value: string; accent?: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between border-b border-divider last:border-0"
      style={{ paddingTop: 12, paddingBottom: 12, gap: 12 }}
    >
      <span className="type-caption text-ink-48 flex-shrink-0">{label}</span>
      <span
        className="type-caption-strong text-right"
        style={{ color: accent ? '#0066cc' : '#1d1d1f' }}
      >
        {value}
      </span>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────
type BadgeVariant = 'active' | 'pending' | 'acknowledged' | 'resolved' | 'cancelled' | 'safe' | 'sending';

const DOT_COLORS: Record<BadgeVariant, string> = {
  active: '#DC2626',
  sending: '#DC2626',
  pending: '#D97706',
  acknowledged: '#0066cc',
  resolved: '#16A34A',
  cancelled: '#7a7a7a',
  safe: '#16A34A',
};

export function StatusBadge({ variant, label }: { variant: BadgeVariant; label: string }) {
  const isLive = variant === 'active' || variant === 'sending';
  return (
    <span
      className="inline-flex items-center gap-[6px] flex-shrink-0"
      style={{ fontFamily: 'var(--font-text)', fontSize: 12, fontWeight: 400, letterSpacing: '-0.12px', color: '#1d1d1f' }}
    >
      <span
        className={isLive ? 'live-dot' : ''}
        style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: DOT_COLORS[variant], flexShrink: 0 }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

// ── PrimaryButton ─────────────────────────────────────────────────
export function PrimaryButton({
  onClick, children, disabled, destructive, ghost, fullWidth, type = 'button',
}: {
  onClick?: () => void; children: ReactNode;
  disabled?: boolean; destructive?: boolean; ghost?: boolean; fullWidth?: boolean;
  type?: 'button' | 'submit';
}) {
  const bg = ghost ? 'transparent' : destructive ? '#DC2626' : '#0066cc';
  const fg = ghost ? (destructive ? '#DC2626' : '#0066cc') : '#ffffff';
  const border = ghost ? `1px solid ${destructive ? '#DC2626' : '#0066cc'}` : 'none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${fullWidth ? 'w-full' : ''} transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2`}
      style={{
        backgroundColor: bg, color: fg, border,
        borderRadius: 9999,
        padding: '11px 22px',
        fontFamily: 'var(--font-text)',
        fontSize: 17, fontWeight: 400,
        lineHeight: 1.47, letterSpacing: '-0.374px',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: 44, outlineColor: '#0071e3',
      }}
    >
      {children}
    </button>
  );
}

// ── ConfirmationModal ─────────────────────────────────────────────
export function ConfirmationModal({
  title, body, confirmLabel, cancelLabel, confirmDestructive = false, onConfirm, onCancel,
}: {
  title: string; body: string; confirmLabel: string; cancelLabel: string;
  confirmDestructive?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end min-[640px]:items-center justify-center fade-in"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="w-full bg-canvas border border-hairline slide-up"
        style={{ maxWidth: 480, borderRadius: 18, padding: 24 }}
        role="dialog" aria-modal="true" aria-labelledby="sos-modal-title"
      >
        <h2 id="sos-modal-title" className="type-body-strong text-ink" style={{ marginBottom: 8 }}>
          {title}
        </h2>
        <p className="type-body text-ink-48" style={{ marginBottom: 24 }}>{body}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Safe action is visually primary */}
          <PrimaryButton fullWidth onClick={onCancel}>{cancelLabel}</PrimaryButton>
          <PrimaryButton fullWidth ghost destructive={confirmDestructive} onClick={onConfirm}>
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ── MapPlaceholder ────────────────────────────────────────────────
// Structural placeholder only — no real map/location backend is wired up
// yet. Kept visually identical to the completed design; the "Map pending"
// label is intentional, not an oversight (see Remaining backend work).
export function MapPlaceholder({ active }: { active?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 180, borderRadius: 11, background: active ? '#EEF4FF' : '#f5f5f7' }}
      aria-label="Map placeholder — live map integration pending"
      role="img"
    >
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
        <defs>
          <pattern id="sos-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0L0 0 0 20" fill="none" stroke={active ? '#0066cc' : '#1d1d1f'} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sos-map-grid)" />
      </svg>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: active ? 0.18 : 0.1 }}>
        <line x1="0" y1="55" x2="100%" y2="65" stroke={active ? '#0066cc' : '#1d1d1f'} strokeWidth="2.5" />
        <line x1="0" y1="120" x2="100%" y2="110" stroke={active ? '#0066cc' : '#1d1d1f'} strokeWidth="1.5" />
        <line x1="38%" y1="0" x2="36%" y2="100%" stroke={active ? '#0066cc' : '#1d1d1f'} strokeWidth="2" />
        <line x1="72%" y1="0" x2="70%" y2="100%" stroke={active ? '#0066cc' : '#1d1d1f'} strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: active ? '#DC2626' : '#7a7a7a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: active ? '#DC2626' : '#7a7a7a', opacity: 0.2, marginTop: -5 }} />
        </div>
      </div>
      {active && (
        <div
          className="absolute top-3 left-3 live-dot text-canvas"
          style={{ background: '#DC2626', borderRadius: 4, padding: '2px 8px', fontFamily: 'var(--font-text)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em' }}
        >
          LIVE
        </div>
      )}
      <div className="absolute bottom-3 right-3" style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 4, padding: '2px 8px', fontFamily: 'var(--font-text)', fontSize: 11, letterSpacing: '-0.12px', color: '#7a7a7a' }}>
        Map pending
      </div>
    </div>
  );
}

// ── ResponderTimeline ─────────────────────────────────────────────
export function ResponderTimeline({ steps }: { steps: ResponderTimelineStep[] }) {
  return (
    <ol aria-label="Responder status timeline" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {steps.map((step, i) => (
        <li key={i} style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div
              className={step.active ? 'live-dot' : ''}
              style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.done ? '#0066cc' : step.active ? '#ffffff' : '#f5f5f7',
                border: step.done ? 'none' : step.active ? '2px solid #0066cc' : '2px solid #e0e0e0',
              }}
            >
              {step.done ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: step.active ? '#0066cc' : '#e0e0e0' }} />
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, flexGrow: 1, minHeight: 20, margin: '3px 0', background: step.done ? '#0066cc' : '#e0e0e0', opacity: step.done ? 0.35 : 1 }} />
            )}
          </div>
          <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 0, paddingTop: 2 }}>
            <p className="type-caption-strong" style={{ color: step.done ? '#1d1d1f' : step.active ? '#0066cc' : '#7a7a7a' }}>
              {step.label}
            </p>
            {step.sublabel && (
              <p className="type-caption" style={{ marginTop: 2, color: step.done ? '#7a7a7a' : step.active ? '#2997ff' : '#e0e0e0' }}>
                {step.sublabel}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── AppHeader ─────────────────────────────────────────────────────
export function AppHeader({
  title, subtitle, onBack, emergency = false,
}: {
  title: string; subtitle?: string; onBack?: () => void; emergency?: boolean;
}) {
  return (
    <header
      className="flex-shrink-0 border-b"
      style={{
        background: emergency ? '#DC2626' : '#ffffff',
        borderBottomColor: emergency ? 'rgba(255,255,255,0.15)' : '#e0e0e0',
        padding: '20px 24px 16px',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-[4px] transition-opacity active:opacity-60"
          style={{ color: emergency ? 'rgba(255,255,255,0.8)' : '#0066cc', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="type-caption" style={{ color: 'inherit' }}>Back</span>
        </button>
      )}
      <h1 className="type-display-md" style={{ color: emergency ? '#ffffff' : '#1d1d1f' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="type-body" style={{ color: emergency ? 'rgba(255,255,255,0.75)' : '#7a7a7a', marginTop: 4 }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
