"use client";

import { useState, useRef } from 'react';
import { MessageCircle, Heart, Share2, Flag, Award, Image, FileText, HelpCircle, Paperclip, X, Send, Link, Upload, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type UploadType = 'photo' | 'notes' | 'question' | 'resource';

const UPLOAD_META: Record<UploadType, { title: string; accept: string; icon: React.ReactNode; color: string }> = {
  photo:    { title: 'Upload Photo',    accept: 'image/*',       icon: <Image size={28} />,      color: '#22C55E' },
  notes:    { title: 'Upload Note',     accept: '.pdf,.doc,.docx,.txt', icon: <FileText size={28} />,  color: '#2563EB' },
  question: { title: 'Upload Question', accept: '*',             icon: <HelpCircle size={28} />, color: '#F59E0B' },
  resource: { title: 'Upload Resource', accept: '*',             icon: <Paperclip size={28} />,  color: '#9333EA' },
};

const REPORT_REASONS = [
  'Inappropriate content',
  'Misinformation / false information',
  'Spam or irrelevant',
  'Harassment or bullying',
  'Plagiarism',
  'Other',
];

const SAMPLE_COMMENTS: Record<number, { id: number; author: string; avatar: string; text: string; time: string; likes: number }[]> = {
  1: [
    { id: 1, author: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: 'Thank you sir! Will focus on those chapters.', time: '1h ago', likes: 4 },
    { id: 2, author: 'Amit Kumar', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', text: 'Is the pattern for all sections or only A?', time: '45m ago', likes: 2 },
  ],
  2: [
    { id: 1, author: 'Mr. Patel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', text: 'Great question! Check chapter 4 for derivation steps.', time: '3h ago', likes: 6 },
    { id: 2, author: 'Sneha Rai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', text: "I can share my notes — I'll DM you.", time: '2h ago', likes: 1 },
  ],
  3: [
    { id: 1, author: 'Rohan Thapa', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', text: "Ma'am the session was amazing! Learned a lot.", time: '4h ago', likes: 8 },
  ],
  4: [
    { id: 1, author: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: "I'll share my notes with you after class.", time: '23h ago', likes: 3 },
    { id: 2, author: 'Mrs. Singh', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', text: 'Please visit me during office hours for a copy.', time: '20h ago', likes: 5 },
  ],
};

const OVERLAY = {
  position: 'fixed' as const,
  inset: 0,
  zIndex: 100,
  backgroundColor: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'flex-end' as const,
  justifyContent: 'center',
};

const SHEET = {
  backgroundColor: '#ffffff',
  borderRadius: '28px 28px 0 0',
  width: '100%',
  maxWidth: '640px',
  maxHeight: '90vh',
  overflowY: 'auto' as const,
  padding: '24px',
};

const PILL_BTN = {
  padding: '11px 22px',
  borderRadius: '9999px',
  fontSize: '15px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
} as React.CSSProperties;

export default function SukunaBook() {
  const [likedPosts, setLikedPosts]   = useState<Set<number>>(new Set());
  const [poppingPosts, setPoppingPosts] = useState<Set<number>>(new Set());

  // Modal state
  const [uploadModal, setUploadModal]   = useState<UploadType | null>(null);
  const [reportPostId, setReportPostId] = useState<number | null>(null);
  const [sharePostId, setSharePostId]   = useState<number | null>(null);
  const [commentsPostId, setCommentsPostId] = useState<number | null>(null);

  // Upload modal state
  const [uploadFile, setUploadFile]     = useState<File | null>(null);
  const [uploadTitle, setUploadTitle]   = useState('');
  const [uploadDesc, setUploadDesc]     = useState('');
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Report modal state
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc]     = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Share state
  const [copied, setCopied] = useState(false);

  // Comments state
  const [commentText, setCommentText]   = useState('');
  const [commentLikes, setCommentLikes] = useState<Set<number>>(new Set());
  const [localComments, setLocalComments] = useState<Record<number, { id: number; author: string; avatar: string; text: string; time: string; likes: number }[]>>(SAMPLE_COMMENTS);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const n = new Set(prev);
      if (n.has(postId)) { n.delete(postId); } else { n.add(postId); }
      return n;
    });
    setPoppingPosts(prev => { const n = new Set(prev); n.add(postId); return n; });
    setTimeout(() => setPoppingPosts(prev => { const n = new Set(prev); n.delete(postId); return n; }), 400);
  };

  const closeUpload = () => { setUploadModal(null); setUploadFile(null); setUploadTitle(''); setUploadDesc(''); setUploading(false); setUploadProgress(0); };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleUpload = () => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 20 + 8;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(closeUpload, 600); }
      setUploadProgress(Math.min(p, 100));
    }, 180);
  };

  const handleReportSubmit = () => { setReportSubmitted(true); setTimeout(() => { setReportPostId(null); setReportReason(''); setReportDesc(''); setReportSubmitted(false); }, 1800); };

  const handleCopyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleSendComment = (postId: number) => {
    if (!commentText.trim()) return;
    const newC = { id: Date.now(), author: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', text: replyTo ? `@reply: ${commentText.trim()}` : commentText.trim(), time: 'just now', likes: 0 };
    setLocalComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newC] }));
    setCommentText(''); setReplyTo(null);
  };

  const posts = [
    { id: 1, author: 'Mr. Patel', role: 'Mathematics Teacher', isTeacher: true, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', content: "Important: Mid-term exam pattern has been updated. Please check the new syllabus distribution. Focus on chapters 5-8 for better preparation.", timestamp: '2 hours ago', likes: 34, comments: 12 },
    { id: 2, author: 'Priya Sharma', role: 'Class 10-A', isTeacher: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', content: "Can someone explain the concept of quadratic equations? I'm having trouble understanding the formula derivation.", timestamp: '4 hours ago', likes: 15, comments: 8, stars: 5 },
    { id: 3, author: 'Mrs. Singh', role: 'Science Teacher', isTeacher: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', content: "Great work on today's practical session! Remember to submit your lab reports by Friday. Keep up the excellent work!", timestamp: '5 hours ago', likes: 42, comments: 18 },
    { id: 4, author: 'Amit Kumar', role: 'Class 10-B', isTeacher: false, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', content: "Does anyone have notes from yesterday's English literature class? I was absent due to medical reasons.", timestamp: '1 day ago', likes: 8, comments: 6, stars: 3 },
  ];

  const activeUpload = uploadModal ? UPLOAD_META[uploadModal] : null;
  const activePostComments = commentsPostId !== null ? (localComments[commentsPostId] || []) : [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Sukuna Book</h1>
        <p className="text-[#64748B]">Academic discussions and announcements</p>
      </div>

      {/* Create Post */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <ImageWithFallback src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="You" className="size-10 md:size-12 rounded-full object-cover" />
          <input type="text" placeholder="What's on your mind about academics?" className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none hover:bg-gray-200 transition-colors text-sm md:text-base cursor-pointer" />
        </div>
        <div className="h-px bg-gray-200 my-3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button onClick={() => setUploadModal('photo')} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
            <Image className="text-[#22C55E]" size={20} />
            <span className="text-sm font-medium text-[#64748B]">Photo</span>
          </button>
          <button onClick={() => setUploadModal('notes')} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
            <FileText className="text-[#2563EB]" size={20} />
            <span className="text-sm font-medium text-[#64748B]">Notes</span>
          </button>
          <button onClick={() => setUploadModal('question')} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
            <HelpCircle className="text-[#F59E0B]" size={20} />
            <span className="text-sm font-medium text-[#64748B]">Question</span>
          </button>
          <button onClick={() => setUploadModal('resource')} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
            <Paperclip className="text-[#9333EA]" size={20} />
            <span className="text-sm font-medium text-[#64748B]">Resource</span>
          </button>
        </div>

        {/* Quick shortcut chips */}
        <div className="h-px bg-gray-200 mt-3 mb-3" />
        <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {[
            { label: '📢 Notice', color: '#EFF6FF', text: '#2563EB' },
            { label: '🏆 Sports', color: '#FFFBEB', text: '#D97706' },
            { label: '📊 Results', color: '#F0FDF4', text: '#16A34A' },
            { label: '🚨 Emergency', color: '#FFF1F2', text: '#E11D48' },
          ].map(chip => (
            <button
              key={chip.label}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: chip.color, color: chip.text }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <ImageWithFallback src={post.avatar} alt={post.author} className="size-10 md:size-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#0F172A] text-sm md:text-base">{post.author}</h3>
                  {post.isTeacher && <span className="px-2 py-1 bg-[#2563EB] text-white text-xs rounded-full font-medium">Teacher</span>}
                </div>
                <p className="text-xs md:text-sm text-[#64748B]">{post.role}</p>
                <p className="text-xs text-[#64748B] mt-1">{post.timestamp}</p>
              </div>
              <button onClick={() => setReportPostId(post.id)} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <Flag size={16} className="text-[#64748B] md:w-[18px] md:h-[18px]" />
              </button>
            </div>

            <p className="text-[#0F172A] mb-4 leading-relaxed text-sm md:text-base">{post.content}</p>

            <div className="flex items-center gap-3 md:gap-6 pt-4 border-t border-gray-100 flex-wrap">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 md:gap-2 transition-colors" style={{ color: likedPosts.has(post.id) ? '#EF4444' : '#64748B' }}>
                <Heart size={16} className="md:w-[18px] md:h-[18px]" style={{ fill: likedPosts.has(post.id) ? '#EF4444' : 'none', transition: 'fill 0.15s ease, transform 0.15s ease', transform: poppingPosts.has(post.id) ? 'scale(1.55)' : 'scale(1)' }} />
                <span className="text-xs md:text-sm font-medium">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
              </button>
              <button onClick={() => setCommentsPostId(post.id)} className="flex items-center gap-1.5 md:gap-2 text-[#64748B] hover:text-[#2563EB] transition-colors">
                <MessageCircle size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="text-xs md:text-sm font-medium">{(localComments[post.id]?.length ?? post.comments)}</span>
              </button>
              {post.stars && (
                <div className="flex items-center gap-1.5 md:gap-2 text-[#F59E0B]">
                  <Award size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-sm font-medium">{post.stars} Stars</span>
                </div>
              )}
              <button onClick={() => setSharePostId(post.id)} className="flex items-center gap-1.5 md:gap-2 text-[#64748B] hover:text-[#2563EB] transition-colors ml-auto">
                <Share2 size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── UPLOAD MODAL ── */}
      {uploadModal && activeUpload && (
        <div style={OVERLAY} onClick={closeUpload}>
          <div style={SHEET} onClick={e => e.stopPropagation()}>
            {/* Handle bar */}
            <div className="flex justify-center mb-5"><div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#e5e5ea' }} /></div>

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0F172A]">{activeUpload.title}</h2>
              <button onClick={closeUpload} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-[#64748B]" /></button>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 mb-5 cursor-pointer transition-all"
              style={{ border: `2px dashed ${dragging ? activeUpload.color : '#d1d5db'}`, borderRadius: 16, padding: '32px 16px', backgroundColor: dragging ? activeUpload.color + '0D' : '#f9fafb' }}
            >
              <div style={{ color: activeUpload.color }}>{activeUpload.icon}</div>
              {uploadFile
                ? <p className="text-sm font-medium text-[#0F172A] text-center">{uploadFile.name}</p>
                : <>
                    <p className="text-sm font-medium text-[#0F172A]">Drag & drop your file here</p>
                    <p className="text-xs text-[#64748B]">or click to browse</p>
                  </>
              }
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ backgroundColor: activeUpload.color + '18', color: activeUpload.color }}
                onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
              >
                Browse Files
              </button>
              <input ref={fileRef} type="file" accept={activeUpload.accept} onChange={handleFileInput} className="hidden" />
            </div>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Title (optional)"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
                style={{ focusRingColor: activeUpload.color } as React.CSSProperties}
              />
              <textarea
                placeholder="Description (optional)"
                value={uploadDesc}
                onChange={e => setUploadDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-[#64748B] mb-1">
                  <span>Uploading…</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%`, backgroundColor: activeUpload.color }} />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={closeUpload} style={{ ...PILL_BTN, flex: 1, backgroundColor: '#f5f5f7', color: '#1d1d1f' }}>Cancel</button>
              <button onClick={handleUpload} disabled={uploading} style={{ ...PILL_BTN, flex: 1, backgroundColor: activeUpload.color, color: '#fff', opacity: uploading ? 0.7 : 1 }}>
                <span className="flex items-center justify-center gap-2"><Upload size={16} />{uploading ? 'Uploading…' : 'Upload'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT MODAL ── */}
      {reportPostId !== null && (
        <div style={OVERLAY} onClick={() => setReportPostId(null)}>
          <div style={SHEET} onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-5"><div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#e5e5ea' }} /></div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0F172A]">Report Post</h2>
              <button onClick={() => setReportPostId(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-[#64748B]" /></button>
            </div>

            {reportSubmitted
              ? <div className="flex flex-col items-center py-8 gap-3">
                  <div className="size-14 rounded-full bg-green-50 flex items-center justify-center text-2xl">✓</div>
                  <p className="font-medium text-[#0F172A]">Report Submitted</p>
                  <p className="text-sm text-[#64748B] text-center">Thank you. Our team will review this post.</p>
                </div>
              : <>
                  <p className="text-sm font-medium text-[#0F172A] mb-3">Select a reason</p>
                  <div className="space-y-2 mb-4">
                    {REPORT_REASONS.map(r => (
                      <button
                        key={r}
                        onClick={() => setReportReason(r)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                        style={{ backgroundColor: reportReason === r ? '#EFF6FF' : '#f9fafb', color: reportReason === r ? '#2563EB' : '#0F172A', border: `1px solid ${reportReason === r ? '#2563EB' : 'transparent'}`, fontWeight: reportReason === r ? 600 : 400 }}
                      >
                        {r}
                        {reportReason === r && <div className="size-4 rounded-full bg-[#2563EB]" />}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Additional details (optional)"
                    value={reportDesc}
                    onChange={e => setReportDesc(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none mb-4"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setReportPostId(null)} style={{ ...PILL_BTN, flex: 1, backgroundColor: '#f5f5f7', color: '#1d1d1f' }}>Cancel</button>
                    <button onClick={handleReportSubmit} disabled={!reportReason} style={{ ...PILL_BTN, flex: 1, backgroundColor: '#EF4444', color: '#fff', opacity: reportReason ? 1 : 0.4 }}>Submit Report</button>
                  </div>
                </>
            }
          </div>
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {sharePostId !== null && (
        <div style={OVERLAY} onClick={() => setSharePostId(null)}>
          <div style={SHEET} onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-5"><div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#e5e5ea' }} /></div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#0F172A]">Share Post</h2>
              <button onClick={() => setSharePostId(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-[#64748B]" /></button>
            </div>

            <div className="space-y-2 mb-5">
              <button onClick={handleCopyLink} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 transition-all">
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center"><Link size={18} className="text-[#64748B]" /></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0F172A]">{copied ? 'Link Copied!' : 'Copy Link'}</p>
                  <p className="text-xs text-[#64748B]">Copy post link to clipboard</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 transition-all">
                <div className="size-10 rounded-full bg-[#EFF6FF] flex items-center justify-center"><Share2 size={18} className="text-[#2563EB]" /></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0F172A]">Share in Sukuna Book</p>
                  <p className="text-xs text-[#64748B]">Repost to your feed</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 transition-all">
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronDown size={18} className="text-[#64748B]" /></div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#0F172A]">Share Externally</p>
                  <p className="text-xs text-[#64748B]">Send via other apps</p>
                </div>
              </button>
            </div>

            <button onClick={() => setSharePostId(null)} style={{ ...PILL_BTN, width: '100%', backgroundColor: '#f5f5f7', color: '#1d1d1f' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── COMMENTS MODAL ── */}
      {commentsPostId !== null && (
        <div style={OVERLAY} onClick={() => setCommentsPostId(null)}>
          <div style={{ ...SHEET, paddingBottom: '80px' }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4"><div style={{ width: 40, height: 4, borderRadius: 9999, backgroundColor: '#e5e5ea' }} /></div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Comments <span className="text-sm font-normal text-[#64748B]">({activePostComments.length})</span></h2>
              <button onClick={() => setCommentsPostId(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={18} className="text-[#64748B]" /></button>
            </div>

            {/* Comments list */}
            <div className="space-y-4 mb-4">
              {activePostComments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <ImageWithFallback src={c.avatar} alt={c.author} className="size-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                      <p className="text-sm font-semibold text-[#0F172A]">{c.author}</p>
                      <p className="text-sm text-[#0F172A] mt-0.5">{c.text}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 pl-2">
                      <span className="text-xs text-[#64748B]">{c.time}</span>
                      <button
                        onClick={() => setCommentLikes(prev => {
                          const n = new Set(prev);
                          if (n.has(c.id)) { n.delete(c.id); } else { n.add(c.id); }
                          return n;
                        })}
                        className="text-xs font-medium transition-colors"
                        style={{ color: commentLikes.has(c.id) ? '#EF4444' : '#64748B' }}
                      >
                        {commentLikes.has(c.id) ? '❤️' : '♡'} {c.likes + (commentLikes.has(c.id) ? 1 : 0)}
                      </button>
                      <button onClick={() => setReplyTo(c.id)} className="text-xs font-medium text-[#64748B] hover:text-[#2563EB] transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {activePostComments.length === 0 && (
                <p className="text-sm text-[#64748B] text-center py-6">No comments yet. Be the first!</p>
              )}
            </div>

            {/* Reply indicator */}
            {replyTo && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 mb-2">
                <span className="text-xs text-[#2563EB]">Replying to comment #{replyTo}</span>
                <button onClick={() => setReplyTo(null)}><X size={13} className="text-[#2563EB]" /></button>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <ImageWithFallback src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="You" className="size-9 rounded-full object-cover flex-shrink-0" />
              <input
                type="text"
                placeholder="Add a comment…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendComment(commentsPostId)}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
              <button
                onClick={() => handleSendComment(commentsPostId)}
                disabled={!commentText.trim()}
                className="size-9 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: commentText.trim() ? '#2563EB' : '#e5e5ea' }}
              >
                <Send size={14} style={{ color: commentText.trim() ? '#fff' : '#94a3b8', marginLeft: '1px' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
