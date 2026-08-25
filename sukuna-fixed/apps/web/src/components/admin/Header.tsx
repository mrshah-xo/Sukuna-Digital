'use client';
import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, Upload, FileText, BookPlus, Megaphone, X } from 'lucide-react';
import type { SectionId } from './AdminApp';

const sectionTitles: Record<SectionId, string> = {
  overview: 'Dashboard', branding: 'School Branding', users: 'User Management',
  sukunabook: 'Sukuna Book', notices: 'Notice Center', calendar: 'Calendar',
  results: 'Results', library: 'Library', payments: 'Payments',
  research: 'Research Hub', memory: 'Memories', faq: 'FAQ Manager',
  otp: 'OTP & Verification', reports: 'Reports & Moderation',
  analytics: 'Analytics', security: 'Security Logs', settings: 'Settings',
};

const quickActions = [
  { icon: Bell, label: 'Create Notice' },
  { icon: Upload, label: 'Upload Result' },
  { icon: FileText, label: 'Create Research' },
  { icon: BookPlus, label: 'Add Library Resource' },
  { icon: Megaphone, label: 'Post Announcement' },
];

export function Header({ activeSection }: { activeSection: SectionId }) {
  const [showActions, setShowActions] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <header style={{
      background: '#ffffff', borderBottom: '1px solid #e0e0e0',
      padding: '0 28px', height: '68px', display: 'flex',
      alignItems: 'center', gap: '20px', flexShrink: 0,
      position: 'relative', zIndex: 50,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
          {greeting}, Administrator
        </div>
        <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '2px' }}>
          {dateStr} · {timeStr}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Search size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
        <input placeholder="Search students, teachers..."
          style={{
            paddingLeft: '36px', paddingRight: '16px', height: '36px', width: '240px',
            background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: '9999px',
            fontSize: '13px', color: '#1d1d1f', outline: 'none',
          }}
        />
      </div>

      {/* Quick actions */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => { setShowActions(!showActions); setShowNotifs(false); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '9999px',
            background: '#0066cc', border: 'none', cursor: 'pointer',
            color: '#ffffff', fontSize: '13px', fontWeight: 500,
          }}>
          <Plus size={14} /> Quick Action
        </button>
        {showActions && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            background: '#ffffff', border: '1px solid #e0e0e0',
            borderRadius: '14px', padding: '8px', width: '210px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)', zIndex: 100,
          }}>
            {quickActions.map(({ icon: Icon, label }) => (
              <button key={label} onClick={() => setShowActions(false)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '8px', border: 'none',
                  cursor: 'pointer', background: 'transparent',
                  fontSize: '13px', color: '#1d1d1f', textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f7'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon size={15} color="#0066cc" /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications bell */}
      <button onClick={() => { setShowNotifs(!showNotifs); setShowActions(false); }}
        style={{
          position: 'relative', width: '36px', height: '36px', borderRadius: '50%',
          background: '#f5f5f7', border: '1px solid #e0e0e0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <Bell size={16} color="#1d1d1f" />
        <span style={{
          position: 'absolute', top: '-2px', right: '-2px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#ff3b30', color: '#ffffff', fontSize: '9px',
          fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #ffffff',
        }}>3</span>
      </button>

      {/* Admin avatar */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: '#0066cc', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>AD</span>
      </div>
    </header>
  );
}
