import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { SosSessionProvider } from '@/components/dashboard/sos/SosSessionContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SosSessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SosSessionProvider>
  );
}
