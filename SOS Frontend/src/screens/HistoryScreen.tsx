import { AppHeader, Card, StatusBadge, InfoRow, SCREEN } from '../components/ui';
import type { SOSEvent } from '../types';

const HISTORY: SOSEvent[] = [
  { id: '1', date: '24 August 2026', time: '10:32 AM', status: 'resolved', duration: '16 min', resolvedTime: '10:48 AM' },
  { id: '2', date: '12 July 2026', time: '2:15 PM', status: 'cancelled', duration: '1 min' },
  { id: '3', date: '3 March 2026', time: '9:05 AM', status: 'resolved', duration: '23 min', resolvedTime: '9:28 AM' },
];

const STATUS_MAP = {
  resolved: { variant: 'resolved' as const, label: 'Resolved' },
  cancelled: { variant: 'cancelled' as const, label: 'Cancelled' },
  active: { variant: 'active' as const, label: 'Active' },
};

function HistoryDetail({ event, onBack }: { event: SOSEvent; onBack: () => void }) {
  const { variant, label } = STATUS_MAP[event.status];
  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>
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
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a7a7a" strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p className="type-caption text-ink-48">
            Sensitive location details are not shown here. Contact your school administrator for a full event report.
          </p>
        </div>
      </div>
    </div>
  );
}

interface HistoryScreenProps {
  selected: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export default function HistoryScreen({ selected, onSelect, onBack }: HistoryScreenProps) {
  if (selected) {
    const event = HISTORY.find(e => e.id === selected);
    if (event) return <HistoryDetail event={event} onBack={onBack} />;
  }

  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader
        title="SOS HISTORY"
        subtitle="Your previous safety events, visible only to you."
      />

      <div style={{ padding: '24px 24px 0' }}>
        {HISTORY.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 64, gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#7a7a7a" strokeWidth="1.8"/>
                <path d="M12 7v5l3 3" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="type-body text-ink-48">No SOS events recorded</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24 }}>
            {HISTORY.map(event => {
              const { variant, label } = STATUS_MAP[event.status];
              const iconColor = event.status === 'resolved' ? '#16A34A' : event.status === 'cancelled' ? '#7a7a7a' : '#DC2626';
              return (
                <button
                  key={event.id}
                  onClick={() => onSelect(event.id)}
                  className="w-full text-left bg-canvas border border-hairline transition-opacity active:opacity-70"
                  style={{ borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={iconColor} strokeWidth="1.8" strokeLinejoin="round"/>
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
                    <path d="M9 18l6-6-6-6" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
