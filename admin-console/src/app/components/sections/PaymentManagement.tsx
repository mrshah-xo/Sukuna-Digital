'use client';

import React, { useState } from 'react';
import { CreditCard, Download, Search, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const payments = [
  { id: 1, student: 'Amara Okafor', class: 'SSS 3', type: 'School Fees', amount: 85000, date: 'May 28, 2026', method: 'Bank Transfer', status: 'Paid', receipt: 'RCP-0012' },
  { id: 2, student: 'Chidera Nwachukwu', class: 'JSS 2', type: 'School Fees', amount: 72000, date: 'May 27, 2026', method: 'Online Payment', status: 'Paid', receipt: 'RCP-0013' },
  { id: 3, student: 'Fatima Abdullahi', class: 'SSS 1', type: 'Bus Fees', amount: 35000, date: 'May 26, 2026', method: 'Cash', status: 'Paid', receipt: 'RCP-0014' },
  { id: 4, student: 'Emmanuel Adeyemi', class: 'SSS 3', type: 'Exam Fees', amount: 12000, date: 'May 25, 2026', method: 'Online Payment', status: 'Pending', receipt: '—' },
  { id: 5, student: 'Tunde Bakare', class: 'SSS 3', type: 'School Fees', amount: 85000, date: 'May 20, 2026', method: 'Bank Transfer', status: 'Overdue', receipt: '—' },
  { id: 6, student: 'Ngozi Obi', class: 'SSS 2', type: 'School Fees', amount: 75000, date: 'May 18, 2026', method: 'Online Payment', status: 'Paid', receipt: 'RCP-0015' },
  { id: 7, student: 'Hauwa Bello', class: 'JSS 1', type: 'Bus Fees', amount: 35000, date: 'May 15, 2026', method: 'Cash', status: 'Pending', receipt: '—' },
];

const feeCategories = [
  { name: 'School Fees', collected: 4200000, pending: 1850000, total: 6050000 },
  { name: 'Bus Fees', collected: 980000, pending: 420000, total: 1400000 },
  { name: 'Exam Fees', collected: 186000, pending: 48000, total: 234000 },
  { name: 'Other Charges', collected: 73000, pending: 12000, total: 85000 },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#d1fae5', text: '#065f46' },
  Pending: { bg: '#fef3c7', text: '#92400e' },
  Overdue: { bg: '#fee2e2', text: '#991b1b' },
};

export function PaymentManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = payments.filter(p => {
    const matchSearch = p.student.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>Payment Management</h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>Track fee collections and manage outstanding payments</p>
        </div>
        <button style={{ padding: '7px 16px', borderRadius: '9999px', background: '#f5f5f7', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#3a3a3c', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={13} /> Export Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Collected', value: `रु${(totalCollected / 1000).toFixed(0)}K`, icon: CheckCircle, color: '#34c759' },
          { label: 'Outstanding', value: `रु${(totalPending / 1000).toFixed(0)}K`, icon: Clock, color: '#ff9500' },
          { label: 'Overdue Payments', value: '8', icon: XCircle, color: '#ff3b30' },
          { label: 'Collection Rate', value: '74.2%', icon: TrendingUp, color: '#0066cc' },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <s.icon size={15} color={s.color} strokeWidth={2} />
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.5px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
              <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#7a7a7a' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." style={{ width: '100%', height: '34px', borderRadius: '9999px', border: '1px solid #e0e0e0', paddingLeft: '30px', paddingRight: '12px', fontSize: '12.5px', color: '#1d1d1f', background: '#f5f5f7', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: '5px 12px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500, background: statusFilter === s ? '#1d1d1f' : '#f5f5f7', color: statusFilter === s ? '#fff' : '#3a3a3c' }}
              >{s}</button>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                {['Student', 'Class', 'Fee Type', 'Amount', 'Date', 'Method', 'Status', 'Receipt'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 600, color: '#7a7a7a', letterSpacing: '0.3px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i, arr) => {
                const sc = statusColors[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid #f8f8f8' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{p.student}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#7a7a7a' }}>{p.class}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#3a3a3c' }}>{p.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>रु{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a7a7a' }}>{p.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#7a7a7a' }}>{p.method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px', background: sc.bg, color: sc.text }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: p.receipt !== '—' ? '#0066cc' : '#b0b0b8', fontWeight: p.receipt !== '—' ? 500 : 400 }}>{p.receipt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', padding: '20px' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '16px' }}>Fee Categories</div>
          {feeCategories.map(cat => {
            const pct = Math.round((cat.collected / cat.total) * 100);
            return (
              <div key={cat.name} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>{cat.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0066cc' }}>{pct}%</span>
                </div>
                <div style={{ background: '#f0f0f0', borderRadius: '9999px', height: '7px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? '#34c759' : pct > 60 ? '#0066cc' : '#ff9500', borderRadius: '9999px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7a7a7a' }}>
                  <span>Collected: रु{(cat.collected / 1000000).toFixed(1)}M</span>
                  <span>Pending: रु{(cat.pending / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
