'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

const events = [
  { date: '2026-06-02', title: 'Memories Upload: Annual Sports Day', type: 'academic', time: '10:00 AM', class: 'All Students' },
  { date: '2026-06-05', title: 'Staff Meeting — All Teachers', type: 'admin', time: '2:00 PM', class: 'All Staff' },
  { date: '2026-06-07', title: 'Science Exhibition Setup', type: 'event', time: '9:00 AM', class: 'SSS 2 & SSS 3' },
  { date: '2026-06-08', title: 'Annual Science Exhibition', type: 'event', time: '10:00 AM', class: 'Whole School' },
  { date: '2026-06-10', title: '2nd Term Examinations Begin', type: 'exam', time: '7:30 AM', class: 'All Classes' },
  { date: '2026-06-20', title: 'End of Term — Last Day', type: 'holiday', time: 'All Day', class: 'All Classes' },
  { date: '2026-06-25', title: 'Staff Development Workshop', type: 'admin', time: '9:00 AM', class: 'All Teachers' },
  { date: '2026-07-14', title: 'Third Term Begins', type: 'academic', time: '7:30 AM', class: 'All Classes' },
];

const typeColors: Record<string, { bg: string; text: string; dot: string }> = {
  academic: { bg: '#dbeafe', text: '#1e40af', dot: '#0066cc' },
  admin: { bg: '#ede9fe', text: '#5b21b6', dot: '#5856d6' },
  event: { bg: '#fef3c7', text: '#92400e', dot: '#ff9500' },
  exam: { bg: '#fee2e2', text: '#991b1b', dot: '#ff3b30' },
  holiday: { bg: '#d1fae5', text: '#065f46', dot: '#34c759' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-06-10');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);

  const selectedEvents = selectedDay ? getEventsForDate(selectedDay) : [];
  const upcomingEvents = events.filter(e => e.date >= '2026-05-30').slice(0, 5);

  return (
    <div style={{ padding: '28px 32px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>School Calendar</h2>
            <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Academic year 2025/2026 events and schedule</p>
          </div>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={13} strokeWidth={2.5} /> Add Event
          </button>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={prevMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color="#3a3a3c" />
            </button>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', margin: 0, letterSpacing: '-0.2px' }}>
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth} style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={16} color="#3a3a3c" />
            </button>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '8px' }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: 600, color: '#7a7a7a', padding: '8px 0', letterSpacing: '0.3px' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEvents = getEventsForDate(dateStr);
                const isToday = dateStr === '2026-05-30';
                const isSelected = dateStr === selectedDay;
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(dateStr)}
                    style={{
                      padding: '6px', borderRadius: '10px', cursor: 'pointer', minHeight: '60px',
                      background: isSelected ? '#eff6ff' : isToday ? '#f5f5f7' : 'transparent',
                      border: isSelected ? '1px solid #bcd4f7' : '1px solid transparent',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      fontSize: '13px', fontWeight: isToday ? 700 : isSelected ? 600 : 400,
                      marginBottom: '4px',
                      width: '24px', height: '24px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isToday ? '#0066cc' : 'transparent',
                      color: isToday ? '#ffffff' : isSelected ? '#0066cc' : '#1d1d1f',
                    } as any}>
                      {day}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvents.slice(0, 2).map((e, idx) => {
                        const tc = typeColors[e.type];
                        return (
                          <div key={idx} style={{ fontSize: '9.5px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', background: tc.bg, color: tc.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {e.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div style={{ fontSize: '9px', color: '#7a7a7a', paddingLeft: '5px' }}>+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {selectedDay && selectedEvents.length > 0 && (
          <div style={{ marginTop: '16px', background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>
              Events on {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            {selectedEvents.map((ev, i) => {
              const tc = typeColors[ev.type];
              return (
                <div key={i} style={{ padding: '14px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: i < selectedEvents.length - 1 ? '1px solid #f8f8f8' : 'none' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tc.dot, flexShrink: 0, marginTop: '5px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f' }}>{ev.title}</div>
                    <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>{ev.time} · {ev.class}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 9px', borderRadius: '9999px', background: tc.bg, color: tc.text, textTransform: 'capitalize', flexShrink: 0 }}>{ev.type}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: '#1d1d1f', borderRadius: '18px', padding: '22px', color: '#fff' }}>
          <div style={{ fontSize: '11px', color: '#6e6e73', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Upcoming Events</div>
          {upcomingEvents.map((ev, i) => {
            const tc = typeColors[ev.type];
            const d = new Date(ev.date + 'T00:00:00');
            return (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < upcomingEvents.length - 1 ? '1px solid #2c2c2e' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '32px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{d.getDate()}</div>
                    <div style={{ fontSize: '9px', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{MONTHS[d.getMonth()].slice(0, 3)}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#fff', letterSpacing: '-0.1px' }}>{ev.title}</div>
                    <div style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{ev.time}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '12px' }}>Event Types</div>
          {Object.entries(typeColors).map(([type, colors]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: '#3a3a3c', textTransform: 'capitalize', flex: 1 }}>{type}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 7px', borderRadius: '9999px', background: colors.bg, color: colors.text }}>
                {events.filter(e => e.type === type).length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
