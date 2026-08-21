'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical, Eye } from 'lucide-react';

const categories = ['General', 'Admissions', 'Payments', 'Results', 'Library', 'Attendance', 'Research', 'Account & Login', 'Memories', 'Transport'];

const initialFaqs: Record<string, { id: number; q: string; a: string }[]> = {
  General: [
    { id: 1, q: 'What is the Sukuna School App?', a: 'The Sukuna School App is a comprehensive digital education platform that connects students, teachers, and administrators for a seamless school experience.' },
    { id: 2, q: 'How do I contact school management?', a: 'You can reach school management through the Notice Center or by calling the school office during working hours (8AM–4PM).' },
  ],
  Admissions: [
    { id: 3, q: 'How do I apply for admission?', a: 'Admissions are processed through the school office. Visit the admissions section of the app or contact the admin team for guidance.' },
    { id: 4, q: 'What documents are required for admission?', a: 'Required documents include: birth certificate, previous school report cards, passport photographs, and a completed application form.' },
  ],
  Payments: [
    { id: 5, q: 'How do I pay school fees on the app?', a: 'Go to the Payments section, select your fee category, and follow the payment instructions. You can pay via bank transfer or online payment.' },
    { id: 6, q: 'Can I pay in installments?', a: 'Yes, installment payments are allowed. Contact the bursar\'s office for the installment schedule and approval.' },
  ],
  'Account & Login': [
    { id: 7, q: 'I forgot my password. How do I reset it?', a: 'On the login screen, tap "Forgot Password" and enter your registered phone number. You will receive an OTP to reset your access.' },
  ],
};

export function FAQManager() {
  const [activeCategory, setActiveCategory] = useState('General');
  const [faqs, setFaqs] = useState(initialFaqs);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const currentFaqs = faqs[activeCategory] || [];

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const newFaq = { id: Date.now(), q: newQ, a: newA };
    setFaqs(prev => ({ ...prev, [activeCategory]: [...(prev[activeCategory] || []), newFaq] }));
    setNewQ(''); setNewA(''); setShowAddForm(false);
  };

  const deleteFaq = (id: number) => {
    setFaqs(prev => ({ ...prev, [activeCategory]: (prev[activeCategory] ?? []).filter(f => f.id !== id) }));
  };

  return (
    <div style={{ padding: '28px 32px', display: 'flex', gap: '20px', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
          Categories
        </div>
        {categories.map(cat => {
          const count = (faqs[cat] || []).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAddForm(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px',
                borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#0066cc' : '#3a3a3c',
                fontSize: '13.5px', fontWeight: isActive ? 500 : 400,
                border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f7'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 600, background: isActive ? '#0066cc' : '#e5e5ea', color: isActive ? '#fff' : '#7a7a7a', padding: '1px 6px', borderRadius: '9999px' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.3px', margin: 0 }}>{activeCategory}</h2>
            <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '2px' }}>{currentFaqs.length} questions published</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{ padding: '7px 14px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={13} strokeWidth={2.5} /> Add FAQ
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {showAddForm && (
            <div style={{ background: '#f0f6ff', border: '1px solid #bcd4f7', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', marginBottom: '12px' }}>New FAQ — {activeCategory}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  placeholder="Enter the question..."
                  style={{ height: '38px', borderRadius: '8px', border: '1px solid #bcd4f7', padding: '0 12px', fontSize: '13.5px', color: '#1d1d1f', background: '#fff', outline: 'none' }}
                />
                <textarea
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  placeholder="Enter the answer..."
                  rows={3}
                  style={{ borderRadius: '8px', border: '1px solid #bcd4f7', padding: '10px 12px', fontSize: '13.5px', color: '#1d1d1f', background: '#fff', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowAddForm(false)} style={{ padding: '7px 16px', borderRadius: '9999px', background: '#fff', border: '1px solid #e0e0e0', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500 }}>Cancel</button>
                  <button onClick={addFaq} style={{ padding: '7px 16px', borderRadius: '9999px', background: '#0066cc', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: 500 }}>Publish FAQ</button>
                </div>
              </div>
            </div>
          )}

          {currentFaqs.map((faq, i) => (
            <div
              key={faq.id}
              style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '14px', overflow: 'hidden' }}
            >
              <div
                style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <GripVertical size={14} color="#d0d0d5" style={{ flexShrink: 0, cursor: 'grab' }} />
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#1d1d1f', letterSpacing: '-0.1px' }}>{faq.q}</span>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); }}
                    style={{ padding: '5px', borderRadius: '7px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#7a7a7a' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteFaq(faq.id); }}
                    style={{ padding: '5px', borderRadius: '7px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff3b30' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fff0f0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Trash2 size={13} />
                  </button>
                  {expandedId === faq.id ? <ChevronUp size={15} color="#7a7a7a" /> : <ChevronDown size={15} color="#7a7a7a" />}
                </div>
              </div>
              {expandedId === faq.id && (
                <div style={{ padding: '0 18px 16px 42px', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '13.5px', color: '#5a5a5e', lineHeight: 1.6, margin: '12px 0 0', letterSpacing: '-0.05px' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          {currentFaqs.length === 0 && !showAddForm && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a7a7a' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>❓</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#3a3a3c', marginBottom: '6px' }}>No FAQs in {activeCategory}</div>
              <div style={{ fontSize: '13px' }}>Click "Add FAQ" to create the first one.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
