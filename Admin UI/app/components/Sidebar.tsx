import React from 'react';
import {
  LayoutDashboard, Palette, Users, BookOpen, Bell, Calendar,
  BarChart3, Library, CreditCard, FlaskConical, Image, HelpCircle,
  ShieldCheck, FileWarning, TrendingUp, Lock, Settings, ChevronLeft,
  ChevronRight, GraduationCap, Phone, ClipboardCheck, Bus,
} from 'lucide-react';
import type { SectionId } from '../App';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    id: 'school',
    label: 'School',
    items: [
      { id: 'branding', label: 'Branding', icon: Palette },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'phonenumbers', label: 'Phone Numbers', icon: Phone },
    ],
  },
  {
    id: 'academic',
    label: 'Academic',
    items: [
      { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
      { id: 'results', label: 'Results', icon: BarChart3 },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'library', label: 'Library', icon: Library },
      { id: 'research', label: 'Research', icon: FlaskConical },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    items: [
      { id: 'sukunabook', label: 'Sukuna Book', icon: BookOpen },
      { id: 'notices', label: 'Notices', icon: Bell },
      { id: 'memory', label: 'Memories', icon: Image },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    items: [
      { id: 'payments', label: 'Payments', icon: CreditCard },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    items: [
      { id: 'transport', label: 'Transport', icon: Bus },
    ],
  },
  {
    id: 'control',
    label: 'Control',
    items: [
      { id: 'reports', label: 'Reports & Moderation', icon: FileWarning },
      { id: 'otp', label: 'OTP & Verification', icon: ShieldCheck },
      { id: 'faq', label: 'FAQ / Help', icon: HelpCircle },
      { id: 'security', label: 'Security / Audit', icon: Lock },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'analytics', label: 'Analytics', icon: TrendingUp },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ activeSection, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div
      style={{
        width: collapsed ? '64px' : '220px',
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
      <div
        style={{
          padding: collapsed ? '18px 14px' : '18px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minHeight: '64px',
        }}
      >
        <div
          style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: '#0066cc', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}
        >
          <GraduationCap size={16} color="#ffffff" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#1d1d1f', lineHeight: 1.3, letterSpacing: '-0.2px' }}>
              Sukuna School
            </div>
            <div style={{ fontSize: '10.5px', color: '#7a7a7a', marginTop: '1px', letterSpacing: '-0.05px' }}>
              Admin Control Center
            </div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px' }}>
        {navGroups.map(group => (
          <div key={group.id} style={{ marginBottom: '2px' }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: '9.5px', fontWeight: 700, color: '#c0c0c8',
                  letterSpacing: '0.7px', textTransform: 'uppercase',
                  padding: '10px 10px 3px',
                }}
              >
                {group.label}
              </div>
            )}
            {collapsed && group.id !== 'main' && (
              <div style={{ height: '6px' }} />
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: collapsed ? '8px' : '7px 10px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#0066cc' : '#3a3a3c',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '1px',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.1px',
                    transition: 'background 0.12s ease, color 0.12s ease',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f7';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <Icon size={14} color={isActive ? '#0066cc' : '#5a5a5e'} strokeWidth={isActive ? 2 : 1.75} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: '8px 6px', borderTop: '1px solid #f0f0f0' }}>
        <button
          onClick={onToggleCollapse}
          style={{
            width: '100%',
            padding: '7px 10px',
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#7a7a7a',
            fontSize: '12.5px',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );
}
