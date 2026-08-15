import React, { useState } from 'react';
import { Search, Filter, Calendar, Users, CheckCircle, XCircle, TrendingUp, Download } from 'lucide-react';

const classes = ['All Classes', 'Class 10A', 'Class 10B', 'Class 9A', 'Class 9B', 'Class 8A', 'Class 8B', 'Class 7A'];

const students = [
  { id: 'SKN001', name: 'Aarav Shrestha', class: 'Class 10A', present: 48, absent: 4, percentage: 92.3, today: 'Present' },
  { id: 'SKN002', name: 'Priya Tamang', class: 'Class 10A', present: 50, absent: 2, percentage: 96.2, today: 'Present' },
  { id: 'SKN003', name: 'Bikash Karki', class: 'Class 10B', present: 38, absent: 14, percentage: 73.1, today: 'Absent' },
  { id: 'SKN004', name: 'Sunita Rai', class: 'Class 9A', present: 51, absent: 1, percentage: 98.1, today: 'Present' },
  { id: 'SKN005', name: 'Roshan Lama', class: 'Class 9A', present: 44, absent: 8, percentage: 84.6, today: 'Present' },
  { id: 'SKN006', name: 'Anita Gurung', class: 'Class 9B', present: 52, absent: 0, percentage: 100.0, today: 'Present' },
  { id: 'SKN007', name: 'Dipak Magar', class: 'Class 8A', present: 36, absent: 16, percentage: 69.2, today: 'Absent' },
  { id: 'SKN008', name: 'Kamala Thapa', class: 'Class 8A', present: 49, absent: 3, percentage: 94.2, today: 'Present' },
  { id: 'SKN009', name: 'Suresh Limbu', class: 'Class 8B', present: 46, absent: 6, percentage: 88.5, today: 'Present' },
  { id: 'SKN010', name: 'Nisha Bhattarai', class: 'Class 7A', present: 53, absent: 0, percentage: 100.0, today: 'Present' },
  { id: 'SKN011', name: 'Rajesh Pandey', class: 'Class 10B', present: 40, absent: 12, percentage: 76.9, today: 'Absent' },
  { id: 'SKN012', name: 'Meena Koirala', class: 'Class 7A', present: 50, absent: 3, percentage: 94.3, today: 'Present' },
];

const weekTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => ({
  day,
  present: [234, 241, 228, 244, 238][i],
  absent: [18, 11, 24, 8, 14][i],
}));

const maxPresent = Math.max(...weekTrend.map(d => d.present + d.absent));

export function AttendanceManagement() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [dateStr] = useState('Today, 14 Aug 2026');

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchClass = classFilter === 'All Classes' || s.class === classFilter;
    return matchSearch && matchClass;
  });

  const totalPresent = students.filter(s => s.today === 'Present').length;
  const totalAbsent = students.filter(s => s.today === 'Absent').length;
  const attendancePct = Math.round((totalPresent / students.length) * 100);
  const avgPct = Math.round(students.reduce((a, s) => a + s.percentage, 0) / students.length * 10) / 10;

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
            Attendance Management
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px', letterSpacing: '-0.05px' }}>
            {dateStr} · {students.length} students tracked
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ height: '34px', padding: '0 14px', borderRadius: '9999px', background: '#f5f5f7', color: '#3a3a3c', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} /> Select date
          </button>
          <button style={{ height: '34px', padding: '0 14px', borderRadius: '9999px', background: '#0066cc', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
        {[
          { label: 'Total Students', value: students.length.toString(), icon: Users, color: '#0066cc' },
          { label: 'Present Today', value: totalPresent.toString(), icon: CheckCircle, color: '#34c759' },
          { label: 'Absent Today', value: totalAbsent.toString(), icon: XCircle, color: '#ff3b30' },
          { label: 'Avg. Attendance', value: `${avgPct}%`, icon: TrendingUp, color: '#5856d6' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={15} color={stat.color} strokeWidth={1.75} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.7px', lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '18px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
              <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search student or ID..."
                style={{ width: '100%', height: '32px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '32px', paddingRight: '12px', fontSize: '12.5px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <Filter size={13} color="#7a7a7a" />
            <select
              value={classFilter}
              onChange={e => setClassFilter(e.target.value)}
              style={{ height: '32px', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '0 10px', fontSize: '12.5px', color: '#1d1d1f', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Student', 'ID', 'Class', 'Present', 'Absent', 'Avg. %', 'Today'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700, color: '#7a7a7a', letterSpacing: '0.4px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8f8f8' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{s.name}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12px', color: '#7a7a7a', fontFamily: 'monospace' }}>{s.id}</td>
                  <td style={{ padding: '11px 16px', fontSize: '12.5px', color: '#3a3a3c' }}>{s.class}</td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 500, color: '#34c759' }}>{s.present}</td>
                  <td style={{ padding: '11px 16px', fontSize: '13px', fontWeight: 500, color: s.absent > 10 ? '#ff3b30' : '#ff9500' }}>{s.absent}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '4px', background: '#f0f0f0', borderRadius: '2px', minWidth: '40px' }}>
                        <div style={{ height: '100%', width: `${s.percentage}%`, background: s.percentage >= 90 ? '#34c759' : s.percentage >= 75 ? '#ff9500' : '#ff3b30', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: s.percentage >= 90 ? '#34c759' : s.percentage >= 75 ? '#ff9500' : '#ff3b30', minWidth: '36px' }}>{s.percentage}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 9px', borderRadius: '9999px', background: s.today === 'Present' ? '#d1fae5' : '#fee2e2', color: s.today === 'Present' ? '#065f46' : '#991b1b' }}>
                      {s.today}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '36px', textAlign: 'center', color: '#7a7a7a', fontSize: '14px' }}>No students match your search.</div>
          )}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '4px' }}>This Week</div>
          <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '18px' }}>Daily attendance trend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weekTrend.map(day => (
              <div key={day.day}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#3a3a3c' }}>{day.day}</span>
                  <span style={{ fontSize: '12px', color: '#7a7a7a' }}>{day.present}/{day.present + day.absent}</span>
                </div>
                <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(day.present / maxPresent) * 100}%`,
                      background: '#0066cc',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1d1d1f', marginBottom: '12px' }}>Today's Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12.5px', color: '#3a3a3c' }}>Present</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#34c759' }}>{totalPresent}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12.5px', color: '#3a3a3c' }}>Absent</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#ff3b30' }}>{totalAbsent}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', color: '#3a3a3c' }}>Attendance %</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc' }}>{attendancePct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
