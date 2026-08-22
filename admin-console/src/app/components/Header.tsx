'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Plus, Upload, FileText, BookPlus, Megaphone, X } from 'lucide-react';
import type { SectionId } from '../App';

const sectionTitles: Record<SectionId, string> = {
  overview: 'Dashboard',
  branding: 'School Branding',
  users: 'User Management',
  phonenumbers: 'Phone Numbers',
  attendance: 'Attendance',
  sukunabook: 'Sukuna Book',
  notices: 'Notice Center',
  calendar: 'Calendar',
  results: 'Results',
  library: 'Library',
  payments: 'Payments',
  research: 'Research Hub',
  memory: 'Memories',
  transport: 'Transport',
  faq: 'FAQ Manager',
  otp: 'OTP & Verification',
  reports: 'Reports & Moderation',
  analytics: 'Analytics',
  security: 'Security Logs',
  settings: 'Settings',
};

interface HeaderProps {
  activeSection: SectionId;
}

const quickActions = [
  { icon: Bell, label: 'Create Notice' },
  { icon: Upload, label: 'Upload Result' },
  { icon: FileText, label: 'Create Research' },
  { icon: BookPlus, label: 'Add Library Resource' },
  { icon: Megaphone, label: 'Post Announcement' },
];

export function Header({ activeSection }: HeaderProps) {
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
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 28px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div style={{ flex: 1 }}>
        <div className="m-[0px] p-[0px]" style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
          {greeting}, Administrator
        </div>
        <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '2px', letterSpacing: '-0.05px' }}>
          {dateStr} · {timeStr}
        </div>
      </div>

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Search
          size={14}
          style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }}
        />
        <input
          type="text"
          placeholder="Search students, teachers..."
          style={{
            width: '260px',
            height: '34px',
            borderRadius: '9999px',
            border: '1px solid #e0e0e0',
            paddingLeft: '34px',
            paddingRight: '14px',
            fontSize: '13px',
            color: '#1d1d1f',
            background: '#f5f5f7',
            outline: 'none',
            boxSizing: 'border-box',
            letterSpacing: '-0.1px',
          }}
        />
      </div>

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => { setShowActions(!showActions); setShowNotifs(false); }}
          style={{
            height: '34px',
            padding: '0 16px',
            borderRadius: '9999px',
            background: '#0066cc',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '-0.1px',
          }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Quick Actions
          <ChevronDown size={11} strokeWidth={2.5} />
        </button>

        {showActions && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
              onClick={() => setShowActions(false)}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '42px',
                width: '210px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '14px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.10)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => setShowActions(false)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    color: '#1d1d1f',
                    letterSpacing: '-0.1px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <action.icon size={14} color="#0066cc" strokeWidth={1.75} />
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowActions(false); }}
          style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
        >
          <Bell size={19} color="#3a3a3c" strokeWidth={1.75} />
          <span
            style={{
              position: 'absolute',
              top: '3px',
              right: '3px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: '#ff3b30',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            7
          </span>
        </button>

        {showNotifs && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotifs(false)} />
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '44px',
                width: '320px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '14px',
                boxShadow: '0 8px 28px rgba(0,0,0,0.10)',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>Notifications</span>
                <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7a7a' }}>
                  <X size={14} />
                </button>
              </div>
              {[
                { msg: 'New report submitted by Amara O.', time: '2m ago', dot: '#ff3b30' },
                { msg: 'Payment overdue: 34 students', time: '15m ago', dot: '#ff9500' },
                { msg: 'Memory session starting in 30 mins', time: '28m ago', dot: '#0066cc' },
                { msg: 'Research paper approved', time: '1h ago', dot: '#34c759' },
                { msg: 'System backup completed', time: '2h ago', dot: '#8e8e93' },
              ].map((n, i) => (
                <div
                  key={i}
                  style={{ padding: '14px 18px', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: '5px' }} />
                  <div>
                    <div style={{ fontSize: '13px', color: '#1d1d1f', letterSpacing: '-0.1px' }}>{n.msg}</div>
                    <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '2px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: '10px',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#1d1d1f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.5px',
          }}
        >
          SA
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f', letterSpacing: '-0.1px' }}>Super Admin</div>
          <div style={{ fontSize: '10.5px', color: '#7a7a7a' }}>Full Access</div>
        </div>
        <ChevronDown size={12} color="#7a7a7a" strokeWidth={2} />
      </button>
    </header>
  );
}
