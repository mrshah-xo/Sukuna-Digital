'use client';

import React, { useState } from 'react';
import { Upload, Image, RefreshCw, Clock, Eye, CheckCircle } from 'lucide-react';

const versionHistory = [
  { version: 'v3.2', date: 'May 20, 2026', changes: 'Updated hero banner for term 2', by: 'Admin' },
  { version: 'v3.1', date: 'Feb 1, 2026', changes: 'New school logo (updated crest)', by: 'Principal' },
  { version: 'v3.0', date: 'Sep 3, 2025', changes: 'Full rebrand — new color palette', by: 'Admin' },
  { version: 'v2.5', date: 'Jun 12, 2025', changes: 'Updated welcome message', by: 'Admin' },
];

function UploadZone({ label, aspect }: { label: string; aspect: string }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); }}
      style={{
        border: `2px dashed ${dragOver ? '#0066cc' : '#e0e0e0'}`,
        borderRadius: '14px',
        padding: '28px 20px',
        textAlign: 'center',
        background: dragOver ? '#eff6ff' : '#fafafa',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Upload size={18} color="#0066cc" strokeWidth={1.75} />
      </div>
      <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '8px' }}>Drag & drop or click to upload</div>
      <div style={{ fontSize: '11px', color: '#b0b0b8' }}>PNG, JPG, WebP · Max 10MB · {aspect}</div>
      <button style={{ marginTop: '12px', padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '12.5px', color: '#fff', fontWeight: 500 }}>
        Choose File
      </button>
    </div>
  );
}

export function BrandingCenter() {
  const [schoolName, setSchoolName] = useState('Sukuna Secondary School');
  const [appName, setAppName] = useState('Sukuna School App');
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome to Sukuna School — Where Excellence Meets Innovation');
  const [frame2Title, setFrame2Title] = useState('Your Education, Reimagined');
  const [frame2Desc, setFrame2Desc] = useState('Access your results, library, and learning materials all in one place. Designed for students who aspire to be the best.');
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>School Branding Center</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Manage your school's visual identity and app content</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={13} /> Preview App
          </button>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            style={{ padding: '7px 18px', borderRadius: '9999px', background: saved ? '#34c759' : '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
          >
            {saved ? <><CheckCircle size={13} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '18px' }}>Identity Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'SCHOOL NAME', value: schoolName, onChange: setSchoolName },
              { label: 'APP NAME', value: appName, onChange: setAppName },
              { label: 'WELCOME MESSAGE', value: welcomeMsg, onChange: setWelcomeMsg },
              { label: 'SECOND FRAME TITLE', value: frame2Title, onChange: setFrame2Title },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>{field.label}</label>
                <input
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 13px', fontSize: '13.5px', color: '#1d1d1f', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', display: 'block', marginBottom: '6px', letterSpacing: '0.3px' }}>SECOND FRAME DESCRIPTION</label>
              <textarea
                value={frame2Desc}
                onChange={e => setFrame2Desc(e.target.value)}
                rows={3}
                style={{ width: '100%', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '10px 13px', fontSize: '13.5px', color: '#1d1d1f', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>School Logo</div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>S</span>
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f' }}>Current Logo</div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>512×512px PNG · Updated Feb 2026</div>
                <button style={{ marginTop: '8px', padding: '5px 14px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500 }}>Replace</button>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="#7a7a7a" /> Version History
            </div>
            {versionHistory.map((v, i) => (
              <div key={v.version} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '9px 0', borderBottom: i < versionHistory.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#f5f5f7', color: '#3a3a3c', padding: '2px 7px', borderRadius: '5px', flexShrink: 0, marginTop: '1px' }}>{v.version}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12.5px', color: '#1d1d1f' }}>{v.changes}</div>
                  <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '1px' }}>{v.date} · {v.by}</div>
                </div>
                <button style={{ fontSize: '11.5px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  <RefreshCw size={11} /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>Homepage Hero Banner</div>
          <UploadZone label="Hero Banner Image" aspect="Recommended: 1440×600px" />
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '22px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '16px' }}>Second Frame Image</div>
          <UploadZone label="Second Frame Image" aspect="Recommended: 800×600px" />
        </div>
      </div>
    </div>
  );
}
