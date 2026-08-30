"use client";

import { useRouter } from 'next/navigation';
import { AppHeader, StatusBadge, SOS_SCREEN } from './ui';
import { useSosHistory } from './useSosHistory';
import type { SosEventStatus } from './types';

const STATUS_MAP: Record<SosEventStatus, { variant: 'resolved' | 'cancelled' | 'active'; label: string }> = {
  resolved: { variant: 'resolved', label: 'Resolved' },
  cancelled: { variant: 'cancelled', label: 'Cancelled' },
  active: { variant: 'active', label: 'Active' },
};

export default function HistoryScreen() {
  const router = useRouter();
  const { events } = useSosHistory();

  return (
    <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader
        title="SOS HISTORY"
        subtitle="Your previous safety events, visible only to you."
      />

      <div style={{ padding: '24px 24px 0' }}>
        {events.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 64, gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#7a7a7a" strokeWidth="1.8" />
                <path d="M12 7v5l3 3" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="type-body text-ink-48">No SOS events recorded</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24 }}>
            {events.map((event) => {
              const { variant, label } = STATUS_MAP[event.status];
              const iconColor = event.status === 'resolved' ? '#16A34A' : event.status === 'cancelled' ? '#7a7a7a' : '#DC2626';
              return (
                <button
                  key={event.id}
                  onClick={() => router.push(`/dashboard/sos/history/${event.id}`)}
                  className="w-full text-left bg-canvas border border-hairline transition-opacity active:opacity-70"
                  style={{ borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={iconColor} strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <p className="type-body-strong text-ink">SOS Event</p>
                      <StatusBadge variant={variant} label={label} />
                    </div>
                    <p className="type-caption text-ink-48">
                      {event.date} · {event.time}
                    </p>
                    {event.duration && (
                      <p className="type-caption text-ink-48 mt-[2px]">Duration: {event.duration}</p>
                    )}
                  </div>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
