import React, { useState } from 'react';
import { Shield, Zap, Server, Database, Bell, Activity, HardDrive, Wifi, CheckCircle } from 'lucide-react';

const tabs = ['Role Permissions', 'Feature Toggles', 'System Health', 'Backups & Storage', 'Notifications'];

function Toggle2({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{ width: '44px', height: '24px', borderRadius: '9999px', background: on ? '#0066cc' : '#d0d0d5', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.15s' }}>
      <span style={{ position: 'absolute', top: '2px', left: on ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.15s' }} />
    </button>
  );
}

const roles = [
  { role: 'Super Admin', permissions: ['All Features', 'User Management', 'System Settings', 'Security Logs', 'Billing'] },
  { role: 'Admin', permissions: ['User Management', 'Content Moderation', 'Notice Center', 'Reports'] },
  { role: 'HOD (Head of Department)', permissions: ['Results', 'Library', 'Research Hub', 'Notice Center (Class)'] },
  { role: 'Teacher', permissions: ['Results (Class)', 'Library', 'Memories', 'Sukuna Book'] },
  { role: 'Student', permissions: ['View Results', 'Library Access', 'Memories', 'Sukuna Book', 'Payments'] },
];

const initialFeatures: { label: string; desc: string; on: boolean; category: string }[] = [
  { label: 'Sukuna Book', desc: 'School social network for students and teachers', on: true, category: 'Platform' },
  { label: 'Memories', desc: 'Interactive learning sessions', on: true, category: 'Platform' },
  { label: 'Research Hub', desc: 'Student and teacher research submissions', on: true, category: 'Platform' },
  { label: 'Library Access', desc: 'Digital and physical library management', on: true, category: 'Platform' },
  { label: 'Online Payments', desc: 'Accept payments via Paystack & bank transfer', on: true, category: 'Commerce' },
  { label: 'Push Notifications', desc: 'Real-time alerts to student and teacher devices', on: true, category: 'Communication' },
  { label: 'OTP Verification', desc: 'Two-factor authentication via SMS OTP', on: true, category: 'Security' },
  { label: 'Maintenance Mode', desc: 'Take the app offline for updates', on: false, category: 'System' },
  { label: 'Guest Browsing', desc: 'Allow limited access without login', on: false, category: 'System' },
  { label: 'Transport Tracking', desc: 'GPS-based bus tracking (coming soon)', on: false, category: 'Platform' },
];

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('Role Permissions');
  const [features, setFeatures] = useState(initialFeatures);
  const [saved, setSaved] = useState(false);

  const toggleFeature = (index: number) => {
    setFeatures(prev => prev.map((f, i) => i === index ? { ...f, on: !f.on } : f));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Super Admin Settings</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Control platform-wide settings, permissions, and system configuration</p>
        </div>
        <button
          onClick={handleSave}
          style={{ padding: '7px 18px', borderRadius: '9999px', background: saved ? '#34c759' : '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
        >
          {saved ? <><CheckCircle size={13} /> Saved!</> : 'Save All Settings'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '22px', borderBottom: '1px solid #f0f0f0' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '9px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? '#0066cc' : '#7a7a7a', borderBottom: activeTab === t ? '2px solid #0066cc' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
          >{t}</button>
        ))}
      </div>

      {activeTab === 'Role Permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roles.map(r => (
            <div key={r.role} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={16} color="#0066cc" strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>{r.role}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {r.permissions.map(p => (
                      <span key={p} style={{ fontSize: '12px', fontWeight: 500, padding: '3px 10px', borderRadius: '9999px', background: '#f0f4ff', color: '#0066cc', border: '1px solid #bcd4f7' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <button style={{ padding: '6px 14px', borderRadius: '9px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12.5px', color: '#3a3a3c', fontWeight: 500, flexShrink: 0 }}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Feature Toggles' && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          {features.map((f, i) => (
            <div key={f.label} style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: i < features.length - 1 ? '1px solid #f8f8f8' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {f.label}
                  <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '1px 7px', borderRadius: '9999px', background: '#f5f5f7', color: '#7a7a7a', letterSpacing: '0.3px' }}>{f.category}</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#7a7a7a', marginTop: '2px' }}>{f.desc}</div>
              </div>
              <Toggle2 on={f.on} onChange={() => toggleFeature(i)} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'System Health' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { title: 'API Health', items: [['Status', 'Operational', true], ['Response Time', '112ms', true], ['Error Rate', '0.02%', true], ['Uptime (30d)', '99.97%', true]] },
            { title: 'Database', items: [['Status', 'Healthy', true], ['Size', '4.7 GB', true], ['Connections', '24 / 100', true], ['Last Backup', '2h ago', true]] },
            { title: 'Storage', items: [['Used', '64.3 GB', true], ['Available', '35.7 GB', true], ['Uploads Today', '1.2 GB', true], ['Cleanup Due', 'Jun 1, 2026', true]] },
            { title: 'Notifications', items: [['SMS Sent Today', '1,234', true], ['Push Sent Today', '2,891', true], ['Delivery Rate', '98.4%', true], ['Failed', '23', false]] },
          ].map(section => (
            <div key={section.title} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '20px 22px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '14px' }}>{section.title}</div>
              {section.items.map(([label, value, ok]: any) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: '13px', color: '#5a5a5e' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ok ? '#34c759' : '#ff3b30', display: 'inline-block' }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Backups & Storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { type: 'Full Database Backup', size: '4.7 GB', date: 'May 30, 2026 · 2:00 AM', status: 'Completed', auto: true },
            { type: 'Media & Uploads Backup', size: '59.6 GB', date: 'May 29, 2026 · 2:00 AM', status: 'Completed', auto: true },
            { type: 'Configuration Backup', size: '12 MB', date: 'May 28, 2026 · 11:00 PM', status: 'Completed', auto: false },
            { type: 'Full System Snapshot', size: '64.3 GB', date: 'May 15, 2026 · 2:00 AM', status: 'Completed', auto: true },
          ].map((b, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={16} color="#065f46" strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f' }}>{b.type}</div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>{b.date} · {b.size} · {b.auto ? 'Automated' : 'Manual'}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px', background: '#d1fae5', color: '#065f46' }}>Completed</span>
              <button style={{ padding: '6px 14px', borderRadius: '9px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12.5px', color: '#3a3a3c', fontWeight: 500 }}>Restore</button>
            </div>
          ))}
          <button style={{ padding: '12px 22px', borderRadius: '14px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
            <Database size={16} /> Run Manual Backup Now
          </button>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '18px' }}>Notification Controls</div>
          {[
            { label: 'SMS OTP Notifications', desc: 'Send OTP via SMS for phone verification', on: true },
            { label: 'Push Notifications — Notices', desc: 'Push alerts when a new notice is published', on: true },
            { label: 'Push Notifications — Results', desc: 'Push alerts when results are released', on: true },
            { label: 'Payment Reminders', desc: 'Automated payment due date reminders', on: true },
            { label: 'Research Approval Alerts', desc: 'Alert teachers when their research is reviewed', on: true },
            { label: 'Login from New Device Alert', desc: 'Security alert for unknown device logins', on: false },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f' }}>{item.label}</div>
                <div style={{ fontSize: '12.5px', color: '#7a7a7a', marginTop: '2px' }}>{item.desc}</div>
              </div>
              <Toggle2 on={item.on} onChange={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
