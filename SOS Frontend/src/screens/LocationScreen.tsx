import { AppHeader, Card, InfoRow, MapPlaceholder, StatusBadge, PrimaryButton, SectionLabel, SCREEN } from '../components/ui';

function PrivacyScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader title="YOUR PRIVACY" onBack={onBack} />

      <div style={{ padding: '24px 24px 0' }}>

        {/* Key statement */}
        <div style={{ background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: 18, padding: 24, marginBottom: 17 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#ffffff', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#0066cc" strokeWidth="1.8"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="type-tagline text-ink mb-[8px]">Location is not continuously tracked.</p>
          <p className="type-body text-ink-48">
            Location sharing is activated only when required by an SOS event or when you explicitly enable an approved safety feature.
          </p>
        </div>

        {/* FAQ cards */}
        {[
          {
            q: 'When is my location shared?',
            a: 'Your location is shared only when: (1) you activate SOS, or (2) you manually enable location sharing through an approved safety feature. There is no background tracking.',
          },
          {
            q: 'Who can see my location?',
            a: 'Only authorized school responders can access your location data during an active SOS event. Your location is not visible to other students or unauthorized staff.',
          },
          {
            q: 'How long is location data kept?',
            a: 'Location data is retained only for the duration of an active SOS event. After the event is resolved or cancelled, active sharing stops immediately.',
          },
          {
            q: 'Can I stop sharing at any time?',
            a: 'Yes. You can cancel SOS or disable manual location sharing at any time through this screen or from the active SOS screen.',
          },
        ].map(item => (
          <Card key={item.q} className="mb-[8px]">
            <p className="type-body-strong text-ink mb-[6px]">{item.q}</p>
            <p className="type-body text-ink-48">{item.a}</p>
          </Card>
        ))}

        <p className="type-caption text-ink-48 mb-[24px]" style={{ padding: '0 4px' }}>
          For the full privacy policy, contact your school administrator or visit the Sukuna Privacy Policy in your school portal.{' '}
          <button className="transition-opacity active:opacity-60" style={{ color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, letterSpacing: '-0.224px', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Learn more
          </button>
        </p>

      </div>
    </div>
  );
}

interface LocationScreenProps {
  active: boolean;
  showPrivacy: boolean;
  onToggle: () => void;
  onShowPrivacy: () => void;
  onHidePrivacy: () => void;
}

export default function LocationScreen({ active, showPrivacy, onToggle, onShowPrivacy, onHidePrivacy }: LocationScreenProps) {
  if (showPrivacy) return <PrivacyScreen onBack={onHidePrivacy} />;

  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader
        title="LOCATION SHARING"
        subtitle={active ? 'Sharing is currently active.' : 'Location sharing is off.'}
      />

      <div style={{ padding: '24px 24px 0' }}>

        {/* Status card */}
        <div
          style={{
            background: active ? '#FEF2F2' : '#ffffff',
            border: `1px solid ${active ? '#FECACA' : '#e0e0e0'}`,
            borderRadius: 18,
            padding: 24,
            marginBottom: 17,
            transition: 'background 0.2s, border-color 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <p className="type-caption text-ink-48 mb-[4px]">Location Status</p>
              <p className="type-tagline" style={{ color: active ? '#DC2626' : '#1d1d1f' }}>
                {active ? 'Sharing Active' : 'Not Sharing'}
              </p>
            </div>
            <StatusBadge variant={active ? 'active' : 'cancelled'} label={active ? 'Active' : 'Off'} />
          </div>

          <p className="type-body text-ink-48 mb-[20px]">
            {active
              ? 'Your location is currently being shared with authorized school responders.'
              : 'Your location is only shared when you activate SOS or explicitly enable an approved safety feature.'}
          </p>

          <PrimaryButton fullWidth destructive={active} onClick={onToggle}>
            {active ? 'Stop Sharing' : 'Enable Location Sharing'}
          </PrimaryButton>
        </div>

        {/* Map — active only */}
        {active && (
          <Card className="mb-[17px] slide-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SectionLabel>Your Location</SectionLabel>
              <StatusBadge variant="active" label="Live" />
            </div>
            <MapPlaceholder active />
            <div style={{ marginTop: 12 }}>
              <InfoRow label="Last updated" value="Just now" />
              <InfoRow label="Shared with" value="Authorized responders only" accent />
            </div>
          </Card>
        )}

        {/* When location is shared */}
        <Card className="mb-[17px]">
          <SectionLabel>When location is shared</SectionLabel>
          <InfoRow label="During active SOS" value="Automatically shared" />
          <InfoRow label="Manual share" value={active ? 'Currently enabled' : 'Not enabled'} accent={active} />
          <InfoRow label="Background tracking" value="Never" />
          <InfoRow label="Visible to students" value="Never" />
        </Card>

        {/* Privacy info link */}
        <button
          onClick={onShowPrivacy}
          className="w-full text-left bg-canvas border border-hairline transition-opacity active:opacity-70 mb-[24px]"
          style={{ borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#0066cc" strokeWidth="1.8"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p className="type-body-strong text-ink">Privacy Information</p>
            <p className="type-caption text-ink-48 mt-[2px]">How your location data is used and protected</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>
    </div>
  );
}
