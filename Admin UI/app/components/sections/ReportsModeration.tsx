import React, { useState } from 'react';
import { Flag, Check, X, Eye, Ban, Shield, AlertTriangle, MessageSquare, User } from 'lucide-react';

const reports = [
  { id: 1, type: 'Post', content: '"Teachers at this school are useless and don\'t know what they\'re teaching..."', reportedBy: 'Aisha Mohammed', reportedUser: 'Anonymous_234', reason: 'Disrespectful Content', time: '2h ago', status: 'Pending', severity: 'High' },
  { id: 2, type: 'Comment', content: '"Just copy the answer from Google, nobody checks anyway lol"', reportedBy: 'Emmanuel A.', reportedUser: 'Tunde B.', reason: 'Academic Dishonesty', time: '5h ago', status: 'Pending', severity: 'Medium' },
  { id: 3, type: 'Post', content: '"I\'ll be selling past questions for रु5,000 each, DM me privately..."', reportedBy: 'Ngozi Obi', reportedUser: 'ChiHawk22', reason: 'Spam/Commercial', time: '1d ago', status: 'Resolved', severity: 'Low' },
  { id: 4, type: 'User', content: 'Account posting misleading exam date information repeatedly', reportedBy: 'System', reportedUser: 'StudyBoss99', reason: 'Misinformation', time: '2d ago', status: 'Resolved', severity: 'High' },
  { id: 5, type: 'Comment', content: '"Don\'t bother studying for Physics, everyone fails anyway"', reportedBy: 'Chidera N.', reportedUser: 'LazyStar_01', reason: 'Demoralizing Content', time: '3d ago', status: 'Dismissed', severity: 'Low' },
];

const severityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: '#fee2e2', text: '#991b1b' },
  Medium: { bg: '#fef3c7', text: '#92400e' },
  Low: { bg: '#f3f4f6', text: '#6b7280' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Pending: { bg: '#fef3c7', text: '#92400e' },
  Resolved: { bg: '#d1fae5', text: '#065f46' },
  Dismissed: { bg: '#f3f4f6', text: '#6b7280' },
};

const typeIcons: Record<string, React.ComponentType<any>> = {
  Post: MessageSquare,
  Comment: MessageSquare,
  User: User,
};

export function ReportsModeration() {
  const [filter, setFilter] = useState('All');

  const filtered = reports.filter(r => filter === 'All' || r.status === filter);
  const pending = reports.filter(r => r.status === 'Pending').length;

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Reports & Moderation</h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Review reported content and manage community safety</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Pending Review', value: pending.toString(), color: '#ff9500', icon: AlertTriangle },
          { label: 'Resolved This Week', value: '23', color: '#34c759', icon: Check },
          { label: 'Users Warned', value: '7', color: '#0066cc', icon: Shield },
          { label: 'Accounts Suspended', value: '2', color: '#ff3b30', icon: Ban },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <s.icon size={15} color={s.color} strokeWidth={2} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.8px', marginBottom: '3px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#7a7a7a' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '16px' }}>
        {['All', 'Pending', 'Resolved', 'Dismissed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '5px 13px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: filter === f ? '#1d1d1f' : '#f5f5f7', color: filter === f ? '#fff' : '#3a3a3c' }}
          >
            {f}
            {f === 'Pending' && pending > 0 && (
              <span style={{ marginLeft: '5px', background: '#ff3b30', color: '#fff', borderRadius: '9999px', padding: '0 5px', fontSize: '10px', fontWeight: 700 }}>{pending}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(report => {
          const TypeIcon = typeIcons[report.type] || Flag;
          const sev = severityColors[report.severity];
          const sta = statusColors[report.status];
          return (
            <div key={report.id} style={{ background: '#ffffff', border: report.status === 'Pending' ? '1px solid #fca5a5' : '1px solid #e0e0e0', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: report.status === 'Pending' ? '#fee2e2' : '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flag size={16} color={report.status === 'Pending' ? '#ff3b30' : '#7a7a7a'} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#f0f4ff', color: '#0066cc', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{report.type}</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', background: sev.bg, color: sev.text }}>{report.severity} Severity</span>
                    <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px', background: sta.bg, color: sta.text }}>{report.status}</span>
                    <span style={{ fontSize: '11px', color: '#b0b0b8', marginLeft: 'auto' }}>{report.time}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#3a3a3c', fontStyle: 'italic', marginBottom: '10px', lineHeight: 1.5, background: '#fafafa', borderRadius: '8px', padding: '10px 12px', border: '1px solid #f0f0f0' }}>
                    {report.content}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#7a7a7a' }}>
                    <span>Reported by: <strong style={{ color: '#3a3a3c' }}>{report.reportedBy}</strong></span>
                    <span>Reported user: <strong style={{ color: '#3a3a3c' }}>{report.reportedUser}</strong></span>
                    <span>Reason: <strong style={{ color: '#3a3a3c' }}>{report.reason}</strong></span>
                  </div>
                </div>
                {report.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button style={{ padding: '7px 12px', borderRadius: '8px', background: '#d1fae5', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={12} /> Approve</button>
                    <button style={{ padding: '7px 12px', borderRadius: '8px', background: '#fee2e2', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><X size={12} /> Remove</button>
                    <button style={{ padding: '7px 10px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Ban size={12} /> Warn</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
