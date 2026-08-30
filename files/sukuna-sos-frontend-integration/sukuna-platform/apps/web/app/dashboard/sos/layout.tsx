import SosNav from '@/components/dashboard/sos/SosNav';

export default function SosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <SosNav />
      {children}
    </div>
  );
}
