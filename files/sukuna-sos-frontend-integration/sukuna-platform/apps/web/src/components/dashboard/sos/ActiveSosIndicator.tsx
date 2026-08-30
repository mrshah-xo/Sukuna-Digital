"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSosSession } from './SosSessionContext';

/**
 * Small persistent banner shown across the dashboard shell while an SOS
 * session is active, so a student who navigates away from /dashboard/sos
 * doesn't lose track of it. Hidden on the SOS routes themselves (those
 * screens already show ample "active" status of their own).
 *
 * Reads only the public `sosState` from SosSessionContext — once a real
 * backend/responder integration replaces the context's internal state
 * source, this component needs no changes.
 */
export default function ActiveSosIndicator() {
  const pathname = usePathname();
  const { sosState } = useSosSession();

  const isActive = sosState === 'active' || sosState === 'ack' || sosState === 'assistance';
  const onSosRoute = pathname.startsWith('/dashboard/sos');

  if (!isActive || onSosRoute) return null;

  const label =
    sosState === 'ack' ? 'SOS Acknowledged'
    : sosState === 'assistance' ? 'Assistance In Progress'
    : 'SOS Active';

  return (
    <Link
      href="/dashboard/sos"
      className="sticky top-0 z-20 flex items-center justify-between gap-3 transition-opacity active:opacity-90 fade-in"
      style={{
        background: '#FEF2F2',
        borderBottom: '1px solid #FECACA',
        padding: '9px 16px',
        minHeight: 40,
      }}
      aria-label={`${label}. Tap to return to your active SOS.`}
    >
      <span className="flex items-center gap-[8px] min-w-0">
        <span
          className="live-dot"
          style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span className="type-caption-strong truncate min-w-0" style={{ color: '#991B1B' }}>
          {label}
        </span>
      </span>
      <span className="type-caption-strong flex items-center gap-[4px] flex-shrink-0" style={{ color: '#DC2626' }}>
        View
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
