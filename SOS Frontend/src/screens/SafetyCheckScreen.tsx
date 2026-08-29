import { AppHeader, Card, PrimaryButton, SCREEN } from '../components/ui';

interface SafetyCheckScreenProps {
  done: boolean;
  onActivate: () => void;
  onReset: () => void;
}

export default function SafetyCheckScreen({ done, onActivate, onReset }: SafetyCheckScreenProps) {
  if (done) {
    return (
      <div className={SCREEN} style={{ background: '#f5f5f7' }}>
        <AppHeader title="SAFETY CHECK" />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 24px' }}>
          <div
            className="slide-up"
            style={{ width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="type-display-md text-ink text-center slide-up" style={{ marginBottom: 8 }}>
            Safety Check Sent
          </h2>
          <p className="type-body text-ink-48 text-center slide-up" style={{ maxWidth: 280, marginBottom: 32 }}>
            Your safety status has been updated. Authorized contacts have been notified that you are safe.
          </p>

          <div
            className="w-full slide-up"
            style={{ background: '#F0FDF4', border: '1px solid #e0e0e0', borderRadius: 18, padding: 20, marginBottom: 32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16A34A" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="type-body-strong" style={{ color: '#15803D' }}>You are marked safe</p>
                <p className="type-caption" style={{ color: '#16A34A', marginTop: 2 }}>Just now</p>
              </div>
            </div>
          </div>

          <PrimaryButton fullWidth onClick={onReset}>Done</PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader
        title="SAFETY CHECK"
        subtitle="Let authorized contacts know that you are safe."
      />

      <div style={{ padding: '24px 24px 0' }}>

        {/* Explainer card */}
        <Card className="mb-[17px]">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#0066cc" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#0066cc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="type-body-strong text-ink mb-[4px]">What is a Safety Check?</p>
              <p className="type-body text-ink-48">
                A Safety Check lets you confirm your wellbeing to authorized school contacts. This is separate from SOS — it tells them you are safe, not that you need help.
              </p>
            </div>
          </div>
        </Card>

        <p className="type-fine text-ink-48 text-center mb-[24px]" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Different from SOS
        </p>

        {/* I'm Safe button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={onActivate}
            className="transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              width: 136, height: 136, borderRadius: '50%',
              background: '#F0FDF4', border: '2px solid #e0e0e0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6, cursor: 'pointer', outlineColor: '#0071e3',
            }}
            aria-label="I am safe — send safety check"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', color: '#15803D', lineHeight: 1 }}>
              {"I'M SAFE"}
            </span>
          </button>
          <p className="type-caption text-ink-48 text-center">Tap to send your safety confirmation</p>
        </div>

        {/* Privacy note */}
        <div style={{ background: '#f5f5f7', borderRadius: 11, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7a7a7a" strokeWidth="1.8"/>
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#7a7a7a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p className="type-caption text-ink-48">
            A Safety Check does not share your location. It only sends a status notification to authorized contacts.
          </p>
        </div>

      </div>
    </div>
  );
}
