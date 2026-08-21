"use client";
import { useRouter } from 'next/navigation';
import HomePage, { type TabType } from '@/components/dashboard/HomePage';

export default function DashboardHomePage() {
  const router = useRouter();
  const onNavigate = (tab: TabType) => {
    if (tab === 'home') router.push('/dashboard');
    else router.push(`/dashboard/${tab}`);
  };
  return <HomePage onNavigate={onNavigate} />;
}
