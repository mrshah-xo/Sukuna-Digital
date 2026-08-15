import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Clock, Phone, AlertTriangle, RefreshCw } from 'lucide-react';

const stats = [
  { label: 'OTPs Sent Today', value: '1,234', icon: Phone, color: '#0066cc' },
  { label: 'Successful Verifications', value: '1,189', icon: CheckCircle, color: '#34c759' },
  { label: 'Failed Attempts', value: '45', icon: XCircle, color: '#ff3b30' },
  { label: 'Blocked Numbers', value: '3', icon: AlertTriangle, color: '#ff9500' },
  { label: 'Verification Rate', value: '96.3%', icon: ShieldCheck, color: '#30d158' },
  { label: 'Avg. Verification Time', value: '38s', icon: Clock, color: '#5856d6' },
];

const blockedNumbers = [
  { phone: '+234 801 111 2222', reason: 'Too many failed attempts', since: 'May 28, 2026', attempts: 8 },
  { phone: '+234 802 333 4444', reason: 'Suspicious activity detected', since: 'May 27, 2026', attempts: 12 },
  { phone: '+234 803 555 6666', reason: 'Too many failed attempts', since: 'May 26, 2026', attempts: 6 },
];

const recentOtps = [
  { phone: '+234 801 234 5678', status: 'Success', time: '2m ago', name: 'Amara Okafor' },
  { phone: '+234 802 345 6789', status: 'Success', time: '4m ago', name: 'Chidera N.' },
  { phone: '+234 803 456 7890', status: 'Failed', time: '6m ago', name: 'Unknown' },
  { phone: '+234 804 567 8901', status: 'Success', time: '9m ago', name: 'Emmanuel A.' },
  { phone: '+234 805 678 9012', status: 'Expired', time: '15m ago', name: 'Ngozi Obi' },
];

export function OTPControl() {
  const [otpMessage, setOtpMessage] = useState('Your Sukuna School verification code is: {OTP}. Valid for 5 minutes. Do not share this code.');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxAttempts, setMaxAttempts] = useState('5');
  const [otpLength, setOtpLength] = useState('6');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    Success: { bg: '#d1fae5', text: '#065f46' },
    Failed: { bg: '#fee2e2', text: '#991b1b' },
    Expired: { bg: '#fef3c7', text: '#92400e' },
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>OTP & Verification Control</h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Manage phone verification settings and monitor authentication activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '22px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={14} color={s.color} strokeWidth={2} />
              </div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: '11.5px', color: '#7a7a7a', marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '18px' }}>OTP Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>VERIFICATION MESSAGE TEMPLATE</label>
              <textarea
                value={otpMessage}
                onChange={e => setOtpMessage(e.target.value)}
                rows={3}
                style={{ width: '100%', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '10px 13px', fontSize: '13px', color: '#1d1d1f', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
              />
              <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '4px' }}>Use {'{OTP}'} as placeholder for the generated code</div>
            </div>

            {[
              { label: 'OTP CODE LENGTH (digits)', value: otpLength, onChange: setOtpLength, min: '4', max: '8' },
              { label: 'SESSION TIMEOUT (minutes)', value: sessionTimeout, onChange: setSessionTimeout, min: '5', max: '60' },
              { label: 'MAX FAILED ATTEMPTS BEFORE BLOCK', value: maxAttempts, onChange: setMaxAttempts, min: '3', max: '10' },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  min={field.min}
                  max={field.max}
                  style={{ width: '120px', height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 13px', fontSize: '14px', color: '#1d1d1f', outline: 'none' }}
                />
              </div>
            ))}

            <div style={{ paddingTop: '4px' }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '9px 22px', borderRadius: '9999px',
                  background: saved ? '#34c759' : '#0066cc',
                  border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s',
                }}
              >
                {saved ? <><CheckCircle size={13} strokeWidth={2.5} /> Saved!</> : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px', flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px' }}>Recent OTP Activity</div>
            {recentOtps.map((otp, i) => {
              const sc = statusColors[otp.status];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < recentOtps.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{otp.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#7a7a7a', fontFamily: 'monospace' }}>{otp.phone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px', background: sc.bg, color: sc.text }}>{otp.status}</span>
                    <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '2px' }}>{otp.time}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Blocked Numbers
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', background: '#fee2e2', color: '#991b1b' }}>{blockedNumbers.length}</span>
            </div>
            {blockedNumbers.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: i < blockedNumbers.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#1d1d1f' }}>{b.phone}</div>
                  <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>{b.reason} · {b.attempts} attempts</div>
                </div>
                <button style={{ padding: '5px 10px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <RefreshCw size={11} /> Unblock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
