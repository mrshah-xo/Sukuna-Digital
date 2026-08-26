'use client';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/auth/SplashScreen';

export default function HomePage() { 
  const router = useRouter();
  return <SplashScreen onComplete={() => router.push('/login')} />; 
}
