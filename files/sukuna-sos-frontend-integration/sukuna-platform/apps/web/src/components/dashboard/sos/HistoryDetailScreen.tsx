"use client";

import { useRouter } from 'next/navigation';
import { AppHeader, Card, StatusBadge, InfoRow, SOS_SCREEN } from './ui';
import { useSosEvent } from './useSosHistory';
import type { SosEventStatus } from './types';

const STATUS_MAP: Record<SosEventStatus, { variant: 'resolved' | 'cancelled' | 'active'; label: string }> = {
  resolved: { variant: 'resolved', label: 'Resolved' },
  cancelled: { variant: 'cancelled', label: 'Cancelled' },
  active: { variant: 'active', label: 'Active' },
};

export default function HistoryDetailScreen({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { event } = useSosEvent(eventId);
  const onBack = () => router.push('/dashboard/sos/history');

  if (!event) {
    return (
      <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>
        <AppHeader title="SOS Event Details" onBack={onBack} />
        <div style={{ padding: '24px' }}>
          <p className="type-body text-ink-48">This event couldn&apos;t be found.</p>
        </div>
      </div>
    );
  }

  const { variant, label } = STATUS_MAP[event.status];

  return (
    <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader title="SOS Event Details" onBack={onBack} />
      <div style={{ padding: '24px 24px 0' }}>
        <Card className="mb-[17px]">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p className="type-caption text-ink-48">{event.date}</p>
              <p className="type-body-strong text-ink mt-[2px]">{event.time}</p>
            </div>
            <StatusBadge variant={variant} label={label} />
          </div>
          <InfoRow label="Date" value={event.date} />
          <InfoRow label="Time" value={event.time} />
          {event.duration && <InfoRow label="Duration" value={event.duration} />}
          {event.resolvedTime && <InfoRow label="Resolved at" value={event.resolvedTime} />}
          <InfoRow label="Location data" value="Not displayed" />
        </Card>

        <div style={{ background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: 11, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a7a7a" strokeWidth="1.8" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p className="type-caption text-ink-48">
            Sensitive location details are not shown here. Contact your school administrator for a full event report.
          </p>
        </div>
      </div>
    </div>
  );
}
