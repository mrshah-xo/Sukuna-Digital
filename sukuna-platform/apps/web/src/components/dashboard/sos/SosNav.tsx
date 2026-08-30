"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSosSession } from './SosSessionContext';

const NAV_ITEMS: { href: string; label: string; icon: (color: string) => React.ReactNode }[] = [
  {
    href: '/dashboard/sos',
    label: 'SOS',
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/sos/history',
    label: 'History',
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/sos/safety',
    label: 'Safety Check',
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/sos/location',
    label: 'Location',
    icon: (color) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.6" />
      </svg>
    ),
  },
];

export default function SosNav() {
  const pathname = usePathname();
  const { sosState } = useSosSession();
  const isSosLive = sosState === 'active' || sosState === 'ack' || sosState === 'assistance';

  return (
    <nav
      aria-label="SOS & Safety sections"
      className="sticky top-0 z-10 flex-shrink-0 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0', padding: '0 8px' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/dashboard/sos'
          ? pathname === '/dashboard/sos'
          : pathname.startsWith(item.href);
        const color = isActive ? '#0066cc' : '#7a7a7a';
        const showDot = item.href === '/dashboard/sos' && isSosLive;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex items-center gap-[8px] flex-shrink-0 transition-opacity active:opacity-70"
            style={{
              padding: '14px 16px',
              borderBottom: `2px solid ${isActive ? '#0066cc' : 'transparent'}`,
              color,
              minHeight: 44,
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon(color)}
            <span className="type-caption-strong" style={{ color, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            {showDot && (
              <span
                className="live-dot"
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }}
                aria-label="SOS active"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
