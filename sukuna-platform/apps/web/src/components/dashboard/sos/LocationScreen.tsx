"use client";

import { useRouter } from 'next/navigation';
import { AppHeader, Card, InfoRow, MapPlaceholder, StatusBadge, PrimaryButton, SectionLabel, SOS_SCREEN } from './ui';
import { useSosSession } from './SosSessionContext';
import { formatClockTime } from './utils';

export default function LocationScreen() {
  const router = useRouter();
  const { locationSharing: active, locationUpdatedAt, toggleManualLocationSharing } = useSosSession();

  return (
    <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>
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

          <PrimaryButton fullWidth destructive={active} onClick={toggleManualLocationSharing}>
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
              <InfoRow label="Last updated" value={locationUpdatedAt ? formatClockTime(locationUpdatedAt) : '—'} />
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
          onClick={() => router.push('/dashboard/sos/location/privacy')}
          className="w-full text-left bg-canvas border border-hairline transition-opacity active:opacity-70 mb-[24px]"
          style={{ borderRadius: 18, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f5f7', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#0066cc" strokeWidth="1.8" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p className="type-body-strong text-ink">Privacy Information</p>
            <p className="type-caption text-ink-48 mt-[2px]">How your location data is used and protected</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#7a7a7a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

      </div>
    </div>
  );
}
