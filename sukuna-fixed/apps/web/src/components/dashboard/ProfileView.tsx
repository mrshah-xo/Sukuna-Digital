"use client";
import { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle, Award, Star, BookOpen, Calendar, Download,
  Play, Heart, Bookmark, MapPin, Mail, Droplets, Users,
  ChevronRight, GraduationCap, Trophy, Phone,
  MessageCircle, Share2,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProfile } from '@/contexts/ProfileContext';

const sf  = '"SF Pro Text","Inter",system-ui,-apple-system,sans-serif';
const sfD = '"SF Pro Display","Inter",system-ui,-apple-system,sans-serif';

const CARD: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #ebebeb',
  borderRadius: '18px',
};

type Tab = 'overview' | 'academics' | 'achievements' | 'personal' | 'fees' | 'contributions';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',       label: 'Overview'       },
  { id: 'academics',      label: 'Academics'      },
  { id: 'achievements',   label: 'Achievements'   },
  { id: 'personal',       label: 'Personal'       },
  { id: 'fees',           label: 'Fees'           },
  { id: 'contributions',  label: 'Contributions'  },
];

const VIDEOS = [
  { title: 'Annual Day Highlights', duration: '4:32', views: '1.2K', date: 'Apr 2026', thumb: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=300&q=80' },
  { title: "Principal's Message",   duration: '3:15', views: '890',  date: 'Mar 2026', thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&q=80' },
  { title: 'Sports Championship',   duration: '6:48', views: '2.1K', date: 'Feb 2026', thumb: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&q=80' },
  { title: 'Science Exhibition',    duration: '5:20', views: '740',  date: 'Jan 2026', thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&q=80' },
];

const TEACHERS = [
  { name: 'Mr. Patel',  subject: 'Mathematics',    hours: 'Mon–Wed 2–4pm',  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { name: 'Mrs. Singh', subject: 'Science',         hours: 'Tue–Thu 1–3pm',  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { name: 'Mr. Sharma', subject: 'English',         hours: 'Mon–Fri 11–12pm',avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { name: 'Ms. Rai',    subject: 'Social Studies',  hours: 'Wed–Fri 3–5pm',  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
];

const CLASSMATES = [
  { name: 'Priya',  online: true,  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { name: 'Amit',   online: true,  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
  { name: 'Sneha',  online: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { name: 'Rohan',  online: true,  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { name: 'Nisha',  online: false, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
  { name: 'Karan',  online: true,  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' },
];

const TIMELINE = [
  { icon: '🥇', title: 'Gold Medal – Science Fair',   date: 'April 2026',    desc: 'Won first place at the district-level science exhibition.' },
  { icon: '🏆', title: 'Best Attendance Award',        date: 'March 2026',    desc: '100% attendance for the entire second semester.' },
  { icon: '📝', title: 'Quiz Champion',                date: 'February 2026', desc: 'Won the inter-school mathematics olympiad.' },
  { icon: '⚽', title: 'Football Captain',             date: 'January 2026',  desc: 'Led the school team to the Kathmandu Zone championship.' },
  { icon: '🎭', title: 'Student Council President',    date: 'December 2025', desc: 'Elected Student Council President for Academic Year 2026.' },
];

const CERTIFICATES = [
  { title: 'Excellence in Mathematics', date: 'April 2026',    issuer: 'District Education Board'   },
  { title: 'Sports Champion Certificate',date: 'March 2026',    issuer: 'Sukuna School'              },
  { title: 'Science Fair Winner',        date: 'February 2026', issuer: 'Nepal Science Foundation'   },
  { title: 'Perfect Attendance',         date: 'January 2026',  issuer: 'Sukuna Secondary School'    },
];

export default function ProfileView() {
  const { profileData } = useProfile();
  const [activeTab, setActiveTab]     = useState<Tab>('overview');
  const [feedLikes, setFeedLikes]     = useState<Set<number>>(new Set());
  const [contribCat, setContribCat]   = useState<'Posts'|'Photos'|'Videos'|'Resources'|'Questions'>('Posts');

  const toggleLike = (id: number) =>
    setFeedLikes(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });

  return (
    <div style={{ backgroundColor: '#f5f5f7', fontFamily: sf, minHeight: '100%' }}>

      {/* ── Profile Identity Card ── */}
      <div className="px-4 md:px-8 pt-6 pb-0">
        <div style={{ ...CARD, padding: '20px 20px 16px' }}>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={profileData.profilePicture}
                alt={profileData.name}
                className="rounded-full object-cover"
                style={{ width: '72px', height: '72px', border: '3px solid #f0f0f0' }}
              />
              <span
                className="absolute bottom-0.5 right-0.5 size-3 rounded-full"
                style={{ backgroundColor: '#34C759', border: '2px solid #fff' }}
              />
            </div>

            {/* Identity text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 style={{ fontFamily: sfD, fontSize: '20px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.374px', lineHeight: 1.2 }}>
                  {profileData.name}
                </h1>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EBF5FF', fontSize: '10px', fontWeight: 600, color: '#0066cc' }}>
                  <CheckCircle size={9} />Verified
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#6e6e73', marginTop: '2px' }}>
                {profileData.class}&nbsp;·&nbsp;Roll {profileData.rollNo}
              </p>
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '1px', letterSpacing: '-0.12px' }}>
                ID: {profileData.studentId}
              </p>
            </div>
          </div>

          {/* ── 3 Core Metrics ── */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
            {[
              { value: `${profileData.attendance}%`, label: 'Attendance', color: '#0066cc' },
              { value: String(profileData.gpa),       label: 'GPA',        color: '#34C759' },
              { value: String(profileData.starPoints), label: 'Star Points',color: '#FF9F0A' },
            ].map(m => (
              <div key={m.label} className="flex flex-col items-center py-2">
                <span style={{ fontFamily: sfD, fontSize: '22px', fontWeight: 700, color: m.color, lineHeight: 1, letterSpacing: '-0.5px' }}>
                  {m.value}
                </span>
                <span style={{ fontSize: '11px', color: '#6e6e73', marginTop: '3px' }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section Tab Nav ── */}
      <div
        className="sticky z-20 px-4 md:px-8 py-3 mt-4"
        style={{ top: 0, backgroundColor: 'rgba(245,245,247,0.94)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid #e5e5ea' }}
      >
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 transition-all duration-150"
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? '#ffffff' : '#3d3d3f',
                backgroundColor: activeTab === tab.id ? '#0066cc' : 'transparent',
                border: activeTab === tab.id ? 'none' : '1px solid #dedede',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="px-4 md:px-8 py-5 space-y-4 pb-10">

        {/* ════ OVERVIEW ════ */}
        {activeTab === 'overview' && (
          <>
            {/* School Videos — horizontal scroll */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>School Videos</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {VIDEOS.map((v, i) => (
                  <div key={i} className="flex-shrink-0" style={{ width: '160px', ...CARD, overflow: 'hidden' }}>
                    <div className="relative" style={{ height: '92px' }}>
                      <Image src={v.thumb} alt={v.title} fill sizes="160px" className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.22)' }}>
                        <div className="flex items-center justify-center rounded-full" style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)' }}>
                          <Play size={12} style={{ color: '#fff', marginLeft: '1px' }} />
                        </div>
                      </div>
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.55)', fontSize: '10px', color: '#fff', fontWeight: 600 }}>{v.duration}</span>
                    </div>
                    <div className="p-2.5">
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', lineHeight: 1.3 }} className="line-clamp-2">{v.title}</p>
                      <p style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{v.views} · {v.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity Feed */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>Recent Activity</h2>
              {[
                { id: 1, title: 'Science Exhibition Project', body: "Our team's solar energy project won first place at the district science fair! Grateful to Mrs. Singh for her guidance.", img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80', likes: 48, comments: 14, date: 'April 12, 2026' },
                { id: 2, title: 'Football Tournament Victory', body: "We did it! Sukuna School wins the Kathmandu Zone Football Championship 2026! Huge thanks to Coach Thapa.", img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', likes: 92, comments: 27, date: 'March 28, 2026' },
              ].map(post => (
                <div key={post.id} style={{ ...CARD, marginBottom: '10px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '160px' }}>
                    <Image src={post.img} alt={post.title} fill sizes="100vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p style={{ fontFamily: sfD, fontSize: '15px', fontWeight: 600, color: '#1d1d1f' }}>{post.title}</p>
                    <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '4px', lineHeight: 1.5 }}>{post.body}</p>
                    <p style={{ fontSize: '11px', color: '#aaa', marginTop: '5px' }}>{post.date}</p>
                    <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: '1px solid #f5f5f5' }}>
                      <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 transition-all" style={{ color: feedLikes.has(post.id) ? '#EF4444' : '#6e6e73' }}>
                        <Heart size={16} style={{ fill: feedLikes.has(post.id) ? '#EF4444' : 'none', transition: 'fill 0.15s' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{post.likes + (feedLikes.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-1.5" style={{ color: '#6e6e73' }}>
                        <MessageCircle size={16} /><span style={{ fontSize: '13px', fontWeight: 500 }}>{post.comments}</span>
                      </button>
                      <button style={{ color: '#6e6e73' }}><Bookmark size={16} /></button>
                      <button className="ml-auto" style={{ color: '#6e6e73' }}><Share2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* ════ ACADEMICS ════ */}
        {activeTab === 'academics' && (
          <>
            {/* Subject Performance */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>Subject Performance</h2>
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics',   score: 92, grade: 'A+', color: '#0066cc' },
                  { subject: 'Science',        score: 88, grade: 'A',  color: '#34C759' },
                  { subject: 'English',        score: 85, grade: 'A',  color: '#AF52DE' },
                  { subject: 'Social Studies', score: 90, grade: 'A+', color: '#FF9F0A' },
                  { subject: 'Nepali',         score: 87, grade: 'A',  color: '#FF375F' },
                ].map(s => (
                  <div key={s.subject}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ fontSize: '14px', color: '#1d1d1f' }}>{s.subject}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '13px', fontWeight: 600, color: s.color }}>{s.score}%</span>
                        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 600, backgroundColor: s.color + '18', color: s.color }}>{s.grade}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f0f0f0' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic metrics — horizontal scroll on mobile */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>Academic Overview</h2>
              <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {[
                  { label: 'Attendance',   value: `${profileData.attendance}%`, sub: 'This semester', color: '#0066cc', icon: Calendar },
                  { label: 'Assignments',  value: '18/20',                      sub: 'Completed',     color: '#34C759', icon: BookOpen },
                  { label: 'House Points', value: '247',                         sub: 'Phoenix House', color: '#FF375F', icon: Trophy  },
                  { label: 'Projects',     value: '8',                           sub: 'Completed',     color: '#AF52DE', icon: GraduationCap },
                  { label: 'Behavior',     value: '94/100',                      sub: 'Excellent',     color: '#FF9F0A', icon: Star   },
                ].map(({ label, value, sub, color, icon: Icon }) => (
                  <div key={label} className="flex-shrink-0 p-4 rounded-2xl" style={{ minWidth: '130px', backgroundColor: color + '0D', border: `1px solid ${color}22` }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon size={13} style={{ color }} />
                      <span style={{ fontSize: '11px', color: '#6e6e73', fontWeight: 500 }}>{label}</span>
                    </div>
                    <p style={{ fontFamily: sfD, fontSize: '20px', fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: '10px', color: '#6e6e73', marginTop: '3px' }}>{sub}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Exams */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '12px' }}>Upcoming Exams</h2>
              <div className="space-y-3">
                {[
                  { subject: 'Mathematics', date: 'July 28', month: 'Jul', type: 'Unit Test',  chapters: 'Ch 5–8'       },
                  { subject: 'Science',     date: 'July 30', month: 'Jul', type: 'Practical',  chapters: 'Lab Report'   },
                  { subject: 'English',     date: 'Aug 4',   month: 'Aug', type: 'Terminal',   chapters: 'Full Syllabus'},
                ].map((exam, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f8f8fa' }}>
                    <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl" style={{ width: '48px', height: '48px', backgroundColor: '#0066cc14' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0066cc', lineHeight: 1 }}>{(exam.date.split(' ')[1] || '').replace(',', '')}</span>
                      <span style={{ fontSize: '10px', color: '#6e6e73' }}>{(exam.date.split(' ')[0] || '').slice(0, 3)}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f' }}>{exam.subject}</p>
                      <p style={{ fontSize: '12px', color: '#6e6e73' }}>{exam.type} · {exam.chapters}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════ ACHIEVEMENTS ════ */}
        {activeTab === 'achievements' && (
          <>
            {/* Star Points summary — horizontal scroll */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Star Points</h2>
                <span style={{ fontFamily: sfD, fontSize: '20px', fontWeight: 700, color: '#FF9F0A' }}>{profileData.starPoints}</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {[
                  { reason: 'Academic Excellence', pts: '+100', date: 'Mar 2026' },
                  { reason: 'Perfect Attendance',  pts: '+50',  date: 'Apr 2026' },
                  { reason: 'Best Project Award',  pts: '+75',  date: 'Feb 2026' },
                  { reason: 'Sports Champion',     pts: '+60',  date: 'Jan 2026' },
                  { reason: 'Community Service',   pts: '+40',  date: 'Dec 2025' },
                ].map((item, i) => (
                  <div key={i} className="flex-shrink-0 p-3 rounded-2xl" style={{ minWidth: '140px', backgroundColor: '#FFFBEB', border: '1px solid #FF9F0A22' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#FF9F0A' }}>{item.pts}</p>
                    <p style={{ fontSize: '12px', color: '#1d1d1f', marginTop: '2px', lineHeight: 1.3 }}>{item.reason}</p>
                    <p style={{ fontSize: '10px', color: '#6e6e73', marginTop: '3px' }}>{item.date}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '18px' }}>Achievement Timeline</h2>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px" style={{ backgroundColor: '#ebebeb' }} />
                <div className="space-y-5">
                  {TIMELINE.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center rounded-full z-10" style={{ width: '40px', height: '40px', background: '#fff', border: '1.5px solid #ebebeb', fontSize: '17px' }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 pb-1">
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{item.title}</p>
                        <p style={{ fontSize: '11px', color: '#0066cc', fontWeight: 500, marginTop: '1px' }}>{item.date}</p>
                        <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '3px', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Certificates */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>Certificates</h2>
              <div className="space-y-2.5">
                {CERTIFICATES.map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-4" style={{ ...CARD }}>
                    <div className="flex-shrink-0 flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', backgroundColor: '#FF9F0A18' }}>
                      <Award size={20} style={{ color: '#FF9F0A' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{cert.title}</p>
                      <p style={{ fontSize: '11px', color: '#6e6e73', marginTop: '1px' }}>{cert.issuer} · {cert.date}</p>
                    </div>
                    <button className="flex-shrink-0 flex items-center justify-center size-8 rounded-full" style={{ backgroundColor: '#0066cc12', color: '#0066cc' }}>
                      <Download size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════ PERSONAL ════ */}
        {activeTab === 'personal' && (
          <>
            {/* Personal info — scrollable rows */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>Personal Information</h2>
              <div className="space-y-0">
                {[
                  { icon: Calendar,     label: 'Date of Birth',  value: profileData.dateOfBirth },
                  { icon: Droplets,     label: 'Blood Group',    value: profileData.bloodGroup  },
                  { icon: Mail,         label: 'Email',          value: profileData.email       },
                  { icon: Phone,        label: 'Phone',          value: profileData.phone       },
                  { icon: MapPin,       label: 'Address',        value: profileData.address     },
                  { icon: GraduationCap,label: 'Admission No.',  value: profileData.studentId   },
                  { icon: Users,        label: 'House',          value: 'Phoenix House'         },
                ].map((info, i, arr) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="flex items-center gap-3 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f5f5f7' : 'none' }}>
                      <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f5f5f7' }}>
                        <Icon size={14} style={{ color: '#0066cc' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '11px', color: '#6e6e73' }}>{info.label}</p>
                        <p style={{ fontSize: '14px', color: '#1d1d1f', wordBreak: 'break-word' }}>{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Parent info */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>Parent Information</h2>
              {[
                { role: 'Father / Guardian', name: 'Mr. Suresh Sharma', phone: '+977 9841234568' },
                { role: 'Emergency Contact',  name: 'Mrs. Anita Sharma', phone: '+977 9841234569' },
              ].map((parent, i) => (
                <div key={i} className="flex items-center gap-3 pb-4 mb-1" style={{ borderBottom: i === 0 ? '1px solid #f5f5f7' : 'none' }}>
                  <div className="size-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0066cc12' }}>
                    <Users size={18} style={{ color: '#0066cc' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '11px', color: '#6e6e73' }}>{parent.role}</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{parent.name}</p>
                    <p style={{ fontSize: '12px', color: '#6e6e73' }}>{parent.phone}</p>
                  </div>
                  <button className="flex items-center justify-center rounded-full" style={{ width: '36px', height: '36px', backgroundColor: '#34C75914', color: '#34C759' }}>
                    <Phone size={15} />
                  </button>
                </div>
              ))}
            </section>

            {/* Teachers — horizontal scroll */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>My Teachers</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {TEACHERS.map((t, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 p-4" style={{ ...CARD, width: '128px' }}>
                    <ImageWithFallback src={t.avatar} alt={t.name} className="size-12 rounded-full object-cover" style={{ border: '2px solid #ebebeb' }} />
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', textAlign: 'center' }}>{t.name}</p>
                    <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: '#0066cc12', color: '#0066cc', fontSize: '10px', fontWeight: 500 }}>{t.subject}</span>
                    <p style={{ fontSize: '10px', color: '#6e6e73', textAlign: 'center', lineHeight: 1.3 }}>{t.hours}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Classmates */}
            <section style={{ ...CARD, padding: '18px' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>Classmates</h2>
                <button className="flex items-center gap-1" style={{ fontSize: '12px', color: '#0066cc' }}>
                  See All <ChevronRight size={13} />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {CLASSMATES.map((c, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <div className="relative">
                      <ImageWithFallback src={c.avatar} alt={c.name} className="size-12 rounded-full object-cover" style={{ border: '2px solid #ebebeb' }} />
                      {c.online && <span className="absolute bottom-0 right-0 size-3 rounded-full" style={{ backgroundColor: '#34C759', border: '2px solid #fff' }} />}
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 500, color: '#1d1d1f' }}>{c.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════ CONTRIBUTIONS ════ */}
        {activeTab === 'contributions' && (
          <>
            {/* Contribution Stats Grid */}
            <section>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Contribution Points', value: '3,850', icon: '⭐', color: '#FF9F0A' },
                  { label: 'Stars Earned',         value: '847',   icon: '🌟', color: '#FF9F0A' },
                  { label: 'Helpful Posts',        value: '32',    icon: '👍', color: '#34C759' },
                  { label: 'Teacher Recognition', value: '8',     icon: '🏅', color: '#0066cc' },
                ].map((s, i) => (
                  <div key={i} style={{ ...CARD, padding: '16px' }}>
                    <span style={{ fontSize: '22px' }}>{s.icon}</span>
                    <p style={{ fontFamily: sfD, fontSize: '22px', fontWeight: 700, color: s.color, marginTop: '6px', letterSpacing: '-0.5px' }}>{s.value}</p>
                    <p style={{ fontSize: '11px', color: '#6e6e73', marginTop: '2px' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Approved Posts — full width */}
              <div style={{ ...CARD, padding: '16px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6e6e73' }}>Approved Posts</p>
                  <p style={{ fontFamily: sfD, fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.5px' }}>143</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#34C75914' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#34C759' }}>✓ All Approved</span>
                </div>
              </div>
            </section>

            {/* Content Category Filter */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>My Contributions</h2>
              {/* Category tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden mb-3" style={{ scrollbarWidth: 'none' }}>
                {(['Posts','Photos','Videos','Resources','Questions'] as const).map(cat => (
                  <button key={cat} onClick={() => setContribCat(cat)}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{ backgroundColor: contribCat === cat ? '#0066cc' : '#f5f5f7', color: contribCat === cat ? '#fff' : '#3a3a3c' }}>
                    {cat}
                  </button>
                ))}
              </div>
              {/* Contribution cards */}
              <div className="space-y-3">
                {[
                  { title: 'How does photosynthesis work?',    stars: 47, status: 'Approved', type: 'Questions' },
                  { title: 'Science Fair Project – Solar Car', stars: 83, status: 'Approved', type: 'Photos'    },
                  { title: 'Integration Tips – Quick Guide',   stars: 62, status: 'Approved', type: 'Resources' },
                  { title: 'Annual Day Highlights Reel',       stars: 120, status: 'Approved', type: 'Videos'   },
                  { title: 'Newton\'s Laws – Simple Explained',stars: 55, status: 'Approved', type: 'Posts'     },
                  { title: 'Organic Chemistry Mind Map',       stars: 38, status: 'Approved', type: 'Resources' },
                  { title: 'Football Match Day Photos',        stars: 96, status: 'Approved', type: 'Photos'    },
                  { title: 'What is the Pascal principle?',   stars: 29, status: 'Approved', type: 'Questions' },
                ].filter(c => contribCat === 'Posts' || c.type === contribCat).map((c, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ ...CARD, padding: '14px 16px' }}>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span style={{ fontSize: '11px', color: '#6e6e73' }}>{c.type}</span>
                        <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 600, color: '#34C759', backgroundColor: '#34C75914' }}>{c.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={13} fill="#FF9F0A" color="#FF9F0A" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF9F0A' }}>{c.stars}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Teacher Recognition Cards */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>Teacher Recognition</h2>
              <div className="space-y-3">
                {[
                  { teacher: 'Mrs. Shrestha', subject: 'Mathematics', badge: 'Excellent Contribution', date: 'Jun 12, 2026', color: '#FF9F0A', bg: '#FF9F0A14' },
                  { teacher: 'Mr. Poudel',    subject: 'Physics',     badge: 'Most Helpful',           date: 'May 28, 2026', color: '#0066cc', bg: '#0066cc12' },
                  { teacher: 'Ms. Tamang',    subject: 'English',     badge: 'Best Question',          date: 'May 10, 2026', color: '#34C759', bg: '#34C75914' },
                  { teacher: 'Mr. Karki',     subject: 'Chemistry',   badge: 'Resource Champion',      date: 'Apr 22, 2026', color: '#BF5AF2', bg: '#BF5AF214' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ ...CARD, padding: '14px 16px' }}>
                    <div className="flex-shrink-0 flex items-center justify-center rounded-full" style={{ width: '44px', height: '44px', backgroundColor: r.bg }}>
                      <span style={{ fontSize: '20px' }}>🏅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>{r.teacher}</p>
                      <p style={{ fontSize: '11px', color: '#6e6e73' }}>{r.subject}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded-lg" style={{ fontSize: '10px', fontWeight: 600, color: r.color, backgroundColor: r.bg }}>{r.badge}</span>
                      <p style={{ fontSize: '10px', color: '#aeaeb2', marginTop: '3px' }}>{r.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contribution History */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>History</h2>
              <div style={{ ...CARD, padding: '0 16px' }}>
                {[
                  { action: 'Post approved by moderator', detail: 'Physics doubt resolved',      pts: '+25', date: 'Jun 18' },
                  { action: 'Resource downloaded 50 times', detail: 'Chemistry notes Vol. 2',    pts: '+50', date: 'Jun 15' },
                  { action: 'Answer marked helpful',        detail: 'Math integration query',    pts: '+15', date: 'Jun 12' },
                  { action: 'Photo post liked 100+',        detail: 'Science fair memories',     pts: '+10', date: 'Jun 8'  },
                  { action: 'Question of the week',         detail: 'Thermodynamics concepts',   pts: '+100', date: 'Jun 5' },
                  { action: 'Video tutorial approved',      detail: 'Algebra tricks for Class 10', pts: '+75', date: 'May 30' },
                ].map((h, i, arr) => (
                  <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f5f5f7' : 'none' }}>
                    <div className="flex-shrink-0 size-2 rounded-full" style={{ backgroundColor: '#0066cc' }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', color: '#1d1d1f', fontWeight: 500 }}>{h.action}</p>
                      <p style={{ fontSize: '11px', color: '#6e6e73' }}>{h.detail}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#34C759' }}>{h.pts}</p>
                      <p style={{ fontSize: '10px', color: '#aeaeb2' }}>{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ════ FEES ════ */}
        {activeTab === 'fees' && (
          <>
            {/* Summary */}
            <section style={{ ...CARD, padding: '20px', background: 'linear-gradient(135deg,#0066cc 0%,#0077ed 100%)', border: 'none' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Total Fees Paid (2025–26)</p>
              <p style={{ fontFamily: sfD, fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1, marginTop: '4px' }}>NPR 1,80,000</p>
              <div className="flex gap-6 mt-3">
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>Last Payment</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>May 1, 2026</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>Status</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#34C759' }}>Up to Date</p>
                </div>
              </div>
            </section>

            {/* Payment History — scrollable fee cards */}
            <section>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px' }}>Payment History</h2>
              <div style={{ ...CARD, padding: '0 18px' }}>
                {[
                  { month: 'July 2026',     amount: 'NPR 15,000', status: 'Upcoming', sub: 'Due Jul 31' },
                  { month: 'June 2026',     amount: 'NPR 15,000', status: 'Paid',     sub: 'Jun 1'      },
                  { month: 'May 2026',      amount: 'NPR 15,000', status: 'Paid',     sub: 'May 1'      },
                  { month: 'April 2026',    amount: 'NPR 15,000', status: 'Paid',     sub: 'Apr 1'      },
                  { month: 'March 2026',    amount: 'NPR 15,000', status: 'Paid',     sub: 'Mar 1'      },
                  { month: 'February 2026', amount: 'NPR 15,000', status: 'Paid',     sub: 'Feb 1'      },
                  { month: 'January 2026',  amount: 'NPR 15,000', status: 'Paid',     sub: 'Jan 1'      },
                ].map((fee, i, arr) => (
                  <div key={i} className="flex items-center justify-between py-3.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f5f5f7' : 'none' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#1d1d1f' }}>{fee.month}</p>
                      <p style={{ fontSize: '11px', color: '#6e6e73', marginTop: '1px' }}>{fee.status === 'Paid' ? `Paid on ${fee.sub}` : fee.sub}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{fee.amount}</p>
                      <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 600, backgroundColor: fee.status === 'Paid' ? '#34C75914' : '#FF9F0A14', color: fee.status === 'Paid' ? '#34C759' : '#FF9F0A' }}>
                        {fee.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Fee Structure */}
            <section style={{ ...CARD, padding: '18px' }}>
              <h2 style={{ fontFamily: sfD, fontSize: '16px', fontWeight: 600, color: '#1d1d1f', marginBottom: '12px' }}>Fee Structure</h2>
              {[
                { item: 'Tuition Fee',   amount: 'NPR 12,000 / mo' },
                { item: 'Transport Fee', amount: 'NPR 1,500 / mo'  },
                { item: 'Library Fee',   amount: 'NPR 500 / mo'    },
                { item: 'Activity Fee',  amount: 'NPR 500 / mo'    },
                { item: 'Annual Fee',    amount: 'NPR 10,000 / yr' },
              ].map((row, i, arr) => (
                <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < arr.length - 1 ? '1px solid #f5f5f7' : 'none' }}>
                  <span style={{ fontSize: '13px', color: '#1d1d1f' }}>{row.item}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc' }}>{row.amount}</span>
                </div>
              ))}
            </section>
          </>
        )}

      </div>
    </div>
  );
}
