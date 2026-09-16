'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from '@/components/admin/ui/sonner';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import type { SectionId } from '@/components/admin/AdminApp';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If on the main console route (/admin), AdminApp handles its own full-bleed layout, sidebar, and header.
  if (pathname === '/admin') {
    return (
      <>
        <Toaster position="top-right" richColors />
        {children}
      </>
    );
  }

  // Determine active section for sub-routes
  let activeSection: SectionId = 'users';
  if (pathname.includes('/students') || pathname.includes('/teachers')) {
    activeSection = 'users';
  } else if (pathname.includes('/branding')) {
    activeSection = 'branding';
  }

  const handleNavigate = (section: SectionId) => {
    router.push(section === 'overview' ? '/admin' : `/admin?section=${section}`);
  };

  // For compatibility sub-routes (/admin/students, /admin/teachers), render with the canonical console shell:
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f5f7' }}>
      <Toaster position="top-right" richColors />
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
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
            padding: '28px 32px',
          }}
        >
          <div style={{ maxWidth: '1500px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}