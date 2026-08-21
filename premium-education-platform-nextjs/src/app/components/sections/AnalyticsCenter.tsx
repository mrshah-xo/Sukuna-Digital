'use client';

import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const userGrowthData = [
  { month: 'Aug', students: 2400, teachers: 120 },
  { month: 'Sep', students: 2550, teachers: 128 },
  { month: 'Oct', students: 2620, teachers: 131 },
  { month: 'Nov', students: 2680, teachers: 134 },
  { month: 'Dec', students: 2710, teachers: 136 },
  { month: 'Jan', students: 2740, teachers: 139 },
  { month: 'Feb', students: 2780, teachers: 141 },
  { month: 'Mar', students: 2810, teachers: 141 },
  { month: 'Apr', students: 2830, teachers: 143 },
  { month: 'May', students: 2847, teachers: 143 },
];

const dailyLoginsData = [
  { day: 'Mon', logins: 842 },
  { day: 'Tue', logins: 921 },
  { day: 'Wed', logins: 889 },
  { day: 'Thu', logins: 956 },
  { day: 'Fri', logins: 812 },
  { day: 'Sat', logins: 234 },
  { day: 'Sun', logins: 187 },
];

const featureUsageData = [
  { name: 'Sukuna Book', usage: 89 },
  { name: 'Library', usage: 74 },
  { name: 'Results', usage: 68 },
  { name: 'Notices', usage: 91 },
  { name: 'Memories', usage: 43 },
  { name: 'Research', usage: 38 },
  { name: 'Payments', usage: 52 },
];

const roleDistData = [
  { name: 'Students', value: 2847, color: '#34c759' },
  { name: 'Teachers', value: 143, color: '#0066cc' },
  { name: 'Workers', value: 67, color: '#ff9500' },
  { name: 'Admins', value: 4, color: '#5856d6' },
];

const paymentData = [
  { month: 'Jan', collected: 4200000, pending: 820000 },
  { month: 'Feb', collected: 3800000, pending: 1100000 },
  { month: 'Mar', collected: 5100000, pending: 650000 },
  { month: 'Apr', collected: 4700000, pending: 900000 },
  { month: 'May', collected: 3200000, pending: 2300000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <p style={{ fontSize: '11px', color: '#7a7a7a', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: '13px', fontWeight: 600, color: p.color || '#1d1d1f', margin: '2px 0' }}>
            <span style={{ fontWeight: 400, color: '#7a7a7a' }}>{p.name}: </span>
            {typeof p.value === 'number' && p.value > 100000
              ? `रु${(p.value / 1000000).toFixed(1)}M`
              : p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '18px', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f' }}>{title}</div>
        {subtitle && <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      <div style={{ padding: '16px 8px 20px' }}>
        {children}
      </div>
    </div>
  );
}

const tabs = ['Overview', 'Users', 'Payments', 'Engagement'];

export function AnalyticsCenter() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: '22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.4px', margin: 0 }}>
            Analytics Center
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px' }}>
            Platform-wide performance insights — Academic Year 2025/2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', background: '#f5f5f7', borderRadius: '10px', padding: '4px' }}>
          {['7 days', '30 days', '90 days', '1 year'].map(t => (
            <button
              key={t}
              style={{
                padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 500,
                background: t === '30 days' ? '#ffffff' : 'transparent',
                color: t === '30 days' ? '#1d1d1f' : '#7a7a7a',
                boxShadow: t === '30 days' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '22px', borderBottom: '1px solid #f0f0f0', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '10px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13.5px', fontWeight: activeTab === t ? 600 : 400,
              color: activeTab === t ? '#0066cc' : '#7a7a7a',
              borderBottom: activeTab === t ? '2px solid #0066cc' : '2px solid transparent',
              marginBottom: '-1px',
              letterSpacing: '-0.1px',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="User Growth" subtitle="Total students and teachers over time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData} margin={{ left: 0, right: 16 }}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop key="student-stop-1" offset="5%" stopColor="#0066cc" stopOpacity={0.15} />
                  <stop key="student-stop-2" offset="95%" stopColor="#0066cc" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="teacherGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop key="teacher-stop-1" offset="5%" stopColor="#34c759" stopOpacity={0.15} />
                  <stop key="teacher-stop-2" offset="95%" stopColor="#34c759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid-1" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis key="xaxis-1" dataKey="month" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis-1" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip-1" content={<CustomTooltip />} />
              <Area key="students" type="monotone" dataKey="students" stroke="#0066cc" strokeWidth={2} fill="url(#studentGrad)" name="Students" />
              <Area key="teachers" type="monotone" dataKey="teachers" stroke="#34c759" strokeWidth={2} fill="url(#teacherGrad)" name="Teachers" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily Login Activity" subtitle="Total logins per day this week">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyLoginsData} margin={{ left: 0, right: 16 }}>
              <CartesianGrid key="grid-2" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis key="xaxis-2" dataKey="day" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis-2" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip-2" content={<CustomTooltip />} />
              <Bar key="logins" dataKey="logins" fill="#0066cc" radius={[6, 6, 0, 0]} name="Logins" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '16px' }}>
        <ChartCard title="Feature Usage Rate" subtitle="Percentage of active users engaging with each feature">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={featureUsageData} layout="vertical" margin={{ left: 60, right: 24 }}>
              <CartesianGrid key="grid-3" strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis key="xaxis-3" type="number" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis key="yaxis-3" type="category" dataKey="name" tick={{ fontSize: 12, fill: '#3a3a3c' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip key="tooltip-3" content={<CustomTooltip />} />
              <Bar key="usage" dataKey="usage" fill="#0066cc" radius={[0, 6, 6, 0]} name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Role Distribution" subtitle="Breakdown by role">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  key="pie-1"
                  data={roleDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {roleDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip-4" content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', padding: '0 16px' }}>
              {roleDistData.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: '#3a3a3c' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f' }}>{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Payment Collection vs Pending" subtitle="Monthly payment statistics (रु)">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={paymentData} margin={{ left: 10, right: 16 }}>
            <CartesianGrid key="grid-4" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis key="xaxis-4" dataKey="month" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis-4" tick={{ fontSize: 11, fill: '#7a7a7a' }} axisLine={false} tickLine={false} tickFormatter={v => `रु${(v / 1000000).toFixed(1)}M`} />
            <Tooltip key="tooltip-5" content={<CustomTooltip />} />
            <Legend key="legend-1" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#7a7a7a', paddingTop: '8px' }} />
            <Bar key="collected" dataKey="collected" fill="#0066cc" radius={[4, 4, 0, 0]} name="Collected" />
            <Bar key="pending" dataKey="pending" fill="#ff9500" radius={[4, 4, 0, 0]} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
