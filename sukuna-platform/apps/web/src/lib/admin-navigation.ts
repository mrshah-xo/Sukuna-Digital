import {
  LayoutDashboard, Palette, Users, BookOpen, Bell, Calendar,
  BarChart3, Library, CreditCard, FlaskConical, Brain, HelpCircle,
  ShieldCheck, FileWarning, TrendingUp, Lock, Settings, GraduationCap,
} from 'lucide-react';

export type AdminNavItemId =
  | 'overview' | 'students' | 'teachers';

export interface AdminNavItem {
  id: AdminNavItemId;
  label: string;
  icon: React.ElementType;
  href: string;
  group: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

// Only include routes that have implementations
export const adminNavItems: AdminNavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, href: '/admin', group: 'main' },
  { id: 'students', label: 'Students', icon: GraduationCap, href: '/admin/students', group: 'main' },
  { id: 'teachers', label: 'Teachers', icon: BookOpen, href: '/admin/teachers', group: 'main' },
];

const groupOrder = ['main'];

export const groupLabels: Record<string, string> = {
  main: 'Main',
};

export function getAdminNavGroups(): AdminNavGroup[] {
  const groups: Record<string, AdminNavItem[]> = {};
  
  adminNavItems.forEach(item => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    const groupArray = groups[item.group];
    if (groupArray) {
      groupArray.push(item);
    }
  });
  
  return groupOrder
    .map(groupKey => ({
      label: groupLabels[groupKey] || groupKey,
      items: groups[groupKey] || [],
    }))
    .filter(group => group.items.length > 0);
}

export function getNavItemById(id: AdminNavItemId): AdminNavItem | undefined {
  return adminNavItems.find(item => item.id === id);
}

export function getActiveNavItem(pathname: string): AdminNavItem | undefined {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return adminNavItems.find(item => {
      if (item.href === '/admin') {
        return pathname === '/admin';
      }
      return pathname.startsWith(item.href);
    });
  }
  return undefined;
}

export function getSectionTitle(id: AdminNavItemId | string): string {
  const item = adminNavItems.find(i => i.id === id);
  return item?.label || 'Admin';
}
