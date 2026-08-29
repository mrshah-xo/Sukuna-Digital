import SOSButton from '../components/SOSButton';
import { Card, InfoRow, PrimaryButton, SectionLabel, SCREEN } from '../components/ui';
import type { SosState, ActiveTab } from '../types';

function CountdownOverlay({ countdown, onCancel }: { countdown: number; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-[24px] fade-in"
      style={{ background: '#DC2626' }}
    >
      <p
        className="type-caption text-center mb-[32px]"
        style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em' }}
      >
        SOS will activate shortly
      </p>

      <div
        key={countdown}
        className="countdown-number"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 128,
          fontWeight: 600,
          lineHeight: 1,
          color: '#ffffff',
          letterSpacing: '-2px',
        }}
        aria-live="assertive"
        aria-label={`${countdown} seconds until SOS activates`}
      >
        {countdown}
      </div>

      <p className="type-body text-center mt-[24px] mb-[48px]" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 280 }}>
        Sending your emergency alert to authorized responders.
      </p>

      <button
        onClick={onCancel}
        className="transition-transform active:scale-95"
        style={{
          background: '#ffffff',
          color: '#DC2626',
          borderRadius: 9999,
          padding: '11px 48px',
          fontFamily: 'var(--font-body)',
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: '-0.374px',
          minHeight: 44,
          minWidth: 200,
        }}
        aria-label="Cancel SOS activation"
      >
        Cancel
      </button>
    </div>
  );
}

interface MainScreenProps {
  sosState: SosState;
  holdProgress: number;
  countdown: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onCancelCountdown: () => void;
  onTabChange: (tab: ActiveTab) => void;
}

export default function MainScreen({
  sosState, holdProgress, countdown,
  onHoldStart, onHoldEnd, onCancelCountdown, onTabChange,
}: MainScreenProps) {
  const isHolding = sosState === 'holding';

  return (
    <div className={`relative bg-parchment ${SCREEN}`}>

      {/* Header */}
      <div className="bg-canvas border-b border-hairline flex-shrink-0" style={{ padding: '24px 24px 20px' }}>
        <div className="flex items-center gap-[8px] mb-[4px]">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="type-tagline text-ink">SOS & SAFETY</h1>
        </div>
        <p className="type-body text-ink-48">
          Quick access to safety assistance when you need it.
        </p>
      </div>

      <div style={{ padding: '24px 24px 0' }}>

        {/* Primary SOS action card */}
        <div
          className="bg-canvas"
          style={{
            borderRadius: 18,
            border: `1px solid ${isHolding ? '#FECACA' : '#e0e0e0'}`,
            marginBottom: 17,
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <p className="type-body-strong text-ink">SOS</p>
              <p className="type-caption text-ink-48">Request Immediate Help</p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: isHolding ? '#DC2626' : '#7a7a7a',
                padding: '3px 10px',
                border: `1px solid ${isHolding ? '#FECACA' : '#e0e0e0'}`,
                borderRadius: 9999,
                flexShrink: 0,
              }}
            >
              {isHolding ? 'ACTIVATING' : 'READY'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 20px', gap: 16 }}>
            <SOSButton
              sosState={sosState}
              holdProgress={holdProgress}
              onHoldStart={onHoldStart}
              onHoldEnd={onHoldEnd}
            />

            {isHolding && (
              <div style={{ width: '100%', maxWidth: 200 }} className="slide-up">
                <div style={{ height: 3, background: '#FECACA', borderRadius: 9999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      background: '#DC2626',
                      borderRadius: 9999,
                      width: `${holdProgress * 100}%`,
                      transition: 'width 0.05s linear',
                    }}
                  />
                </div>
              </div>
            )}

            {!isHolding && (
              <p className="type-caption text-center text-ink-48">
                Hold the button for 2.5 seconds to activate
              </p>
            )}
          </div>
        </div>

        {/* Safety status */}
        <Card className="mb-[17px]">
          <SectionLabel>Safety Status</SectionLabel>
          <InfoRow label="Status" value="No active SOS" />
          <InfoRow label="Location" value="Not currently shared" />
          <InfoRow label="Last check-in" value="Today, 8:14 AM" />
        </Card>

        {/* Quick actions */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Quick Actions</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 17 }}>
            {([
              { label: 'Share Location', tab: 'location' as ActiveTab, iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z' },
              { label: 'Safety Check', tab: 'safety' as ActiveTab, iconPath: 'M20 6L9 17L4 12' },
              { label: 'SOS History', tab: 'history' as ActiveTab, iconPath: 'M12 7v5l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' },
            ]).map(action => (
              <button
                key={action.label}
                onClick={() => onTabChange(action.tab)}
                className="flex flex-col items-center text-center transition-opacity active:opacity-60"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 18,
                  padding: 16,
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 11, background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d={action.iconPath} stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="type-caption-strong text-ink">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy notice */}
        <div
          style={{ background: '#f5f5f7', borderRadius: 11, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a7a7a" strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p className="type-caption text-ink-48">
            Your location is not continuously tracked. Sharing is activated only during an active SOS event or when you explicitly enable it.
          </p>
        </div>

      </div>

      {sosState === 'countdown' && <CountdownOverlay countdown={countdown} onCancel={onCancelCountdown} />}
    </div>
  );
}
