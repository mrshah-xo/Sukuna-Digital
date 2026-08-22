'use client';

import React, { useState } from 'react';
import { FlaskConical, CheckCircle, Clock, Star, Search, Plus, Eye, Check, X } from 'lucide-react';

const categories = ['All', 'Student Research', 'Teacher Research', 'Science Projects', 'Innovation', 'Academic Papers'];

const research = [
  { id: 1, title: 'Solar-Powered Water Purification System for Rural Communities', author: 'Group A — SSS 3 Science', category: 'Science Projects', date: 'May 26, 2026', status: 'Pending', featured: false, views: 0 },
  { id: 2, title: 'Impact of Technology on Secondary Education in Nigeria (2020–2025)', author: 'Mr. Emmanuel Adeyemi', category: 'Teacher Research', date: 'May 24, 2026', status: 'Approved', featured: true, views: 412 },
  { id: 3, title: 'The Effect of Social Media on Academic Performance in Nigerian Teenagers', author: 'Amara Okafor — SSS 3', category: 'Student Research', date: 'May 20, 2026', status: 'Approved', featured: false, views: 287 },
  { id: 4, title: 'Biodegradable Plastic Alternatives from Cassava Starch', author: 'Group C — SSS 2 Science', category: 'Innovation', date: 'May 18, 2026', status: 'Under Review', featured: false, views: 0 },
  { id: 5, title: 'Pre-Colonial Trade Routes in the Sokoto Caliphate', author: 'Hauwa Bello — SSS 3 Arts', category: 'Academic Papers', date: 'May 15, 2026', status: 'Approved', featured: false, views: 156 },
  { id: 6, title: 'Comparative Analysis of Teaching Methods in STEM Education', author: 'Dr. Yusuf Ibrahim', category: 'Teacher Research', date: 'May 10, 2026', status: 'Approved', featured: true, views: 534 },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Approved: { bg: '#d1fae5', text: '#065f46' },
  Pending: { bg: '#fef3c7', text: '#92400e' },
  'Under Review': { bg: '#dbeafe', text: '#1e40af' },
  Rejected: { bg: '#fee2e2', text: '#991b1b' },
};

export function ResearchHub() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = research.filter(r => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Research Hub</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Review submissions, approve research, and manage the knowledge repository</p>
        </div>
        <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={13} strokeWidth={2.5} /> Submit Research
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Submissions', value: '94', color: '#0066cc' },
          { label: 'Approved', value: '71', color: '#34c759' },
          { label: 'Pending Review', value: '18', color: '#ff9500' },
          { label: 'Featured', value: '8', color: '#5856d6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, letterSpacing: '-0.8px', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12.5px', color: '#7a7a7a' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search research..." style={{ width: '100%', height: '34px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '32px', paddingRight: '12px', fontSize: '12.5px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{ padding: '5px 13px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: activeCategory === cat ? '#1d1d1f' : '#f5f5f7', color: activeCategory === cat ? '#fff' : '#3a3a3c', whiteSpace: 'nowrap' }}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(item => {
          const sc = statusColors[item.status];
          return (
            <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FlaskConical size={17} color="#0066cc" strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.1px', flex: 1, minWidth: '200px' }}>{item.title}</span>
                    {item.featured && (
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#fff7ed', color: '#c2410c', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                        <Star size={9} fill="#c2410c" /> Featured
                      </span>
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 9px', borderRadius: '9999px', background: sc.bg, color: sc.text, flexShrink: 0 }}>{item.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12.5px', color: '#5a5a5e' }}>{item.author}</span>
                    <span style={{ fontSize: '11.5px', padding: '2px 8px', borderRadius: '9999px', background: '#f0f4ff', color: '#0066cc', fontWeight: 500 }}>{item.category}</span>
                    <span style={{ fontSize: '11.5px', color: '#7a7a7a' }}>{item.date}</span>
                    {item.views > 0 && <span style={{ fontSize: '11.5px', color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: '3px' }}><Eye size={11} /> {item.views}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {item.status === 'Pending' || item.status === 'Under Review' ? (
                    <>
                      <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#d1fae5', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> Approve
                      </button>
                      <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#fee2e2', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#991b1b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <X size={12} /> Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3a3a3c', fontWeight: 500 }}>View</button>
                      {!item.featured && (
                        <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#fff7ed', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#c2410c', fontWeight: 500 }}>Feature</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
