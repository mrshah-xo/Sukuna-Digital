'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminNavGroups, getActiveNavItem } from '@/lib/admin-navigation';

interface RouteAwareSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function RouteAwareSidebar({ collapsed, onToggleCollapse }: RouteAwareSidebarProps) {
  const pathname = usePathname();
  const groups = getAdminNavGroups();

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '252px',
        background: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '18px 14px' : '18px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '68px',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: '#0066cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>S</span>
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: '14px',
                color: '#1d1d1f',
                lineHeight: 1.3,
                letterSpacing: '-0.2px',
              }}
            >
              Sukuna School
            </div>
            <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>
              Admin Control Center
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {groups.map(group => (
          <div key={group.label} style={{ marginBottom: '4px' }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#b0b0b8',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  padding: '10px 12px 3px',
                }}
              >
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive =
                (item.href === '/admin' && pathname === '/admin') ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: collapsed ? '0' : '12px',
                    padding: collapsed ? '12px' : '10px 12px',
                    borderRadius: '10px',
                    background: isActive ? '#0066cc' : 'transparent',
                    color: isActive ? '#ffffff' : '#7a7a7a',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: 'none',
                  }}
                  title={collapsed ? item.label : undefined}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = '#f5f5f7';
                      (e.currentTarget as HTMLElement).style.color = '#1d1d1f';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#7a7a7a';
                    }
                  }}
                >
                  <Icon size={18} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div
        style={{
          padding: '12px 8px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            width: collapsed ? '36px' : '40px',
            height: '36px',
            borderRadius: '8px',
            background: '#f5f5f7',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7a7a7a',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#e8e8ed';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#f5f5f7';
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRight size={16} strokeWidth={2} />
          ) : (
            <ChevronLeft size={16} strokeWidth={2} />
          )}
        </button>
      </div>
    </aside>
  );
}
