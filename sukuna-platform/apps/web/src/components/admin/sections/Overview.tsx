'use client';

import React, { useEffect, useState } from 'react';
import {
  GraduationCap, Briefcase, Users, Activity, LogIn, Phone,
  AlertTriangle, Brain, CreditCard, CalendarDays, TrendingUp, TrendingDown,
  Bus, Bell,
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
  sub?: string;
}

function MetricCard({ label, value, icon: Icon, trend, trendUp, accent = '#0066cc', sub }: MetricCardProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '18px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'default',
        transition: 'box-shadow 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `${accent}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={17} color={accent} strokeWidth={1.75} />
        </div>
        {trend && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              fontSize: '11.5px', fontWeight: 500,
              color: trendUp ? '#34c759' : '#ff3b30',
            }}
          >
            {trendUp ? <TrendingUp size={11} strokeWidth={2} /> : <TrendingDown size={11} strokeWidth={2} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '30px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '12.5px', color: '#7a7a7a', marginTop: '4px', letterSpacing: '-0.05px' }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  role: string;
  avatar: string;
}

const defaultActivity: ActivityItem[] = [
  { user: 'Amara Okafor', action: 'Submitted research paper: Climate Change in West Africa', time: '2m ago', role: 'Teacher', avatar: 'AO' },
  { user: 'Chidera Nwachukwu', action: 'Made payment for 2nd term exam fees', time: '5m ago', role: 'Student', avatar: 'CN' },
  { user: 'Fatima Abdullahi', action: 'Posted in Sukuna Book — Featured by Admin', time: '12m ago', role: 'Student', avatar: 'FA' },
  { user: 'Emmanuel Adeyemi', action: 'Logged in from a new device (iPhone 16)', time: '18m ago', role: 'Teacher', avatar: 'EA' },
  { user: 'Ngozi Obi', action: 'Added 12 new resources to the library', time: '24m ago', role: 'Teacher', avatar: 'NO' },
];

const roleColors: Record<string, string> = {
  Teacher: '#0066cc',
  TEACHER: '#0066cc',
  Student: '#34c759',
  STUDENT: '#34c759',
  Worker: '#ff9500',
  STAFF: '#ff9500',
  Admin: '#5856d6',
  ADMIN: '#5856d6',
  PRINCIPAL: '#5856d6',
};

const avatarColors: Record<string, string> = {
  AO: '#0066cc', CN: '#34c759', FA: '#ff9500', EA: '#5856d6', NO: '#30d158', TB: '#ff3b30', AM: '#007aff', SA: '#1d1d1f',
};

function formatRelativeTime(dateString: string): string {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return 'Recently';
  }
}

export function Overview() {
  const [data, setData] = useState<{
    totalStudents: number | string;
    totalTeachers: number | string;
    attendanceToday: string;
    pendingAssignments: number;
    activeRoutes: number;
    recentNotices: number;
  }>({
    totalStudents: '...',
    totalTeachers: '...',
    attendanceToday: '...',
    pendingAssignments: 0,
    activeRoutes: 0,
    recentNotices: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivity);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const m = json.data.metrics || {};
          setData({
            totalStudents: m.totalStudents ?? 0,
            totalTeachers: m.totalTeachers ?? 0,
            attendanceToday: `${m.attendanceToday ?? 0}%`,
            pendingAssignments: m.pendingAssignments ?? 0,
            activeRoutes: m.activeRoutes ?? 0,
            recentNotices: m.recentNotices ?? 0,
          });

          if (json.data.recentActivity && json.data.recentActivity.length > 0) {
            const mapped: ActivityItem[] = json.data.recentActivity.map((a: any) => {
              const userName = a.userId?.name || 'Administrator';
              const initials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'SA';
              return {
                user: userName,
                action: `${a.action?.replace(/_/g, ' ') || 'Action'} on ${a.resource || 'System'}`,
                time: formatRelativeTime(a.timestamp),
                role: a.userId?.role || 'Admin',
                avatar: initials,
              };
            });
            setActivities(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      }
    }
    loadDashboard();
  }, []);

  const metrics: MetricCardProps[] = [
    { label: 'Total Students', value: data.totalStudents, icon: GraduationCap, trend: '+3.2%', trendUp: true },
    { label: 'Total Teachers', value: data.totalTeachers, icon: Briefcase, trend: '+1 new', trendUp: true, accent: '#5856d6' },
    { label: 'School Workers', value: '67', icon: Users, accent: '#ff9500' },
    { label: 'Attendance Today', value: data.attendanceToday, icon: Activity, trend: 'Daily rate', trendUp: true, accent: '#34c759' },
    { label: "Active Routes", value: data.activeRoutes, icon: Bus, accent: '#30d158', sub: 'Live transit' },
    { label: 'Recent Notices', value: data.recentNotices, icon: Bell, trend: 'Last 7 days', trendUp: true, accent: '#0066cc' },
    { label: 'Pending Assignments', value: data.pendingAssignments, icon: AlertTriangle, accent: '#ff3b30', sub: 'Active due dates' },
    { label: 'Active Memories', value: '34', icon: Brain, trend: '+8', trendUp: true, accent: '#5856d6' },
    { label: 'Pending Payments', value: 'रु2.3M', icon: CreditCard, accent: '#ff9500', sub: '89 outstanding' },
    { label: 'Upcoming Events', value: '8', icon: CalendarDays, sub: 'This week', accent: '#0066cc' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: '1500px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
          Live School Overview
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px', letterSpacing: '-0.05px' }}>
          Real-time metrics across your entire school platform
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {metrics.map(m => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f' }}>Recent Activity</div>
            <button style={{ fontSize: '13px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer' }}>
              Live Log
            </button>
          </div>
          {activities.map((item, i) => {
            const avColor = avatarColors[item.avatar] || '#0066cc';
            const rColor = roleColors[item.role] || '#5856d6';
            return (
              <div
                key={i}
                style={{
                  padding: '14px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: i < activities.length - 1 ? '1px solid #f8f8f8' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: `${avColor}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color: avColor,
                    flexShrink: 0, letterSpacing: '0.3px',
                  }}
                >
                  {item.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f', letterSpacing: '-0.1px' }}>
                    {item.user}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.action}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '10.5px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px',
                      background: `${rColor}18`, color: rColor,
                      display: 'inline-block',
                    }}
                  >
                    {item.role}
                  </span>
                  <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '3px' }}>{item.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#1d1d1f', borderRadius: '18px', padding: '24px', color: '#ffffff', flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#8e8e93', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              Platform Status
            </div>
            <div style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.8px', lineHeight: 1.2 }}>Operational</div>
            <div style={{ fontSize: '13px', color: '#34c759', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34c759', display: 'inline-block' }} />
              All systems online
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '0' }}>
              {[[String(data.totalStudents), 'Students', '#34c759'], [String(data.totalTeachers), 'Teachers', '#0066cc'], [String(data.activeRoutes), 'Transit', '#ff9500']].map(([n, label, color]) => (
                <div key={label} style={{ flex: 1, borderLeft: '1px solid #2c2c2e', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.5px' }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{label}</div>
                  <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: color, marginTop: '6px' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '14px' }}>System Health</div>
            {[
              { label: 'API Response Time', value: 'Healthy', ok: true },
              { label: 'Database (MongoDB)', value: 'Connected', ok: true },
              { label: 'School Tenant Isolation', value: 'Active', ok: true },
              { label: 'Secure Media Storage', value: 'Enforced', ok: true },
              { label: 'Audit Logging', value: 'Active', ok: true },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <span style={{ fontSize: '12.5px', color: '#3a3a3c' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.ok ? '#34c759' : '#ff3b30', display: 'inline-block' }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 500, color: item.ok ? '#1d1d1f' : '#ff3b30' }}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
