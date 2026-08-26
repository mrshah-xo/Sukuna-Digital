'use client';

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/sections/Overview';
import { BrandingCenter } from './components/sections/BrandingCenter';
import { UserMonitoring } from './components/sections/UserMonitoring';
import { PhoneNumbers } from './components/sections/PhoneNumbers';
import { OTPControl } from './components/sections/OTPControl';
import { FAQManager } from './components/sections/FAQManager';
import { SukunaBook } from './components/sections/SukunaBook';
import { NoticeCenter } from './components/sections/NoticeCenter';
import { ResultManagement } from './components/sections/ResultManagement';
import { LibraryManagement } from './components/sections/LibraryManagement';
import { PaymentManagement } from './components/sections/PaymentManagement';
import { ResearchHub } from './components/sections/ResearchHub';
import { MemorySessions } from './components/sections/MemorySessions';
import { AnalyticsCenter } from './components/sections/AnalyticsCenter';
import { ReportsModeration } from './components/sections/ReportsModeration';
import { SecurityLogs } from './components/sections/SecurityLogs';
import { SettingsPanel } from './components/sections/SettingsPanel';
import { CalendarView } from './components/sections/CalendarView';
import { AttendanceManagement } from './components/sections/AttendanceManagement';
import { TransportManagement } from './components/sections/TransportManagement';

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

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        onNavigate={setActiveSection}
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
        <Header activeSection={activeSection} />
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
