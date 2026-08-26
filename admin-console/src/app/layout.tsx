import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/index.css';
import './layout.css';

export const metadata: Metadata = {
  title: 'Premium Education Platform Design',
  description:
    'Delivers a premium digital education platform designed for schools to enhance learning, streamline management, and engage students effectively.',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
