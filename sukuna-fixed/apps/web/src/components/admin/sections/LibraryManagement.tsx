'use client';
import React, { useState } from 'react';
import { BookOpen, Download, Upload, Search, Plus, FileText, Video, Archive } from 'lucide-react';

const tabs = ['Books', 'E-books', 'Notes', 'Past Questions', 'Practical Files', 'Learning Materials'];

const books = [
  { id: 1, title: 'New General Mathematics SSS 3', author: 'Murray Macrae', category: 'Mathematics', available: 24, total: 30, issued: 6, type: 'Physical' },
  { id: 2, title: 'Comprehensive Biology for Senior Secondary', author: 'Stone & Coker', category: 'Biology', available: 18, total: 25, issued: 7, type: 'Physical' },
  { id: 3, title: 'Oxford Advanced Learner\'s Dictionary', author: 'Oxford Press', category: 'Reference', available: 12, total: 20, issued: 8, type: 'Physical' },
  { id: 4, title: 'Chemistry for Senior Secondary Schools', author: 'Osei Yaw Ababio', category: 'Chemistry', available: 0, total: 15, issued: 15, type: 'Physical' },
  { id: 5, title: 'Mastering Economics', author: 'Frank', category: 'Economics', available: 21, total: 28, issued: 7, type: 'Physical' },
];

const ebooks = [
  { id: 1, title: 'Introduction to Organic Chemistry', author: 'Dr. Emeka Eze', downloads: 342, size: '12.4 MB', format: 'PDF', subject: 'Chemistry' },
  { id: 2, title: 'Nigerian History — Pre-Colonial Period', author: 'Prof. Aliyu Bello', downloads: 218, size: '8.1 MB', format: 'PDF', subject: 'History' },
  { id: 3, title: 'Principles of Accounting — A Beginner\'s Guide', author: 'Mrs. Ngozi Okafor', downloads: 189, size: '5.3 MB', format: 'PDF', subject: 'Accounting' },
  { id: 4, title: 'Visual Mathematics: Geometry & Trigonometry', author: 'Mr. Tunde Akin', downloads: 411, size: '22.7 MB', format: 'PDF', subject: 'Mathematics' },
];

export function LibraryManagement() {
  const [activeTab, setActiveTab] = useState('Books');
  const [search, setSearch] = useState('');

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Library Management</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Manage physical books, digital resources, and lending records</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={13} /> Upload Resource
          </button>
          <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={13} strokeWidth={2.5} /> Add Book
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Books', value: '1,247', icon: BookOpen, color: '#0066cc' },
          { label: 'Currently Issued', value: '43', icon: FileText, color: '#ff9500' },
          { label: 'Digital Resources', value: '312', icon: Download, color: '#34c759' },
          { label: 'Overdue Returns', value: '8', icon: Archive, color: '#ff3b30' },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={17} color={s.color} strokeWidth={1.75} />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '1px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ padding: '9px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? '#0066cc' : '#7a7a7a', borderBottom: activeTab === t ? '2px solid #0066cc' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '14px', display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            style={{ width: '100%', height: '36px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '34px', paddingRight: '14px', fontSize: '13px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {activeTab === 'Books' && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Title', 'Author', 'Category', 'Available', 'Total', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 600, color: '#7a7a7a', letterSpacing: '0.3px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map((book, i, arr) => (
                <tr key={book.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f8f8f8' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#1d1d1f' }}>{book.title}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '12.5px', color: '#5a5a5e' }}>{book.author}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11.5px', padding: '3px 9px', borderRadius: '9999px', background: '#f0f4ff', color: '#0066cc', fontWeight: 500 }}>{book.category}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: book.available === 0 ? '#ff3b30' : '#1d1d1f' }}>{book.available}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#7a7a7a' }}>{book.total}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, maxWidth: '80px', background: '#f0f0f0', borderRadius: '9999px', height: '6px' }}>
                        <div style={{ width: `${(book.available / book.total) * 100}%`, height: '100%', background: book.available === 0 ? '#ff3b30' : '#34c759', borderRadius: '9999px' }} />
                      </div>
                      <span style={{ fontSize: '11.5px', color: book.available === 0 ? '#ff3b30' : '#7a7a7a' }}>
                        {book.available === 0 ? 'All Issued' : `${book.issued} issued`}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                      <button style={{ fontSize: '12px', color: '#ff3b30', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'E-books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {ebooks.map(ebook => (
            <div key={ebook.id} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '18px 20px', display: 'flex', gap: '14px' }}>
              <div style={{ width: '40px', height: '52px', borderRadius: '6px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #bcd4f7' }}>
                <FileText size={18} color="#0066cc" strokeWidth={1.75} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f', marginBottom: '3px', letterSpacing: '-0.1px' }}>{ebook.title}</div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '10px' }}>{ebook.author}</div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11.5px', padding: '2px 8px', borderRadius: '9999px', background: '#f0f4ff', color: '#0066cc', fontWeight: 500 }}>{ebook.subject}</span>
                  <span style={{ fontSize: '11.5px', color: '#7a7a7a' }}>{ebook.size}</span>
                  <span style={{ fontSize: '11.5px', color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Download size={11} /> {ebook.downloads}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                <button style={{ padding: '5px 12px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500 }}>Edit</button>
                <button style={{ padding: '5px 12px', borderRadius: '8px', background: '#fff0f0', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#ff3b30', fontWeight: 500 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!['Books', 'E-books'].includes(activeTab) && (
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px' }}>No {activeTab} uploaded yet</div>
          <div style={{ fontSize: '13px', color: '#7a7a7a', marginBottom: '18px' }}>Upload your first {activeTab.toLowerCase()} resource to make it available to students.</div>
          <button style={{ padding: '9px 22px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13.5px', color: '#fff', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Upload {activeTab}
          </button>
        </div>
      )}
    </div>
  );
}
