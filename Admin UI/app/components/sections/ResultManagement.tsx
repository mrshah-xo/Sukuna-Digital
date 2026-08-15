import React, { useState } from 'react';
import { Upload, Download, BarChart2, FileText, Search, Filter, ChevronDown } from 'lucide-react';

const results = [
  { id: 1, student: 'Amara Okafor', class: 'SSS 3 Science', term: '2nd Term 2025/26', maths: 88, english: 79, chemistry: 94, physics: 91, biology: 87, total: 439, grade: 'A', position: '1st', status: 'Published' },
  { id: 2, student: 'Emmanuel Adeyemi', class: 'SSS 3 Science', term: '2nd Term 2025/26', maths: 76, english: 82, chemistry: 80, physics: 78, biology: 85, total: 401, grade: 'B', position: '3rd', status: 'Published' },
  { id: 3, student: 'Chidera Nwachukwu', class: 'JSS 2A', term: '2nd Term 2025/26', maths: 92, english: 88, chemistry: 0, physics: 0, biology: 90, total: 270, grade: 'A', position: '1st', status: 'Draft' },
  { id: 4, student: 'Fatima Abdullahi', class: 'SSS 1 Arts', term: '2nd Term 2025/26', maths: 62, english: 91, chemistry: 0, physics: 0, biology: 0, total: 153, grade: 'B', position: '4th', status: 'Published' },
];

const classPerformance = [
  { class: 'SSS 3 Science', avg: 82.4, highest: 94, students: 42 },
  { class: 'SSS 3 Arts', avg: 76.2, highest: 89, students: 38 },
  { class: 'SSS 3 Commerce', avg: 79.1, highest: 91, students: 45 },
  { class: 'SSS 2 Science', avg: 80.7, highest: 95, students: 40 },
  { class: 'JSS 2A', avg: 85.3, highest: 97, students: 35 },
];

export function ResultManagement() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Results');

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Result Management</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Upload, manage, and publish academic results</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={13} /> Export
          </button>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={13} /> Upload Results
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '0' }}>
        {['Results', 'Class Analytics', 'Report Cards'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '9px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13.5px', fontWeight: activeTab === t ? 600 : 400,
              color: activeTab === t ? '#0066cc' : '#7a7a7a',
              borderBottom: activeTab === t ? '2px solid #0066cc' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Results' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by student name or class..."
                style={{ width: '100%', height: '36px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '34px', paddingRight: '14px', fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <select style={{ height: '36px', borderRadius: '9999px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none' }}>
              <option>All Classes</option>
              <option>SSS 3 Science</option>
              <option>JSS 2A</option>
            </select>
            <select style={{ height: '36px', borderRadius: '9999px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none' }}>
              <option>2nd Term 2025/26</option>
              <option>1st Term 2025/26</option>
            </select>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['Student', 'Class', 'Term', 'Maths', 'English', 'Chemistry', 'Physics', 'Biology', 'Total', 'Grade', 'Position', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '10.5px', fontWeight: 600, color: '#7a7a7a', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.filter(r => r.student.toLowerCase().includes(search.toLowerCase())).map((r, i, arr) => (
                  <tr key={r.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f8f8f8' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{r.student}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#3a3a3c' }}>{r.class}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: '#7a7a7a' }}>{r.term}</td>
                    {[r.maths, r.english, r.chemistry, r.physics, r.biology].map((score, j) => (
                      <td key={j} style={{ padding: '12px 14px', fontSize: '13px', fontWeight: score >= 80 ? 600 : 400, color: score === 0 ? '#d0d0d5' : score >= 80 ? '#0066cc' : score >= 60 ? '#1d1d1f' : '#ff3b30', textAlign: 'center' }}>
                        {score === 0 ? '—' : score}
                      </td>
                    ))}
                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 700, color: '#1d1d1f', textAlign: 'center' }}>{r.total}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: r.grade === 'A' ? '#d1fae5' : '#dbeafe', color: r.grade === 'A' ? '#065f46' : '#1e40af' }}>{r.grade}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#3a3a3c', textAlign: 'center' }}>{r.position}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '9999px', background: r.status === 'Published' ? '#d1fae5' : '#fef3c7', color: r.status === 'Published' ? '#065f46' : '#92400e' }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                        <button style={{ fontSize: '12px', color: '#ff3b30', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'Class Analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classPerformance.map(cls => (
            <div key={cls.class} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '4px' }}>{cls.class}</div>
                  <div style={{ fontSize: '12px', color: '#7a7a7a' }}>{cls.students} students</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#7a7a7a', marginBottom: '2px' }}>Class Average</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#0066cc', letterSpacing: '-0.5px' }}>{cls.avg}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#7a7a7a', marginBottom: '2px' }}>Highest Score</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#34c759', letterSpacing: '-0.5px' }}>{cls.highest}%</div>
                </div>
                <div style={{ width: '200px' }}>
                  <div style={{ background: '#f0f0f0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${cls.avg}%`, height: '100%', background: '#0066cc', borderRadius: '9999px' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Report Cards' && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FileText size={26} color="#0066cc" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>Generate Report Cards</div>
          <div style={{ fontSize: '13.5px', color: '#7a7a7a', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Select a class and term to automatically generate PDF report cards for all students.
          </div>
          <button style={{ padding: '10px 24px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#fff', fontWeight: 500 }}>
            Generate Report Cards
          </button>
        </div>
      )}
    </div>
  );
}
