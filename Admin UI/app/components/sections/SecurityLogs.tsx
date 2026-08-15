import React, { useState } from 'react';
import { Lock, LogIn, LogOut, Shield, AlertTriangle, Smartphone, RefreshCw, Trash2, Database } from 'lucide-react';

const logs = [
  { id: 1, event: 'Admin Login', user: 'Super Admin', detail: 'Logged in from MacBook Pro — Lagos, NG', ip: '41.58.102.23', time: 'May 30, 2026 · 8:02 AM', type: 'login', severity: 'info' },
  { id: 2, event: 'Role Changed', user: 'Emmanuel Adeyemi', detail: 'Role changed from Teacher to HOD Sciences by Admin', ip: '—', time: 'May 30, 2026 · 7:48 AM', type: 'change', severity: 'warning' },
  { id: 3, event: 'Failed Login', user: 'Hauwa Bello', detail: '5 consecutive failed OTP attempts — account temporarily blocked', ip: '41.58.99.14', time: 'May 29, 2026 · 11:34 PM', type: 'failed', severity: 'high' },
  { id: 4, event: 'Account Deleted', user: 'Admin', detail: 'Account "Anonymous_234" deleted by Admin for violating community guidelines', ip: '—', time: 'May 29, 2026 · 6:12 PM', type: 'delete', severity: 'high' },
  { id: 5, event: 'New Device Login', user: 'Chidera Nwachukwu', detail: 'First login from Samsung Galaxy S24 — Abuja, NG', ip: '154.120.4.88', time: 'May 29, 2026 · 3:24 PM', type: 'device', severity: 'warning' },
  { id: 6, event: 'System Backup', user: 'System', detail: 'Automated database backup completed successfully — 2.4GB', ip: '—', time: 'May 29, 2026 · 2:00 AM', type: 'system', severity: 'info' },
  { id: 7, event: 'OTP Requested', user: 'Fatima Abdullahi', detail: 'OTP sent to +234 803 456 7890 — verified successfully in 28s', ip: '197.210.44.12', time: 'May 28, 2026 · 7:58 AM', type: 'otp', severity: 'info' },
  { id: 8, event: 'Post Deleted', user: 'Admin', detail: 'Post ID #4892 deleted — reason: violation of community guidelines', ip: '—', time: 'May 28, 2026 · 5:43 PM', type: 'delete', severity: 'warning' },
  { id: 9, event: 'Settings Changed', user: 'Super Admin', detail: 'OTP timeout duration updated from 5 to 10 minutes', ip: '41.58.102.23', time: 'May 27, 2026 · 10:14 AM', type: 'change', severity: 'info' },
  { id: 10, event: 'Failed Login', user: 'Unknown', detail: '12 failed login attempts from IP 41.58.77.188 — blocked', ip: '41.58.77.188', time: 'May 26, 2026 · 1:22 AM', type: 'failed', severity: 'high' },
];

const typeConfig: Record<string, { icon: React.ComponentType<any>; bg: string; color: string }> = {
  login: { icon: LogIn, bg: '#d1fae5', color: '#065f46' },
  failed: { icon: AlertTriangle, bg: '#fee2e2', color: '#991b1b' },
  change: { icon: RefreshCw, bg: '#fef3c7', color: '#92400e' },
  delete: { icon: Trash2, bg: '#fee2e2', color: '#991b1b' },
  device: { icon: Smartphone, bg: '#dbeafe', color: '#1e40af' },
  system: { icon: Database, bg: '#f3f4f6', color: '#6b7280' },
  otp: { icon: Shield, bg: '#ede9fe', color: '#5b21b6' },
};

const severityDot: Record<string, string> = {
  info: '#34c759', warning: '#ff9500', high: '#ff3b30',
};

export function SecurityLogs() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    const matchFilter = filter === 'All' || (filter === 'Alerts' && l.severity === 'high') || (filter === 'Warnings' && l.severity === 'warning') || (filter === 'Info' && l.severity === 'info');
    const matchSearch = l.event.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Security & System Logs</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Complete audit trail of all administrative and security events</p>
        </div>
        <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500 }}>Export Logs</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Events Today', value: '847', color: '#0066cc' },
          { label: 'Security Alerts', value: '3', color: '#ff3b30' },
          { label: 'Failed Logins', value: '17', color: '#ff9500' },
          { label: 'Admin Actions', value: '12', color: '#5856d6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, letterSpacing: '-0.8px', marginBottom: '3px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#7a7a7a' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search logs..."
          style={{ flex: 1, maxWidth: '300px', height: '34px', borderRadius: '9999px', border: '1px solid #e0e0e0', padding: '0 16px', fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '5px' }}>
          {['All', 'Alerts', 'Warnings', 'Info'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '5px 13px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: filter === f ? '#1d1d1f' : '#f5f5f7', color: filter === f ? '#fff' : '#3a3a3c' }}
            >
              {f}
              {f === 'Alerts' && <span style={{ marginLeft: '4px', background: '#ff3b30', color: '#fff', borderRadius: '9999px', padding: '0 5px', fontSize: '10px', fontWeight: 700 }}>3</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
        {filtered.map((log, i) => {
          const cfg = typeConfig[log.type] || typeConfig.system;
          const Icon = cfg.icon;
          return (
            <div
              key={log.id}
              style={{ padding: '14px 20px', display: 'flex', gap: '14px', alignItems: 'flex-start', borderBottom: i < filtered.length - 1 ? '1px solid #f8f8f8' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={cfg.color} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.1px' }}>{log.event}</span>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: severityDot[log.severity], display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '12.5px', color: '#7a7a7a', fontWeight: 500 }}>{log.user}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#5a5a5e', lineHeight: 1.4 }}>{log.detail}</div>
                {log.ip !== '—' && (
                  <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '3px', fontFamily: 'monospace' }}>IP: {log.ip}</div>
                )}
              </div>
              <div style={{ fontSize: '11.5px', color: '#b0b0b8', flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap' }}>{log.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
