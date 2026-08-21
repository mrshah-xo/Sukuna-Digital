'use client';
import React from 'react';
import {
  LayoutDashboard, Palette, Users, BookOpen, Bell, Calendar,
  BarChart3, Library, CreditCard, FlaskConical, Brain, HelpCircle,
  ShieldCheck, FileWarning, TrendingUp, Lock, Settings, ChevronLeft,
  ChevronRight, GraduationCap,
} from 'lucide-react';
import type { SectionId } from './AdminApp';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  group: string;
}

const navItems: NavItem[] = [
  { id: 'overview',  label: 'Dashboard',            icon: LayoutDashboard, group: 'main' },
  { id: 'branding',  label: 'School Branding',       icon: Palette,         group: 'main' },
  { id: 'users',     label: 'User Management',       icon: Users,           group: 'main' },
  { id: 'sukunabook',label: 'Sukuna Book',           icon: BookOpen,        group: 'content' },
  { id: 'notices',   label: 'Notice Center',         icon: Bell,            group: 'content' },
  { id: 'calendar',  label: 'Calendar',              icon: Calendar,        group: 'content' },
  { id: 'results',   label: 'Results',               icon: BarChart3,       group: 'academic' },
  { id: 'library',   label: 'Library',               icon: Library,         group: 'academic' },
  { id: 'payments',  label: 'Payments',              icon: CreditCard,      group: 'academic' },
  { id: 'research',  label: 'Research Hub',          icon: FlaskConical,    group: 'academic' },
  { id: 'memory',    label: 'Memories',              icon: Brain,           group: 'academic' },
  { id: 'faq',       label: 'FAQ Manager',           icon: HelpCircle,      group: 'system' },
  { id: 'otp',       label: 'OTP & Verification',    icon: ShieldCheck,     group: 'system' },
  { id: 'reports',   label: 'Reports & Moderation',  icon: FileWarning,     group: 'system' },
  { id: 'analytics', label: 'Analytics',             icon: TrendingUp,      group: 'system' },
  { id: 'security',  label: 'Security Logs',         icon: Lock,            group: 'system' },
  { id: 'settings',  label: 'Settings',              icon: Settings,        group: 'system' },
];

const groupLabels: Record<string, string> = {
  main: 'Main', content: 'Content', academic: 'Academic', system: 'System',
};

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeSection, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const groups = ['main', 'content', 'academic', 'system'];

  return (
    <div style={{
      width: collapsed ? '64px' : '252px',
      background: '#ffffff', borderRight: '1px solid #e0e0e0',
      height: '100vh', flexShrink: 0, display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 14px' : '18px 20px',
        borderBottom: '1px solid #f0f0f0', display: 'flex',
        alignItems: 'center', gap: '12px', minHeight: '68px',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '9px',
          background: '#0066cc', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <GraduationCap size={17} color="#ffffff" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', lineHeight: 1.3, letterSpacing: '-0.2px' }}>
              Sukuna School
            </div>
            <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>
              Admin Control Center
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px' }}>
        {groups.map(group => {
          const items = navItems.filter(i => i.group === group);
          return (
            <div key={group} style={{ marginBottom: '4px' }}>
              {!collapsed && (
                <div style={{
                  fontSize: '10px', fontWeight: 600, color: '#b0b0b8',
                  letterSpacing: '0.6px', textTransform: 'uppercase',
                  padding: '10px 12px 3px',
                }}>
                  {groupLabels[group]}
                </div>
              )}
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: collapsed ? 0 : '10px',
                      padding: collapsed ? '10px' : '9px 12px',
                      borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: isActive ? '#EBF5FF' : 'transparent',
                      color: isActive ? '#0066cc' : '#5a5a5a',
                      fontSize: '13px', fontWeight: isActive ? 600 : 400,
                      letterSpacing: '-0.1px', textAlign: 'left',
                      transition: 'background 0.12s ease',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5f5f7'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icon size={16} color={isActive ? '#0066cc' : '#7a7a7a'} strokeWidth={isActive ? 2 : 1.75} />
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <div style={{
                        marginLeft: 'auto', width: '6px', height: '6px',
                        borderRadius: '50%', background: '#0066cc',
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid #f0f0f0' }}>
        <button onClick={onToggleCollapse}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-end',
            gap: '8px', padding: '8px 10px', borderRadius: '8px',
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: '#7a7a7a', fontSize: '12px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {collapsed ? <ChevronRight size={16} /> : <><span>Collapse</span><ChevronLeft size={16} /></>}
        </button>
      </div>
    </div>
  );
}
