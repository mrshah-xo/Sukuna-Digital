import React from 'react';
import {
  GraduationCap, Briefcase, Users, Activity, LogIn, Phone,
  AlertTriangle, Brain, CreditCard, CalendarDays, TrendingUp, TrendingDown,
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
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

const metrics: MetricCardProps[] = [
  { label: 'Total Students', value: '2,847', icon: GraduationCap, trend: '+3.2%', trendUp: true },
  { label: 'Total Teachers', value: '143', icon: Briefcase, trend: '+1 new', trendUp: true, accent: '#5856d6' },
  { label: 'School Workers', value: '67', icon: Users, accent: '#ff9500' },
  { label: 'Total Active Users', value: '3,057', icon: Activity, trend: '+12%', trendUp: true, accent: '#34c759' },
  { label: "Today's Logins", value: '892', icon: LogIn, trend: '-5.1%', trendUp: false, accent: '#ff9500' },
  { label: 'Verified Phone Numbers', value: '2,634', icon: Phone, trend: '92.5%', trendUp: true, accent: '#30d158' },
  { label: 'Pending Reports', value: '12', icon: AlertTriangle, accent: '#ff3b30', sub: 'Requires review' },
  { label: 'Active Memories', value: '34', icon: Brain, trend: '+8', trendUp: true, accent: '#5856d6' },
  { label: 'Pending Payments', value: 'रु2.3M', icon: CreditCard, accent: '#ff9500', sub: '89 outstanding' },
  { label: 'Upcoming Events', value: '8', icon: CalendarDays, sub: 'This week', accent: '#0066cc' },
];

const recentActivity = [
  { user: 'Amara Okafor', action: 'Submitted research paper: Climate Change in West Africa', time: '2m ago', role: 'Teacher', avatar: 'AO' },
  { user: 'Chidera Nwachukwu', action: 'Made payment for 2nd term exam fees', time: '5m ago', role: 'Student', avatar: 'CN' },
  { user: 'Fatima Abdullahi', action: 'Posted in Sukuna Book — Featured by Admin', time: '12m ago', role: 'Student', avatar: 'FA' },
  { user: 'Emmanuel Adeyemi', action: 'Logged in from a new device (iPhone 16)', time: '18m ago', role: 'Teacher', avatar: 'EA' },
  { user: 'Ngozi Obi', action: 'Added 12 new resources to the library', time: '24m ago', role: 'Teacher', avatar: 'NO' },
  { user: 'Tunde Bakare', action: 'Completed Memory Session: History 101', time: '31m ago', role: 'Student', avatar: 'TB' },
  { user: 'Aisha Mohammed', action: 'Reported a comment for review', time: '45m ago', role: 'Student', avatar: 'AM' },
];

const roleColors: Record<string, string> = {
  Teacher: '#0066cc',
  Student: '#34c759',
  Worker: '#ff9500',
  Admin: '#5856d6',
};

const avatarColors: Record<string, string> = {
  AO: '#0066cc', CN: '#34c759', FA: '#ff9500', EA: '#5856d6', NO: '#30d158', TB: '#ff3b30', AM: '#007aff',
};

export function Overview() {
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
              View all
            </button>
          </div>
          {recentActivity.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: i < recentActivity.length - 1 ? '1px solid #f8f8f8' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: `${avatarColors[item.avatar]}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: avatarColors[item.avatar],
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
                    background: `${roleColors[item.role]}18`, color: roleColors[item.role],
                    display: 'inline-block',
                  }}
                >
                  {item.role}
                </span>
                <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '3px' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#1d1d1f', borderRadius: '18px', padding: '24px', color: '#ffffff', flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#8e8e93', marginBottom: '8px', fontWeight: 500, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              Currently Online
            </div>
            <div style={{ fontSize: '52px', fontWeight: 600, letterSpacing: '-1.5px', lineHeight: 1 }}>247</div>
            <div style={{ fontSize: '13px', color: '#6e6e73', marginTop: '6px' }}>users active right now</div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '0' }}>
              {[['198', 'Students', '#34c759'], ['36', 'Teachers', '#0066cc'], ['13', 'Others', '#ff9500']].map(([n, label, color]) => (
                <div key={label} style={{ flex: 1, borderLeft: '1px solid #2c2c2e', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.5px' }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{label}</div>
                  <div style={{ width: '20px', height: '3px', borderRadius: '2px', background: color, marginTop: '6px' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '14px' }}>System Health</div>
            {[
              { label: 'API Response Time', value: '112ms', ok: true },
              { label: 'Database', value: 'Healthy', ok: true },
              { label: 'Storage Used', value: '64%', ok: true },
              { label: 'Notification Queue', value: '3 pending', ok: true },
              { label: 'Last Backup', value: '2h ago', ok: true },
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
