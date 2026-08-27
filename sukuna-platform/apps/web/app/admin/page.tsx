'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api-client';
import {
  GraduationCap, Briefcase, Users, Activity, LogIn, Phone,
  AlertTriangle, Brain, CreditCard, CalendarDays, TrendingUp, TrendingDown,
} from 'lucide-react';

interface DashboardMetrics {
  totalStudents: number;
  totalTeachers: number;
  attendanceToday: string | number;
  pendingAssignments: number;
  activeRoutes: number;
  recentNotices: number;
}

interface RecentActivity {
  action: string;
  resource: string;
  userId?: { name?: string } | null;
  timestamp: string;
}

interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: RecentActivity[];
}

function getErrorMessage(err: unknown, fallback: string): string {
  const apiError = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error;
  return apiError?.message || fallback;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
  sub?: string;
}

function MetricCard({ label, value, icon: Icon, trend, trendUp, accent = '#0066cc', sub }: MetricCardProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '18px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'default',
        transition: 'box-shadow 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `${accent}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={17} color={accent} strokeWidth={1.75} />
        </div>
        {trend && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '11.5px',
              fontWeight: 500,
              color: trendUp ? '#34c759' : '#ff3b30',
            }}
          >
            {trendUp ? <TrendingUp size={11} strokeWidth={2} /> : <TrendingDown size={11} strokeWidth={2} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '30px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.8px', lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: '12.5px', color: '#7a7a7a', marginTop: '4px', letterSpacing: '-0.05px' }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: '11px', color: '#b0b0b8', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await apiClient.get<DashboardData>('/admin/dashboard');
        setData(response);
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Failed to load dashboard data'));
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#7a7a7a' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#ff3b30' }}>
        {error}
      </div>
    );
  }

  const { metrics, recentActivity } = data as DashboardData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      {/* Title Section */}
      <div style={{ marginBottom: '12px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#1d1d1f',
            letterSpacing: '-0.4px',
            margin: 0,
          }}
        >
          Live School Overview
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '3px', letterSpacing: '-0.05px' }}>
          Real-time metrics across your entire school platform
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <MetricCard
          label="Total Students"
          value={metrics?.totalStudents || 0}
          icon={GraduationCap}
          accent="#0066cc"
        />
        <MetricCard
          label="Total Teachers"
          value={metrics?.totalTeachers || 0}
          icon={Briefcase}
          accent="#5856d6"
        />
        <MetricCard label="Attendance Today" value={`${metrics?.attendanceToday || 0}%`} icon={Activity} accent="#34c759" />
        <MetricCard
          label="Pending Assignments"
          value={metrics?.pendingAssignments || 0}
          icon={AlertTriangle}
          accent="#ff9500"
        />
        <MetricCard label="Active Routes" value={metrics?.activeRoutes || 0} icon={Users} accent="#30d158" />
        <MetricCard label="Recent Notices" value={metrics?.recentNotices || 0} icon={Phone} accent="#ff3b30" />
      </div>

      {/* Recent Activity Section */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '18px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', margin: 0 }}>Recent Activity</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity: RecentActivity, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  borderBottom: index < recentActivity.length - 1 ? '1px solid #e8e8ed' : 'none',
                  paddingBottom: index < recentActivity.length - 1 ? '16px' : '0',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#0066cc18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Activity size={14} color="#0066cc" strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1d1d1f' }}>
                    {activity.action}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>
                    {activity.resource}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px',
                      fontSize: '11px',
                      color: '#b0b0b8',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{activity.userId?.name || 'System'}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '13px', color: '#7a7a7a' }}>No recent activity</div>
          )}
        </div>
      </div>
    </div>
  );
}