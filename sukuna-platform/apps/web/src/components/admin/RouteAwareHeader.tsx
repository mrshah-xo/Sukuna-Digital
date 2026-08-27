'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Plus, Upload, FileText, BookPlus, Megaphone, X } from 'lucide-react';
import { getSectionTitle } from '@/lib/admin-navigation';

const quickActions = [
  { icon: Bell, label: 'Create Notice', action: 'notice' },
  { icon: Upload, label: 'Upload Result', action: 'result' },
  { icon: FileText, label: 'Create Research', action: 'research' },
  { icon: BookPlus, label: 'Add Library Resource', action: 'library' },
  { icon: Megaphone, label: 'Post Announcement', action: 'announcement' },
];

interface RouteAwareHeaderProps {
  onSearch?: (query: string) => void;
}

export function RouteAwareHeader({ onSearch }: RouteAwareHeaderProps) {
  const pathname = usePathname();
  const [showActions, setShowActions] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Extract the section title from pathname
  const sectionTitle = getSectionTitle(pathname?.split('/')[2] || 'overview');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    setShowActions(false);
    // Implement quick action logic here
  };

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
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          {greeting}, Administrator
        </div>
        <div style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '2px' }}>
          {dateStr} · {timeStr}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '13px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#7a7a7a',
          }}
        />
        <input
          type="text"
          placeholder="Search students, teachers..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onSubmit={handleSearch}
          style={{
            paddingLeft: '36px',
            paddingRight: '16px',
            height: '36px',
            width: '240px',
            background: '#f5f5f7',
            border: '1px solid #e0e0e0',
            borderRadius: '9999px',
            fontSize: '13px',
            color: '#1d1d1f',
            outline: 'none',
          }}
        />
      </div>

      {/* Quick actions */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowActions(!showActions);
            setShowNotifs(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '9999px',
            background: '#0066cc',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <Plus size={14} /> Quick Action
        </button>
        {showActions && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              minWidth: '180px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.action)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: i === 0 ? '#f5f5f7' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1d1d1f',
                    fontSize: '13px',
                    fontWeight: 400,
                    textAlign: 'left',
                    borderRadius: i === 0 ? '8px 8px 0 0' : i === quickActions.length - 1 ? '0 0 8px 8px' : '0',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = '#f5f5f7';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background =
                      i === 0 ? '#f5f5f7' : 'transparent';
                  }}
                >
                  <Icon size={14} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowNotifs(!showNotifs);
            setShowActions(false);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#7a7a7a',
            position: 'relative',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#f5f5f7';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <Bell size={18} strokeWidth={1.5} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#ff3b30',
              borderRadius: '50%',
            }}
          />
        </button>
        {showNotifs && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              minWidth: '280px',
              maxWidth: '320px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              zIndex: 1000,
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#7a7a7a', padding: '8px' }}>
              No new notifications
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
