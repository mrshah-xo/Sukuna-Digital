import { Card, InfoRow, PrimaryButton, SCREEN } from '../components/ui';

export default function SOSResolvedScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>

      {/* Header */}
      <div className="bg-canvas border-b border-hairline flex-shrink-0" style={{ padding: '32px 24px 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F0FDF4', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="type-display-md text-ink">SOS RESOLVED</h1>
        <p className="type-body mt-[8px] text-ink-48">
          Your SOS event has been marked as resolved.
        </p>
      </div>

      <div style={{ padding: '24px 24px 0' }}>

        {/* Event summary */}
        <Card className="mb-[17px]">
          <p className="type-caption text-ink-48 mb-[12px]">Event Summary</p>
          <InfoRow label="Started" value="10:32 AM" />
          <InfoRow label="Resolved" value="10:48 AM" />
          <InfoRow label="Duration" value="16 minutes" />
          <InfoRow label="Location sharing" value="Stopped" />
          <InfoRow label="Responder" value="Acknowledged & Responded" accent />
        </Card>

        {/* All clear */}
        <div style={{ background: '#F0FDF4', border: '1px solid #e0e0e0', borderRadius: 18, padding: 24, marginBottom: 17 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16A34A" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="type-body-strong" style={{ color: '#15803D' }}>All Clear</p>
          </div>
          <p className="type-body" style={{ color: '#16A34A', lineHeight: 1.47 }}>
            Your SOS event is closed. Your location is no longer being shared. If you need assistance again, you can activate a new SOS at any time.
          </p>
        </div>

        {/* Privacy confirmation */}
        <div style={{ background: '#f5f5f7', borderRadius: 11, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a7a7a" strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p className="type-caption text-ink-48">
            Location sharing has been automatically stopped. Your location data is no longer accessible to responders.
          </p>
        </div>

        <PrimaryButton fullWidth onClick={onBack}>Back to Safety</PrimaryButton>

      </div>
    </div>
  );
}
