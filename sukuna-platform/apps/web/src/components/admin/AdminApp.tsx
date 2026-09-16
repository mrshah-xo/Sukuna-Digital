'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Overview } from './sections/Overview';
import { BrandingCenter } from './sections/BrandingCenter';
import { UserMonitoring } from './sections/UserMonitoring';
import { PhoneNumbers } from './sections/PhoneNumbers';
import { AttendanceManagement } from './sections/AttendanceManagement';
import { SukunaBook } from './sections/SukunaBook';
import { NoticeCenter } from './sections/NoticeCenter';
import { CalendarView } from './sections/CalendarView';
import { ResultManagement } from './sections/ResultManagement';
import { LibraryManagement } from './sections/LibraryManagement';
import { PaymentManagement } from './sections/PaymentManagement';
import { ResearchHub } from './sections/ResearchHub';
import { MemorySessions } from './sections/MemorySessions';
import { TransportManagement } from './sections/TransportManagement';
import { FAQManager } from './sections/FAQManager';
import { OTPControl } from './sections/OTPControl';
import { ReportsModeration } from './sections/ReportsModeration';
import { AnalyticsCenter } from './sections/AnalyticsCenter';
import { SecurityLogs } from './sections/SecurityLogs';
import { SettingsPanel } from './sections/SettingsPanel';

export type SectionId =
  | 'overview'
  | 'branding'
  | 'users'
  | 'phonenumbers'
  | 'attendance'
  | 'sukunabook'
  | 'notices'
  | 'calendar'
  | 'results'
  | 'library'
  | 'payments'
  | 'research'
  | 'memory'
  | 'transport'
  | 'faq'
  | 'otp'
  | 'reports'
  | 'analytics'
  | 'security'
  | 'settings';

export const VALID_SECTIONS: SectionId[] = [
  'overview',
  'branding',
  'users',
  'phonenumbers',
  'attendance',
  'sukunabook',
  'notices',
  'calendar',
  'results',
  'library',
  'payments',
  'research',
  'memory',
  'transport',
  'faq',
  'otp',
  'reports',
  'analytics',
  'security',
  'settings',
];

function SectionContent({ activeSection }: { activeSection: SectionId }) {
  switch (activeSection) {
    case 'overview': return <Overview />;
    case 'branding': return <BrandingCenter />;
    case 'users': return <UserMonitoring />;
    case 'phonenumbers': return <PhoneNumbers />;
    case 'attendance': return <AttendanceManagement />;
    case 'sukunabook': return <SukunaBook />;
    case 'notices': return <NoticeCenter />;
    case 'calendar': return <CalendarView />;
    case 'results': return <ResultManagement />;
    case 'library': return <LibraryManagement />;
    case 'payments': return <PaymentManagement />;
    case 'research': return <ResearchHub />;
    case 'memory': return <MemorySessions />;
    case 'transport': return <TransportManagement />;
    case 'faq': return <FAQManager />;
    case 'otp': return <OTPControl />;
    case 'reports': return <ReportsModeration />;
    case 'analytics': return <AnalyticsCenter />;
    case 'security': return <SecurityLogs />;
    case 'settings': return <SettingsPanel />;
    default: return <Overview />;
  }
}

function AdminConsoleInner() {
  const searchParams = useSearchParams();
  const initialParam = searchParams.get('section') as SectionId | null;
  const initialSection = initialParam && VALID_SECTIONS.includes(initialParam) ? initialParam : 'overview';

  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync state if URL search param changes externally
  useEffect(() => {
    const s = searchParams.get('section') as SectionId | null;
    if (s && VALID_SECTIONS.includes(s)) {
      setActiveSection(s);
    } else if (!s) {
      setActiveSection('overview');
    }
  }, [searchParams]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('section') as SectionId | null;
      if (s && VALID_SECTIONS.includes(s)) {
        setActiveSection(s);
      } else {
        setActiveSection('overview');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Navigation handler with URL sync
  const handleNavigate = useCallback((section: SectionId) => {
    setActiveSection(section);
    const newUrl = section === 'overview' ? '/admin' : `/admin?section=${section}`;
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: '#f5f5f7',
        fontSize: '14px',
        color: '#1d1d1f',
        letterSpacing: '-0.05px',
      }}
    >
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Header activeSection={activeSection} onNavigate={handleNavigate} />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: '#f5f5f7',
          }}
        >
          <SectionContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', color: '#7a7a7a' }}>Loading Admin Console...</div>}>
      <AdminConsoleInner />
    </Suspense>
  );
}
