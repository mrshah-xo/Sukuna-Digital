import React, { useState } from 'react';
import { Heart, MessageCircle, Star, Pin, Flag, Trash2, Ban, Shield, TrendingUp, Users, MoreHorizontal } from 'lucide-react';

const posts = [
  { id: 1, author: 'Amara Okafor', role: 'Teacher', avatar: 'AO', avatarBg: '#0066cc', time: '10m ago', content: 'Congratulations to SSS 3 Science class for their outstanding performance in today\'s Chemistry practical! You all showed exceptional understanding of organic reactions. Keep it up! 🧪', likes: 89, comments: 14, stars: 12, pinned: true, featured: true, reported: false },
  { id: 2, author: 'Chidera Nwachukwu', role: 'Student', avatar: 'CN', avatarBg: '#34c759', time: '25m ago', content: 'Anyone else excited about the upcoming Science Exhibition? Our group is working on a solar-powered water purification system. We\'ve been at it for 3 weeks now!', likes: 45, comments: 23, stars: 8, pinned: false, featured: false, reported: false },
  { id: 3, author: 'School Admin', role: 'Admin', avatar: 'SA', avatarBg: '#1d1d1f', time: '1h ago', content: '📢 REMINDER: End of term examinations begin June 10th. All students are advised to begin revision immediately. Good luck!', likes: 312, comments: 42, stars: 56, pinned: true, featured: false, reported: false },
  { id: 4, author: 'Tunde Bakare', role: 'Student', avatar: 'TB', avatarBg: '#ff9500', time: '2h ago', content: 'Just uploaded photos from our Annual Sports Meet to Memories. The app makes it so easy to preserve our school moments. Really loved reliving those memories!', likes: 28, comments: 9, stars: 4, pinned: false, featured: false, reported: true },
  { id: 5, author: 'Emmanuel Adeyemi', role: 'Teacher', avatar: 'EA', avatarBg: '#5856d6', time: '3h ago', content: 'New research paper uploaded to the Research Hub: "Impact of Technology on Secondary Education in Nigeria (2020–2025)". SSS 3 students, this is required reading for your Research project.', likes: 67, comments: 31, stars: 22, pinned: false, featured: true, reported: false },
];

const trendingTopics = ['#ExamPrep2026', '#ScienceExhibition', '#MemorySession', '#Chemistry', '#ResearchHub'];

const roleColors: Record<string, string> = { Teacher: '#0066cc', Student: '#34c759', Admin: '#5856d6' };

export function SukunaBook() {
  const [activeFilter, setActiveFilter] = useState('All Posts');
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filters = ['All Posts', 'Pinned', 'Featured', 'Reported', 'Teacher Posts', 'Student Posts'];

  const filtered = posts.filter(p => {
    if (activeFilter === 'All Posts') return true;
    if (activeFilter === 'Pinned') return p.pinned;
    if (activeFilter === 'Featured') return p.featured;
    if (activeFilter === 'Reported') return p.reported;
    if (activeFilter === 'Teacher Posts') return p.role === 'Teacher' || p.role === 'Admin';
    if (activeFilter === 'Student Posts') return p.role === 'Student';
    return true;
  });

  return (
    <div style={{ padding: '28px 32px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Sukuna Book</h2>
            <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Moderate content, manage posts, and track community engagement</p>
          </div>
          <button style={{ padding: '7px 18px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500 }}>
            Create Official Post
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                fontSize: '12.5px', fontWeight: 500,
                background: activeFilter === f ? '#1d1d1f' : '#f5f5f7',
                color: activeFilter === f ? '#fff' : '#3a3a3c',
              }}
            >
              {f}
              {f === 'Reported' && <span style={{ marginLeft: '4px', background: '#ff3b30', color: '#fff', borderRadius: '9999px', padding: '0 5px', fontSize: '10px', fontWeight: 700 }}>1</span>}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(post => (
            <div
              key={post.id}
              style={{
                background: '#ffffff',
                border: post.reported ? '1px solid #fca5a5' : '1px solid #e0e0e0',
                borderRadius: '16px',
                padding: '18px 20px',
                position: 'relative',
              }}
            >
              {post.reported && (
                <div style={{ position: 'absolute', top: '0', right: '0', background: '#ff3b30', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '0 16px 0 8px', letterSpacing: '0.5px' }}>
                  REPORTED
                </div>
              )}
              {post.pinned && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', fontSize: '11px', fontWeight: 600, color: '#0066cc' }}>
                  <Pin size={11} strokeWidth={2.5} /> Pinned by Admin
                </div>
              )}
              {post.featured && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px', fontSize: '11px', fontWeight: 600, color: '#ff9500' }}>
                  <Star size={11} strokeWidth={2.5} fill="#ff9500" /> Featured Post
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `${post.avatarBg}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: post.avatarBg, flexShrink: 0 }}>
                  {post.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{post.author}</span>
                    <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '9999px', background: `${roleColors[post.role]}18`, color: roleColors[post.role] }}>
                      {post.role}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#7a7a7a', marginLeft: 'auto' }}>{post.time}</span>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', borderRadius: '6px', display: 'flex', color: '#7a7a7a' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f0f0f0')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === post.id && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpenMenu(null)} />
                          <div style={{ position: 'absolute', right: 0, top: '28px', width: '170px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '6px', zIndex: 10 }}>
                            {[
                              { icon: Pin, label: post.pinned ? 'Unpin Post' : 'Pin Post', color: '#0066cc' },
                              { icon: Star, label: post.featured ? 'Unfeature' : 'Feature Post', color: '#ff9500' },
                              { icon: Shield, label: 'Mute Author', color: '#5856d6' },
                              { icon: Ban, label: 'Suspend User', color: '#ff3b30' },
                              { icon: Trash2, label: 'Delete Post', color: '#ff3b30' },
                            ].map(a => (
                              <button key={a.label} onClick={() => setOpenMenu(null)} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '7px', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', color: a.color }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >
                                <a.icon size={13} color={a.color} strokeWidth={1.75} />
                                {a.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '13.5px', color: '#3a3a3c', lineHeight: 1.55, margin: 0, letterSpacing: '-0.05px' }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: '18px', marginTop: '12px' }}>
                    {[
                      { icon: Heart, count: post.likes, color: '#ff3b30' },
                      { icon: MessageCircle, count: post.comments, color: '#0066cc' },
                      { icon: Star, count: post.stars, color: '#ff9500' },
                    ].map((action, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#7a7a7a', fontWeight: 500 }}>
                        <action.icon size={13} color={action.color} strokeWidth={1.75} />
                        {action.count}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} color="#0066cc" />
            Engagement Metrics
          </div>
          {[['Total Posts', '1,243'], ['Total Comments', '8,921'], ['Active Authors', '892'], ['Posts Today', '47'], ['Reports Pending', '1']].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '12.5px', color: '#5a5a5e' }}>{label}</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1d1d1f' }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '12px' }}>Trending Topics</div>
          {trendingTopics.map((tag, i) => (
            <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: i < trendingTopics.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#b0b0b8', minWidth: '16px' }}>#{i + 1}</span>
              <span style={{ fontSize: '13px', color: '#0066cc', fontWeight: 500 }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
