'use client';

import { useState } from 'react';
import { Toaster } from '@/components/admin/ui/sonner';
import { RouteAwareSidebar } from '@/components/admin/RouteAwareSidebar';
import { RouteAwareHeader } from '@/components/admin/RouteAwareHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5f5f7' }}>
      <Toaster position="top-right" richColors />
      
      {/* Canonical Sidebar with Figma Design */}
      <RouteAwareSidebar 
        collapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* Main Content Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        
        {/* Canonical Header with Figma Design */}
        <RouteAwareHeader />

        {/* Main Content Area */}
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