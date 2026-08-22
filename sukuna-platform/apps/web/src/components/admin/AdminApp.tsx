'use client';
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Overview } from './sections/Overview';
import { BrandingCenter } from './sections/BrandingCenter';
import { UserMonitoring } from './sections/UserMonitoring';
import { OTPControl } from './sections/OTPControl';
import { FAQManager } from './sections/FAQManager';
import { SukunaBook } from './sections/SukunaBook';
import { NoticeCenter } from './sections/NoticeCenter';
import { ResultManagement } from './sections/ResultManagement';
import { LibraryManagement } from './sections/LibraryManagement';
import { PaymentManagement } from './sections/PaymentManagement';
import { ResearchHub } from './sections/ResearchHub';
import { MemorySessions } from './sections/MemorySessions';
import { AnalyticsCenter } from './sections/AnalyticsCenter';
import { ReportsModeration } from './sections/ReportsModeration';
import { SecurityLogs } from './sections/SecurityLogs';
import { SettingsPanel } from './sections/SettingsPanel';
import { CalendarView } from './sections/CalendarView';

export type SectionId =
  | 'overview' | 'branding' | 'users' | 'sukunabook' | 'notices'
  | 'calendar' | 'results' | 'library' | 'payments' | 'research'
  | 'memory' | 'faq' | 'otp' | 'reports' | 'analytics' | 'security' | 'settings';

function SectionContent({ activeSection }: { activeSection: SectionId }) {
  switch (activeSection) {
    case 'overview':  return <Overview />;
    case 'branding':  return <BrandingCenter />;
    case 'users':     return <UserMonitoring />;
    case 'sukunabook':return <SukunaBook />;
    case 'notices':   return <NoticeCenter />;
    case 'calendar':  return <CalendarView />;
    case 'results':   return <ResultManagement />;
    case 'library':   return <LibraryManagement />;
    case 'payments':  return <PaymentManagement />;
    case 'research':  return <ResearchHub />;
    case 'memory':    return <MemorySessions />;
    case 'faq':       return <FAQManager />;
    case 'otp':       return <OTPControl />;
    case 'reports':   return <ReportsModeration />;
    case 'analytics': return <AnalyticsCenter />;
    case 'security':  return <SecurityLogs />;
    case 'settings':  return <SettingsPanel />;
    default:          return <Overview />;
  }
}

export default function AdminApp() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#f5f5f7', fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.05px',
    }}>
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Header activeSection={activeSection} />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: '#f5f5f7' }}>
          <SectionContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
}
