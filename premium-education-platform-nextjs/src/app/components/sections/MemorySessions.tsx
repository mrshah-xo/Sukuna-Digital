'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Video, FileText, Plus, Search, Filter, Calendar, Award, Building2, Users, BookOpen, Camera, Play, Upload, X, ChevronDown, Star, Clock, Tag } from 'lucide-react';

const memories = [
  { id: 1, title: 'Annual Sports Meet 2026', category: 'School Events', date: '2026-05-15', year: 2026, description: 'Inter-house athletics competition with record-breaking performances', coverImage: '🏃', photos: 45, videos: 8, tags: ['Sports', 'Competition', 'Annual'], featured: true },
  { id: 2, title: 'Science Exhibition Winners', category: 'Academic Achievements', date: '2026-04-20', year: 2026, description: 'Students showcase innovative projects in district-level competition', coverImage: '🔬', photos: 32, videos: 4, tags: ['Science', 'Awards', 'Innovation'], featured: true },
  { id: 3, title: 'Cultural Day Celebration', category: 'School Events', date: '2026-03-10', year: 2026, description: 'Celebrating diversity with traditional performances and exhibitions', coverImage: '🎭', photos: 67, videos: 12, tags: ['Culture', 'Performance', 'Celebration'], featured: false },
  { id: 4, title: 'Mathematics Olympiad Champions', category: 'Academic Achievements', date: '2026-02-28', year: 2026, description: 'SSS 3 students win gold in state-level mathematics competition', coverImage: '🏆', photos: 18, videos: 2, tags: ['Mathematics', 'Competition', 'Gold'], featured: true },
  { id: 5, title: 'School 25th Anniversary', category: 'Historical Records', date: '2025-11-15', year: 2025, description: 'Silver jubilee celebrations with alumni gathering and commemorative events', coverImage: '🎉', photos: 89, videos: 15, tags: ['Anniversary', 'Alumni', 'Milestone'], featured: true },
  { id: 6, title: 'Dr. Amara Okonkwo Alumni Visit', category: 'Alumni Highlights', date: '2025-09-12', year: 2025, description: 'Distinguished alumnus, renowned surgeon, shares career journey with students', coverImage: '👨‍⚕️', photos: 24, videos: 3, tags: ['Alumni', 'Inspiration', 'Medicine'], featured: false },
  { id: 7, title: 'Debate Competition Victory', category: 'Academic Achievements', date: '2025-08-05', year: 2025, description: 'School debate team wins regional championship for third consecutive year', coverImage: '🎤', photos: 15, videos: 5, tags: ['Debate', 'Championship', 'Oratory'], featured: false },
  { id: 8, title: 'School Founding Day 2000', category: 'Historical Records', date: '2000-09-01', year: 2000, description: 'Archival photographs from the school\'s inauguration ceremony', coverImage: '📜', photos: 12, videos: 0, tags: ['History', 'Founding', 'Archive'], featured: false },
];

const categories = [
  { name: 'School Events', icon: Building2, color: '#0066cc', count: 34, description: 'Annual functions, Sports day, Cultural programs, Celebrations' },
  { name: 'Academic Achievements', icon: Award, color: '#34c759', count: 28, description: 'Top students, Competitions, Awards, Scholarships' },
  { name: 'Historical Records', icon: BookOpen, color: '#5856d6', count: 15, description: 'School milestones, Old photographs, Institutional history' },
  { name: 'Alumni Highlights', icon: Users, color: '#ff9500', count: 22, description: 'Successful alumni, Alumni visits, Alumni achievements' },
];

const stats = [
  { label: 'Total Memories', value: '847', icon: Camera, color: '#0066cc' },
  { label: 'Academic Achievements', value: '186', icon: Award, color: '#34c759' },
  { label: 'School Events', value: '324', icon: Building2, color: '#ff9500' },
  { label: 'Historical Records', value: '127', icon: BookOpen, color: '#5856d6' },
  { label: 'Alumni Highlights', value: '210', icon: Users, color: '#007aff' },
];

const timeline = [
  { year: 2026, title: 'Annual Sports Meet', description: 'Record-breaking athletic performances', month: 'May' },
  { year: 2026, title: 'Science Exhibition', description: 'District-level innovation showcase', month: 'Apr' },
  { year: 2025, title: 'School 25th Anniversary', description: 'Silver jubilee celebrations', month: 'Nov' },
  { year: 2024, title: 'New Library Inauguration', description: 'State-of-the-art learning facility', month: 'Mar' },
  { year: 2023, title: 'National Quiz Winners', description: 'First place in national competition', month: 'Sep' },
];

export function MemorySessions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = memories.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesYear = selectedYear === 'All' || m.year.toString() === selectedYear;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesYear && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

  const years = ['All', ...Array.from(new Set(memories.map(m => m.year.toString()))).sort((a, b) => Number(b) - Number(a))];

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Memories</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Preserve and organize the school's important moments and records</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={13} strokeWidth={2.5} /> Add Memory
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={s.color} strokeWidth={2} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.6px', marginBottom: '2px' }}>{s.value}</div>
              <div style={{ fontSize: '11.5px', color: '#7a7a7a' }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Memory Categories */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>Memory Categories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  background: selectedCategory === cat.name ? `${cat.color}08` : '#ffffff',
                  border: `1px solid ${selectedCategory === cat.name ? cat.color : '#e0e0e0'}`,
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={cat.color} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{cat.name}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '8px', lineHeight: '1.4' }}>{cat.description}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: cat.color }}>{cat.count} memories</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: '28px', background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '18px' }}>Memory Timeline</h3>
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: '#e0e0e0' }} />
          {timeline.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: idx < timeline.length - 1 ? '20px' : '0' }}>
              <div style={{ position: 'absolute', left: '-32px', width: '14px', height: '14px', borderRadius: '50%', background: '#0066cc', border: '3px solid #ffffff', boxShadow: '0 0 0 1px #e0e0e0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#0066cc' }}>{item.year}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px' }}>{item.month}</span>
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#7a7a7a' }}>{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={14} color="#7a7a7a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search memories by title, tags, or event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', paddingLeft: '38px', paddingRight: '14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 32px 0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%237a7a7a\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ height: '38px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 32px 0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%237a7a7a\' stroke-width=\'1.5\' stroke-linecap=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button
          onClick={() => { setSelectedCategory('All'); setSelectedYear('All'); setSearchQuery(''); setSortBy('newest'); }}
          style={{ height: '38px', padding: '0 16px', borderRadius: '10px', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#7a7a7a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <X size={13} /> Clear
        </button>
      </div>

      {/* Memory Gallery */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f' }}>Memory Gallery</h3>
          <span style={{ fontSize: '12px', color: '#7a7a7a' }}>{sorted.length} {sorted.length === 1 ? 'memory' : 'memories'} found</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {sorted.map(memory => (
            <div
              key={memory.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,102,204,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'relative', background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ea 100%)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '64px' }}>{memory.coverImage}</span>
                {memory.featured && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff9500', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={11} color="#fff" fill="#fff" />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff' }}>Featured</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.1px' }}>{memory.title}</div>
                <div style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '10px', lineHeight: '1.4' }}>{memory.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#0066cc', background: '#0066cc15', padding: '2px 8px', borderRadius: '6px' }}>{memory.category}</span>
                  <span style={{ fontSize: '11px', color: '#7a7a7a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Calendar size={10} /> {new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: '11.5px', color: '#5a5a5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ImageIcon size={12} /> {memory.photos} photos
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#5a5a5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Video size={12} /> {memory.videos} videos
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {memory.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '10px', color: '#7a7a7a', background: '#f5f5f7', padding: '2px 6px', borderRadius: '4px' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <>
          <div
            onClick={() => setShowAddModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '20px', width: '540px', maxHeight: '90vh', overflowY: 'auto', zIndex: 1001, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f', margin: 0 }}>Add New Memory</h3>
              <button onClick={() => setShowAddModal(false)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#f5f5f7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#7a7a7a" />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>MEMORY TITLE</label>
                <input placeholder="e.g. Annual Sports Meet 2026" style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>DESCRIPTION</label>
                <textarea placeholder="Share details about this memory..." style={{ width: '100%', height: '80px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '12px 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>CATEGORY</label>
                  <select style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
                    <option>School Events</option>
                    <option>Academic Achievements</option>
                    <option>Historical Records</option>
                    <option>Alumni Highlights</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>EVENT DATE</label>
                  <input type="date" style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>UPLOAD FILES</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div style={{ border: '2px dashed #e0e0e0', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#fafafa' }}>
                    <ImageIcon size={20} color="#7a7a7a" />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#7a7a7a' }}>Photos</span>
                  </div>
                  <div style={{ border: '2px dashed #e0e0e0', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#fafafa' }}>
                    <Video size={20} color="#7a7a7a" />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#7a7a7a' }}>Videos</span>
                  </div>
                  <div style={{ border: '2px dashed #e0e0e0', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#fafafa' }}>
                    <FileText size={20} color="#7a7a7a" />
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#7a7a7a' }}>Documents</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#5a5a5e', display: 'block', marginBottom: '6px', letterSpacing: '0.2px' }}>TAGS (COMMA SEPARATED)</label>
                <input placeholder="e.g. Sports, Competition, Annual" style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #e0e0e0', padding: '0 14px', fontSize: '13px', color: '#1d1d1f', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500 }}>Save Draft</button>
                <button style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#0066cc', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500 }}>Publish Memory</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
