"use client";

import { useRouter } from 'next/navigation';
import { AppHeader, Card, SOS_SCREEN } from './ui';

const FAQ_ITEMS = [
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
];

export default function LocationPrivacyScreen() {
  const router = useRouter();

  return (
    <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>
      <AppHeader title="YOUR PRIVACY" onBack={() => router.push('/dashboard/sos/location')} />

      <div style={{ padding: '24px 24px 0' }}>

        {/* Key statement */}
        <div style={{ background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: 18, padding: 24, marginBottom: 17 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#ffffff', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#0066cc" strokeWidth="1.8" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="type-tagline text-ink mb-[8px]">Location is not continuously tracked.</p>
          <p className="type-body text-ink-48">
            Location sharing is activated only when required by an SOS event or when you explicitly enable an approved safety feature.
          </p>
        </div>

        {/* FAQ cards */}
        {FAQ_ITEMS.map((item) => (
          <Card key={item.q} className="mb-[8px]">
            <p className="type-body-strong text-ink mb-[6px]">{item.q}</p>
            <p className="type-body text-ink-48">{item.a}</p>
          </Card>
        ))}

        <p className="type-caption text-ink-48 mb-[24px]" style={{ padding: '0 4px' }}>
          For the full privacy policy, contact your school administrator or visit the Sukuna Privacy Policy in your school portal.{' '}
          <button className="transition-opacity active:opacity-60" style={{ color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-text)', fontSize: 14, letterSpacing: '-0.224px', textDecoration: 'underline', textUnderlineOffset: 2 }}>
            Learn more
          </button>
        </p>

      </div>
    </div>
  );
}
