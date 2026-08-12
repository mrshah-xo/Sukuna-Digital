import { useState } from 'react';
import {
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  User, Shield, Bell, Palette, Globe, HelpCircle, Info,
  FileText, Lock, Smartphone, Search, X,
} from 'lucide-react';
import { useProfile } from '../App';
import ProfileView from './ProfileView';

const sf  = '"SF Pro Text","Inter",system-ui,-apple-system,sans-serif';
const sfD = '"SF Pro Display","Inter",system-ui,-apple-system,sans-serif';

type SubPage = 'help' | 'about' | 'terms' | 'privacy' | 'profile' | null;

// ─── Help & Support ─────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    category: 'Getting Started',
    icon: '🚀',
    items: [
      { q: 'How do I log in to Sukuna?', a: 'Open the app and enter your school-assigned Student ID and password. If you forget your password, tap "Forgot Password" and follow the steps.' },
      { q: 'Where do I find my Student ID?', a: 'Your Student ID is printed on your school ID card and admission receipt. It follows the format SS followed by the year and a number (e.g. SS2024001).' },
      { q: 'Can I use Sukuna on multiple devices?', a: 'Yes. Your account syncs across devices. Simply log in with the same credentials on any device.' },
    ],
  },
  {
    category: 'Account & Login',
    icon: '🔐',
    items: [
      { q: 'How do I change my password?', a: 'Go to Settings → Account → Security → Change Password. Enter your current password, then your new one twice.' },
      { q: 'My account is locked. What do I do?', a: 'Contact your class teacher or school admin to reset your account. Accounts lock after 5 consecutive failed login attempts.' },
      { q: 'Can I update my profile picture?', a: 'Yes. In Settings → Account → Profile, tap your avatar and choose a new photo from your gallery.' },
    ],
  },
  {
    category: 'Using Sukuna',
    icon: '📱',
    items: [
      { q: 'How do I post on SukunaBook?', a: 'Tap the upload buttons at the top of SukunaBook to share photos, notes, questions, or resources with your school community.' },
      { q: 'What is Notes Mandir?', a: 'Notes Mandir is the school resource library. You can download verified study notes, past papers, e-books, and practice sets shared by teachers and top students.' },
      { q: 'How does the bus tracker work?', a: 'The Bus Track feature shows real-time GPS location of school buses. Location data is collected only while buses are on school routes.' },
      { q: 'How do I earn Contribution Points?', a: 'Points are awarded for approved posts, helpful answers, uploaded resources, teacher recognition, and reaching star milestones on your content.' },
    ],
  },
  {
    category: 'Safety',
    icon: '🛡️',
    items: [
      { q: 'How do I report inappropriate content?', a: 'Tap the three-dot menu on any post and select "Report". Choose a reason and optionally add a description. Reports are reviewed within 24 hours.' },
      { q: 'Is my personal data shared with others?', a: 'No. Personal data is only visible to school staff and yourself. See Privacy Policy for full details.' },
      { q: 'Who can see my profile?', a: 'By default, your profile is visible to students in your school. Academic info visibility can be toggled in Settings → Privacy.' },
    ],
  },
];

function HelpView({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const filtered = FAQ_DATA.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => !query || item.q.toLowerCase().includes(query.toLowerCase()) || item.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-full" style={{ backgroundColor: '#f5f5f7', fontFamily: sf }}>
      <button onClick={onBack} className="flex items-center gap-1 mb-6" style={{ color: '#007AFF', fontSize: '17px', fontWeight: 400 }}>
        <ChevronLeft size={20} strokeWidth={2.5} /> Back
      </button>
      <h1 style={{ fontFamily: sfD, fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px', marginBottom: '4px' }}>Help & Support</h1>
      <p style={{ fontSize: '15px', color: '#6e6e73', marginBottom: '20px' }}>Find answers to common questions</p>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aeaeb2' }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search questions…"
          style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: '12px', border: '1px solid #e0e0e0', backgroundColor: '#fff', fontSize: '15px', fontFamily: sf, outline: 'none', color: '#1d1d1f', boxSizing: 'border-box' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aeaeb2', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* FAQ sections */}
      <div className="space-y-4">
        {filtered.map(cat => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.category}</p>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', overflow: 'hidden' }}>
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                const isOpen = openItem === key;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenItem(isOpen ? null : key)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: isOpen || i < cat.items.length - 1 ? '1px solid #f5f5f7' : 'none', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: i < cat.items.length - 1 ? '#f5f5f7' : 'transparent' }}
                    >
                      <span style={{ fontSize: '14px', color: '#1d1d1f', fontWeight: 500, flex: 1, paddingRight: '12px', fontFamily: sf }}>{item.q}</span>
                      {isOpen ? <ChevronUp size={16} color="#aeaeb2" /> : <ChevronDown size={16} color="#aeaeb2" />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '12px 16px 16px', backgroundColor: '#f9f9fb' }}>
                        <p style={{ fontSize: '14px', color: '#3a3a3c', lineHeight: 1.55, fontFamily: sf }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Support contact */}
      <div style={{ marginTop: '28px', backgroundColor: '#0066cc12', borderRadius: '14px', padding: '18px', border: '1px solid #0066cc22' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0066cc', marginBottom: '6px' }}>Still need help?</p>
        <p style={{ fontSize: '13px', color: '#3a3a3c', lineHeight: 1.5 }}>Contact your class teacher or reach school admin at <strong>support@sukunaschool.edu.np</strong>. We typically respond within one school day.</p>
      </div>
    </div>
  );
}

// ─── About Sukuna ────────────────────────────────────────────────────────────
function AboutView({ onBack }: { onBack: () => void }) {
  const features = [
    { icon: '📰', name: 'SukunaBook',     desc: 'Share posts, photos, questions, and resources with your school community. Earn stars for helpful contributions.' },
    { icon: '📚', name: 'Notes Mandir',   desc: 'A curated library of verified study materials — notes, past papers, e-books, and practice sets for every class.' },
    { icon: '🚌', name: 'Bus Track',      desc: 'Real-time GPS tracking of school buses so you always know when your bus will arrive.' },
    { icon: '📊', name: 'Evaluation',     desc: 'View your term-wise academic performance, subject scores, and teacher remarks in one place.' },
    { icon: '📸', name: 'Memory Wall',    desc: 'A beautiful photo wall of school events, sports days, annual days, and class moments.' },
    { icon: '👤', name: 'Profile',        desc: 'Your complete academic identity — grades, achievements, certifications, activity timeline, and fee records.' },
    { icon: '🏛️', name: 'School Library', desc: 'Track issued books, view return dates, and request new books directly from the school library catalog.' },
    { icon: '⭐', name: 'Contributions',  desc: 'Your community impact score — track your approved posts, teacher recognitions, and earned star points.' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-full" style={{ backgroundColor: '#f5f5f7', fontFamily: sf }}>
      <button onClick={onBack} className="flex items-center gap-1 mb-6" style={{ color: '#007AFF', fontSize: '17px', fontWeight: 400 }}>
        <ChevronLeft size={20} strokeWidth={2.5} /> Back
      </button>

      {/* App identity */}
      <div className="flex flex-col items-center text-center mb-8">
        <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg,#0066cc 0%,#0077ed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 8px 24px rgba(0,102,204,0.25)' }}>
          <span style={{ fontSize: '32px' }}>🎓</span>
        </div>
        <h1 style={{ fontFamily: sfD, fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px' }}>Sukuna School App</h1>
        <p style={{ fontSize: '15px', color: '#6e6e73', marginTop: '4px' }}>Version 2.4.1 · Build 2026.08</p>
        <p style={{ fontSize: '14px', color: '#3a3a3c', marginTop: '10px', lineHeight: 1.55, maxWidth: '340px' }}>
          The all-in-one digital companion for Sukuna Secondary School — connecting students, parents, and teachers in one secure platform.
        </p>
      </div>

      {/* Feature cards */}
      <h2 style={{ fontFamily: sfD, fontSize: '18px', fontWeight: 600, color: '#1d1d1f', marginBottom: '14px' }}>What's Inside</h2>
      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', padding: '16px' }}>
            <div className="flex items-start gap-3">
              <span style={{ fontSize: '24px', flexShrink: 0, lineHeight: 1 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '4px' }}>{f.name}</p>
                <p style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Credits */}
      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#aeaeb2' }}>Designed & developed for Sukuna Secondary School, Kathmandu</p>
        <p style={{ fontSize: '12px', color: '#aeaeb2', marginTop: '2px' }}>© 2026 Sukuna Education Systems. All rights reserved.</p>
      </div>
    </div>
  );
}

// ─── Terms & Conditions ───────────────────────────────────────────────────────
const TERMS_SECTIONS = [
  { title: 'Acceptance of Terms',             body: 'By accessing or using the Sukuna School App, you agree to be bound by these Terms and Conditions. If you do not agree, do not use the application.' },
  { title: 'Eligibility',                     body: 'The app is available exclusively to enrolled students, staff, and authorized parents of Sukuna Secondary School. Access is granted by the school administration.' },
  { title: 'User Account Responsibilities',   body: 'You are responsible for maintaining the confidentiality of your login credentials. Do not share your password with others. Report unauthorized access immediately to the school.' },
  { title: 'Acceptable Use',                  body: 'The app must be used for legitimate educational and school-related purposes. Misuse, including harassment, bullying, or sharing inappropriate content, is strictly prohibited.' },
  { title: 'Content Submission',              body: 'Content you post must be accurate, respectful, and relevant. The school reserves the right to remove any content that violates community guidelines without prior notice.' },
  { title: 'Intellectual Property',           body: 'All content, logos, and designs within the app are the intellectual property of Sukuna School or its licensors. You may not reproduce, distribute, or create derivative works without permission.' },
  { title: 'Privacy',                         body: 'Your use of the app is also governed by our Privacy Policy, which describes how we collect and use personal information.' },
  { title: 'Prohibited Activities',           body: 'You may not attempt to reverse-engineer, hack, or exploit the app. Sharing login credentials, scraping data, or using bots is strictly forbidden.' },
  { title: 'Moderation',                      body: 'All posts, notes, and resources go through a moderation process. Content that violates community standards will be removed and repeat violations may result in account suspension.' },
  { title: 'Notification Consent',            body: 'By using the app, you consent to receiving push notifications about school events, announcements, and account activity. You may opt out in Notification Settings.' },
  { title: 'GPS & Location Data',             body: 'GPS tracking is exclusively used for the Bus Track feature to display real-time school bus locations. Location data is not stored after the school day ends.' },
  { title: 'Academic Data',                   body: 'Academic records shown in the app are sourced from the school database. Discrepancies must be reported to the school office, not resolved through the app.' },
  { title: 'Fee Information',                 body: 'Fee records displayed are for reference only. All official fee transactions must go through the school office or official payment gateway.' },
  { title: 'Third-Party Services',            body: 'The app may integrate with third-party services such as map providers. Use of these services is subject to their respective terms of service.' },
  { title: 'Termination',                     body: 'The school may suspend or terminate your access at any time for violations of these terms, graduation, withdrawal, or other administrative reasons.' },
  { title: 'Changes to Terms',                body: 'The school reserves the right to update these terms. Continued use after changes constitutes acceptance of the new terms.' },
  { title: 'Limitation of Liability',         body: 'The school is not liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the app.' },
  { title: 'Disclaimer of Warranties',        body: 'The app is provided "as is." The school makes no warranties, express or implied, regarding the availability, accuracy, or reliability of the service.' },
  { title: 'Governing Law',                   body: 'These terms are governed by the laws of Nepal. Any disputes shall be resolved in the courts of Kathmandu District.' },
  { title: 'Parental Consent',                body: 'Students under 18 require parental consent to use the app. By using the app, parents and guardians acknowledge their consent.' },
  { title: 'Data Retention',                  body: 'Account data is retained for the duration of enrollment. Upon leaving the school, data may be archived for up to 2 years per school policy.' },
  { title: 'Security',                        body: 'We employ industry-standard security measures to protect your data. However, no system is 100% secure and you use the app at your own risk.' },
  { title: 'Contact',                         body: 'For questions regarding these terms, contact the school administration at legal@sukunaschool.edu.np.' },
  { title: 'Entire Agreement',                body: 'These Terms, together with the Privacy Policy, constitute the entire agreement between you and Sukuna School regarding the app.' },
];

function TermsView({ onBack }: { onBack: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-full" style={{ backgroundColor: '#f5f5f7', fontFamily: sf }}>
      <button onClick={onBack} className="flex items-center gap-1 mb-6" style={{ color: '#007AFF', fontSize: '17px', fontWeight: 400 }}>
        <ChevronLeft size={20} strokeWidth={2.5} /> Back
      </button>
      <h1 style={{ fontFamily: sfD, fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px', marginBottom: '4px' }}>Terms & Conditions</h1>
      <div className="flex items-center gap-3 mb-6">
        <span style={{ fontSize: '12px', color: '#6e6e73' }}>Version 3.1</span>
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#aeaeb2', display: 'inline-block' }} />
        <span style={{ fontSize: '12px', color: '#6e6e73' }}>Last updated August 1, 2026</span>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', overflow: 'hidden' }}>
        {TERMS_SECTIONS.map((s, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < TERMS_SECTIONS.length - 1 ? '1px solid #f5f5f7' : 'none', textAlign: 'left' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#aeaeb2', minWidth: '20px', fontFamily: sfD }}>{i + 1}.</span>
                  <span style={{ fontSize: '14px', color: '#1d1d1f', fontWeight: 500, fontFamily: sf }}>{s.title}</span>
                </div>
                {isOpen ? <ChevronUp size={16} color="#aeaeb2" /> : <ChevronDown size={16} color="#aeaeb2" />}
              </button>
              {isOpen && (
                <div style={{ padding: '12px 16px 16px 52px', backgroundColor: '#f9f9fb' }}>
                  <p style={{ fontSize: '13px', color: '#3a3a3c', lineHeight: 1.6, fontFamily: sf }}>{s.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
function PrivacyView({ onBack }: { onBack: () => void }) {
  const sections = [
    {
      icon: '📋',
      title: 'Information We Collect',
      body: 'We collect your name, student ID, class, roll number, date of birth, contact details, academic records, and profile picture. This information is provided by the school at enrollment.',
    },
    {
      icon: '🎯',
      title: 'How We Use Your Information',
      body: 'Your data is used to: display your academic profile, facilitate school communications, enable community features (SukunaBook, Notes Mandir), process fee records, and improve app functionality.',
    },
    {
      icon: '🚌',
      title: 'GPS & Location Data',
      body: 'GPS tracking is used exclusively for the Bus Track feature. Location data is collected from school buses — not from your personal device — only during active school-route hours. No personal location is tracked or stored.',
    },
    {
      icon: '🔒',
      title: 'Data Security',
      body: 'All data is transmitted over encrypted HTTPS connections. We use AES-256 encryption for stored sensitive data. Access is restricted to authorized school staff and the student themselves.',
    },
    {
      icon: '👁️',
      title: 'Who Can See Your Data',
      body: 'School administrators can see your full profile. Teachers see class-relevant academic information. Other students see only your public profile (name, class, posts). Parents can see their ward\'s full profile.',
    },
    {
      icon: '🤝',
      title: 'Third-Party Sharing',
      body: 'We do not sell or share your personal data with third parties for marketing. Map services receive anonymized bus location data only. No other personal data leaves the school ecosystem.',
    },
    {
      icon: '📱',
      title: 'Push Notifications',
      body: 'We may send push notifications for school announcements, event reminders, and account activity. You can manage or disable notifications at any time in Settings → Notifications.',
    },
    {
      icon: '🗑️',
      title: 'Data Retention & Deletion',
      body: 'Your data is retained while you are an enrolled student. Upon leaving, data is archived for up to 2 years per school policy, then permanently deleted. You may request early deletion through the school office.',
    },
    {
      icon: '👶',
      title: 'Children\'s Privacy',
      body: 'Students under 13 require verified parental consent. Parents may review their child\'s data at any time by contacting school administration. We comply with applicable child privacy regulations.',
    },
    {
      icon: '📬',
      title: 'Contact & Queries',
      body: 'For privacy-related concerns, data access requests, or deletion requests, contact our Data Protection Officer at privacy@sukunaschool.edu.np or visit the school office.',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-full" style={{ backgroundColor: '#f5f5f7', fontFamily: sf }}>
      <button onClick={onBack} className="flex items-center gap-1 mb-6" style={{ color: '#007AFF', fontSize: '17px', fontWeight: 400 }}>
        <ChevronLeft size={20} strokeWidth={2.5} /> Back
      </button>
      <h1 style={{ fontFamily: sfD, fontSize: '28px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px', marginBottom: '4px' }}>Privacy Policy</h1>
      <p style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '20px' }}>Last updated August 1, 2026 · Version 3.1</p>

      {/* GPS notice highlight */}
      <div style={{ backgroundColor: '#0066cc12', border: '1px solid #0066cc22', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
        <div className="flex items-start gap-3">
          <span style={{ fontSize: '20px', flexShrink: 0 }}>🚌</span>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', marginBottom: '4px' }}>About GPS Tracking</p>
            <p style={{ fontSize: '13px', color: '#3a3a3c', lineHeight: 1.5 }}>GPS is used <strong>only</strong> for school bus tracking. Your personal device location is never tracked. Bus location data is discarded at end of each school day.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', padding: '18px' }}>
            <div className="flex items-start gap-3">
              <span style={{ fontSize: '22px', flexShrink: 0, lineHeight: 1 }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px' }}>{s.title}</p>
                <p style={{ fontSize: '13px', color: '#6e6e73', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Settings Menu ───────────────────────────────────────────────────────
export default function SettingsView() {
  const { profileData } = useProfile();
  const [subPage, setSubPage] = useState<SubPage>(null);

  if (subPage === 'profile') return <ProfileView />;
  if (subPage === 'help')    return <HelpView    onBack={() => setSubPage(null)} />;
  if (subPage === 'about')   return <AboutView   onBack={() => setSubPage(null)} />;
  if (subPage === 'terms')   return <TermsView   onBack={() => setSubPage(null)} />;
  if (subPage === 'privacy') return <PrivacyView onBack={() => setSubPage(null)} />;

  const SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: <User size={18} />, label: 'Profile',    sub: 'Edit your school profile', color: '#0066cc', bg: '#0066cc12', action: () => setSubPage('profile') },
        { icon: <Shield size={18} />, label: 'Security', sub: 'Password & login settings', color: '#34C759', bg: '#34C75914', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={18} />,    label: 'Notifications', sub: 'Manage alerts & reminders', color: '#FF9F0A', bg: '#FF9F0A14', action: () => {} },
        { icon: <Palette size={18} />, label: 'Appearance',    sub: 'Theme, font size, display',  color: '#BF5AF2', bg: '#BF5AF214', action: () => {} },
        { icon: <Globe size={18} />,   label: 'Language',      sub: 'English (Nepal)',             color: '#30D158', bg: '#30D15814', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={18} />, label: 'Help & Support', sub: 'FAQs & contact school',    color: '#007AFF', bg: '#007AFF14', action: () => setSubPage('help')  },
        { icon: <Info size={18} />,       label: 'About Sukuna',   sub: 'App guide & features',     color: '#5E5CE6', bg: '#5E5CE614', action: () => setSubPage('about') },
      ],
    },
    {
      title: 'Legal',
      items: [
        { icon: <FileText size={18} />, label: 'Terms & Conditions', sub: 'Version 3.1 · Aug 2026', color: '#FF6B6B', bg: '#FF6B6B14', action: () => setSubPage('terms')   },
        { icon: <Lock size={18} />,     label: 'Privacy Policy',     sub: 'How we use your data',   color: '#FF9F0A', bg: '#FF9F0A14', action: () => setSubPage('privacy') },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: <Smartphone size={18} />, label: 'Version',         sub: '2.4.1 (Build 2026.08)',   color: '#6e6e73', bg: '#6e6e7314', action: () => {} },
        { icon: <Info size={18} />,       label: 'System Info',     sub: 'Device & environment',     color: '#6e6e73', bg: '#6e6e7314', action: () => {} },
      ],
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-full" style={{ backgroundColor: '#f5f5f7', fontFamily: sf }}>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: sfD, fontSize: '34px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px', lineHeight: 1.2 }}>Settings</h1>
      </div>

      {/* Profile quick-card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '18px', border: '1px solid #ebebeb', padding: '16px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        onClick={() => setSubPage('profile')}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#fff', fontFamily: sfD }}>{profileData.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f' }}>{profileData.name}</p>
          <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '1px' }}>{profileData.class} · {profileData.studentId}</p>
        </div>
        <ChevronRight size={18} color="#aeaeb2" />
      </div>

      {/* Menu sections */}
      <div className="space-y-6">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', paddingLeft: '4px' }}>{section.title}</p>
            <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', overflow: 'hidden' }}>
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < section.items.length - 1 ? '1px solid #f5f5f7' : 'none', textAlign: 'left' }}
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', backgroundColor: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '15px', color: '#1d1d1f', fontFamily: sf }}>{item.label}</p>
                    <p style={{ fontSize: '12px', color: '#6e6e73', marginTop: '1px', fontFamily: sf }}>{item.sub}</p>
                  </div>
                  <ChevronRight size={16} color="#aeaeb2" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div style={{ marginTop: '32px', marginBottom: '8px' }}>
        <button style={{ width: '100%', padding: '14px', backgroundColor: '#FF3B3014', color: '#FF3B30', border: '1px solid #FF3B3020', borderRadius: '14px', fontSize: '16px', fontWeight: 600, fontFamily: sf, cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
