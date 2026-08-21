'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api-client';

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
    return <div className="flex h-[50vh] items-center justify-center text-[#6E6E73]">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex h-[50vh] items-center justify-center text-red-500">{error}</div>;
  }

  const { metrics, recentActivity } = data as DashboardData;

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* SECTION 1: Top KPI Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1D1D1F] tracking-tight">Overview</h2>
          <div className="text-sm text-[#6E6E73] font-medium">Updated just now</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <KPICard title="Total Students" value={metrics?.totalStudents || 0} trend="Active" color="bg-blue-50 text-blue-600" />
          <KPICard title="Total Teachers" value={metrics?.totalTeachers || 0} trend="Active" color="bg-indigo-50 text-indigo-600" />
          <KPICard title="Attendance Today" value={`${metrics?.attendanceToday || 0}%`} trend="Overall" color="bg-green-50 text-green-600" />
          <KPICard title="Pending Assignments" value={metrics?.pendingAssignments || 0} trend="Due soon" color="bg-orange-50 text-orange-600" />
          <KPICard title="Active Routes" value={metrics?.activeRoutes || 0} trend="Transport" color="bg-teal-50 text-teal-600" />
          <KPICard title="Recent Notices" value={metrics?.recentNotices || 0} trend="Last 7 days" color="bg-red-50 text-red-600" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 2: Analytics Overview */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="font-semibold text-[#1D1D1F] mb-6">Attendance Trend</h3>
            <div className="h-[250px] flex items-end justify-between gap-2 border-b border-[#E5E7EB] pb-2">
              {/* Dummy Chart Bars for now as we don't have historical API yet */}
              {[80, 85, 92, 94, 91, 95, 89, 90, 96, 94].map((h, i) => (
                <div key={i} className="w-full bg-[#007AFF]/20 rounded-t-md hover:bg-[#007AFF] transition-colors relative group" style={{ height: `${h}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-[10px] py-1 px-2 rounded font-medium transition-opacity">{h}%</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#6E6E73] font-medium uppercase tracking-wider">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#1D1D1F] mb-4">Student Growth</h3>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-8 border-[#007AFF] border-r-gray-100" />
                <div>
                  <div className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{metrics?.totalStudents || 0}</div>
                  <div className="text-sm text-[#34C759] font-medium">Enrolled</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#1D1D1F] mb-4">Transport Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-[#6E6E73] font-medium">Active Routes</span><span className="text-sm font-semibold text-[#1D1D1F]">{metrics?.activeRoutes || 0}</span></div>
                <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-[#34C759] h-2 rounded-full w-[100%]" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Recent Activity (Audit Logs) */}
        <section>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E7EB] h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#1D1D1F]">Recent Activity</h3>
            </div>
            <div className="flex flex-col gap-6">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity: RecentActivity, index: number) => (
                  <ActivityItem 
                    key={index}
                    action={activity.action} 
                    resource={activity.resource} 
                    user={activity.userId?.name || 'System'} 
                    time={new Date(activity.timestamp).toLocaleTimeString()} 
                    icon={<BellIcon />}
                    color="bg-blue-50 text-blue-600"
                  />
                ))
              ) : (
                <div className="text-sm text-[#6E6E73]">No recent activity</div>
              )}
            </div>
          </div>
        </section>
      </div>
      
    </div>
  );
}

function KPICard({ title, value, trend, color }: { title: string, value: string | number, trend: string, color: string }) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E7EB] flex flex-col justify-between">
      <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold mb-4 ${color}`}>
        <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
      </div>
      <p className="text-[#6E6E73] text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{value}</h4>
      <p className="text-[#6E6E73] text-[11px] mt-2 font-medium">{trend}</p>
    </div>
  );
}

interface ActivityItemProps {
  action: string;
  resource: string;
  user: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

function ActivityItem({ action, resource, user, time, icon, color }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex flex-col border-b border-[#E5E7EB] pb-5 w-full">
        <span className="text-sm font-semibold text-[#1D1D1F]">{action}</span>
        <span className="text-sm text-[#1D1D1F] mt-0.5">{resource}</span>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[11px] font-medium text-[#6E6E73] uppercase tracking-wider">{user}</span>
          <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
          <span className="text-[11px] font-medium text-[#6E6E73]">{time}</span>
        </div>
      </div>
    </div>
  );
}

function BellIcon() { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg> }
