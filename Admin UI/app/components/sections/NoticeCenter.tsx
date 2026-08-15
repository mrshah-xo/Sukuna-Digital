import React, { useState } from 'react';
import { Plus, Bell, Clock, Users, BookOpen, Briefcase, ChevronDown, Send, Eye, Trash2, Pin } from 'lucide-react';

const notices = [
  { id: 1, title: 'End of Term Examination Timetable', body: 'The 2nd term examinations will commence on June 10th. All students must be in school by 7:30 AM. Calculators are allowed for Maths only.', target: 'All Users', author: 'Principal', date: 'May 28, 2026', reads: 2841, pinned: true, status: 'Published' },
  { id: 2, title: 'Staff Meeting — Compulsory Attendance', body: 'All teaching staff are required to attend the end-of-term staff meeting on June 5th at 2:00 PM in the Main Hall.', target: 'Teachers', author: 'Admin', date: 'May 27, 2026', reads: 138, pinned: false, status: 'Published' },
  { id: 3, title: 'School Fees Deadline Reminder', body: 'Parents are reminded that the deadline for payment of second-term school fees is June 1st. Late payments will attract a penalty.', target: 'Students', author: 'Bursar', date: 'May 26, 2026', reads: 1923, pinned: false, status: 'Published' },
  { id: 4, title: 'Annual Science Exhibition — Volunteers Needed', body: 'SSS 2 and SSS 3 students interested in showcasing projects at the Annual Science Exhibition should submit their names to their form teachers.', target: 'SSS 2, SSS 3', author: 'HOD Sciences', date: 'May 25, 2026', reads: 892, pinned: false, status: 'Published' },
  { id: 5, title: 'Welcome Back — Third Term Begins July 14', body: "We are pleased to announce that the third term of the 2025/2026 academic year will begin on Monday, July 14th. We wish all students a restful holiday.", target: 'All Users', author: 'Admin', date: 'May 22, 2026', reads: 0, pinned: false, status: 'Scheduled' },
];

const targetOptions = ['All Users', 'Students', 'Teachers', 'Workers', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];

export function NoticeCenter() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('All Users');
  const [scheduleMode, setScheduleMode] = useState(false);

  const targetColors: Record<string, string> = {
    'All Users': '#0066cc',
    Teachers: '#5856d6',
    Students: '#34c759',
    Workers: '#ff9500',
  };
  const tc = (t: string) => targetColors[t] || '#7a7a7a';

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Notice Center</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Create, schedule, and manage all school announcements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            height: '34px', padding: '0 18px', borderRadius: '9999px',
            background: '#0066cc', color: '#fff', border: 'none',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <Plus size={13} strokeWidth={2.5} />
          Create Notice
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f', marginBottom: '18px' }}>New Notice</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>TITLE</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Notice title..."
                style={{
                  width: '100%', height: '40px', borderRadius: '10px',
                  border: '1px solid #e0e0e0', padding: '0 14px',
                  fontSize: '14px', color: '#1d1d1f', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>MESSAGE</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Write your notice here..."
                rows={4}
                style={{
                  width: '100%', borderRadius: '10px', border: '1px solid #e0e0e0',
                  padding: '12px 14px', fontSize: '14px', color: '#1d1d1f',
                  outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>TARGET AUDIENCE</label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  style={{
                    width: '100%', height: '40px', borderRadius: '10px',
                    border: '1px solid #e0e0e0', padding: '0 14px',
                    fontSize: '14px', color: '#1d1d1f', background: '#fff', outline: 'none',
                  }}
                >
                  {targetOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#3a3a3c', display: 'block', marginBottom: '6px' }}>DELIVERY</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Publish Now', 'Schedule'].map(d => (
                    <button
                      key={d}
                      onClick={() => setScheduleMode(d === 'Schedule')}
                      style={{
                        flex: 1, height: '40px', borderRadius: '10px',
                        border: '1px solid #e0e0e0',
                        background: (d === 'Schedule') === scheduleMode ? '#0066cc' : '#f5f5f7',
                        color: (d === 'Schedule') === scheduleMode ? '#fff' : '#3a3a3c',
                        fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ padding: '9px 20px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '9px 20px', borderRadius: '9999px', background: '#0066cc',
                  border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff',
                  fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <Send size={12} strokeWidth={2} />
                {scheduleMode ? 'Schedule Notice' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notices.map(notice => (
          <div
            key={notice.id}
            style={{
              background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '20px 22px',
              position: 'relative', borderLeft: notice.pinned ? '3px solid #0066cc' : '1px solid #e0e0e0',
            }}
          >
            {notice.pinned && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#0066cc' }}>
                <Pin size={11} strokeWidth={2.5} />
                Pinned
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={16} color="#0066cc" strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.2px' }}>{notice.title}</span>
                  <span
                    style={{
                      fontSize: '10.5px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px',
                      background: notice.status === 'Published' ? '#d1fae5' : '#fef3c7',
                      color: notice.status === 'Published' ? '#065f46' : '#92400e',
                    }}
                  >
                    {notice.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#5a5a5e', lineHeight: 1.5, margin: '0 0 12px', letterSpacing: '-0.1px' }}>
                  {notice.body}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', background: `${tc(notice.target)}18`, color: tc(notice.target) }}>
                    {notice.target}
                  </span>
                  <span style={{ fontSize: '11px', color: '#7a7a7a' }}>By {notice.author}</span>
                  <span style={{ fontSize: '11px', color: '#7a7a7a' }}>{notice.date}</span>
                  {notice.reads > 0 && (
                    <span style={{ fontSize: '11px', color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Eye size={11} /> {notice.reads.toLocaleString()} reads
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500 }}>Edit</button>
                <button style={{ padding: '6px 8px', borderRadius: '8px', background: '#fff0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={13} color="#ff3b30" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
