'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/admin/ui/sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D1D1F] font-sans flex">
      <Toaster position="top-right" richColors />
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (Fixed) */}
      <aside className={`fixed top-0 left-0 h-screen bg-[#FFFFFF] border-r border-[#E5E7EB] z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}`}>
        
        {/* Logo Area */}
        <div className="h-[72px] border-b border-[#E5E7EB] flex items-center px-5 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#007AFF] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold tracking-tight">S</span>
            </div>
            {!isCollapsed && <h1 className="font-semibold tracking-tight truncate">Sukuna Admin</h1>}
          </div>
          <button className="hidden lg:block text-[#6E6E73] hover:text-[#1D1D1F]" onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuIcon />
          </button>
          <button className="lg:hidden text-[#6E6E73]" onClick={() => setIsSidebarOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="overflow-y-auto h-[calc(100vh-72px)] py-6 px-3 flex flex-col gap-1 hide-scrollbar">
          <NavItem href="/admin" icon={<DashboardIcon />} label="Dashboard" collapsed={isCollapsed} active={pathname === '/admin'} />
          
          <SectionLabel label="People" collapsed={isCollapsed} />
          <NavItem href="/admin/students" icon={<UsersIcon />} label="Students" collapsed={isCollapsed} active={pathname?.startsWith('/admin/students')} />
          <NavItem href="/admin/teachers" icon={<BriefcaseIcon />} label="Teachers" collapsed={isCollapsed} active={pathname?.startsWith('/admin/teachers')} />
          <NavItem href="#" icon={<UserCheckIcon />} label="Parents" collapsed={isCollapsed} />
          <NavItem href="#" icon={<ShieldIcon />} label="Staff" collapsed={isCollapsed} />
          
          <SectionLabel label="Academics" collapsed={isCollapsed} />
          <NavItem href="#" icon={<CheckSquareIcon />} label="Attendance" collapsed={isCollapsed} />
          <NavItem href="#" icon={<TrendingUpIcon />} label="Results" collapsed={isCollapsed} />
          <NavItem href="#" icon={<FileTextIcon />} label="Assignments" collapsed={isCollapsed} />
          
          <SectionLabel label="Communications" collapsed={isCollapsed} />
          <NavItem href="#" icon={<BellIcon />} label="Notices" collapsed={isCollapsed} />
          <NavItem href="#" icon={<RadioIcon />} label="Sukuna Feed" collapsed={isCollapsed} />
          <NavItem href="#" icon={<VideoIcon />} label="Live Teacher" collapsed={isCollapsed} />
          
          <SectionLabel label="Operations" collapsed={isCollapsed} />
          <NavItem href="#" icon={<ImageMapIcon />} label="Memory Section" collapsed={isCollapsed} />
          <NavItem href="#" icon={<TruckIcon />} label="Transport" collapsed={isCollapsed} />
          <NavItem href="#" icon={<ActivityIcon />} label="Audit Logs" collapsed={isCollapsed} />
          <NavItem href="#" icon={<SettingsIcon />} label="Settings" collapsed={isCollapsed} />
        </div>
      </aside>

      {/* Main Content Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[260px]'}`}>
        
        {/* Top Header (Sticky) */}
        <header className="sticky top-0 h-[72px] bg-[#FFFFFF] border-b border-[#E5E7EB] z-30 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[#6E6E73]" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon />
            </button>
            <div className="relative hidden md:block">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73] w-4 h-4" />
              <input type="text" placeholder="Search students, teachers..." className="w-[300px] pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[16px] text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xs font-medium text-[#6E6E73]">School:</span>
              <span className="text-sm font-semibold text-[#1D1D1F]">Primary Branch</span>
              <ChevronDownIcon />
            </button>
            <div className="h-6 w-px bg-[#E5E7EB] hidden sm:block" />
            <button className="text-[#6E6E73] hover:text-[#1D1D1F] relative">
              <BellIcon />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF3B30] rounded-full border border-white" />
            </button>
            <button className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-[#E5E7EB]">
                <Image
                  src="https://ui-avatars.com/api/?name=Admin+User&background=007AFF&color=fff"
                  alt="Admin avatar"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-sm font-medium hidden md:block">Admin</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ label, collapsed }: { label: string, collapsed: boolean }) {
  if (collapsed) return <div className="h-8 border-b border-[#E5E7EB] mb-2 mx-2" />;
  return <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider mt-6 mb-2 px-4">{label}</div>;
}

function NavItem({ href = "#", icon, label, collapsed, active = false }: { href?: string, icon: React.ReactNode, label: string, collapsed: boolean, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4 gap-3'} py-2.5 rounded-[12px] transition-colors ${active ? 'bg-[#007AFF] text-white shadow-sm' : 'text-[#6E6E73] hover:bg-[#F8FAFC] hover:text-[#1D1D1F]'}`} title={collapsed ? label : undefined}>
      <div className={`shrink-0 ${active ? 'text-white' : ''}`}>{icon}</div>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

// Icons
function MenuIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CloseIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function SearchIcon({ className }: { className?: string }) { return <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function BellIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function ChevronDownIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg> }

function DashboardIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg> }
function UsersIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function BriefcaseIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function UserCheckIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 11 19 13 23 9" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function ShieldIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CheckSquareIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 11 12 14 22 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function TrendingUpIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function FileTextIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round"/><polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function RadioIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48 0a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function VideoIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="6" width="12" height="12" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function ImageMapIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function TruckIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function ActivityIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function SettingsIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
