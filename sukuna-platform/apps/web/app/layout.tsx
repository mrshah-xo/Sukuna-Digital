import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sukuna School — Digital Platform',
  description: 'A School That Adapts Today, Leads Tomorrow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* SF Pro Display fallback via system fonts — closest to Apple look */}
        <style>{`
          @supports (font: -apple-system-body) {
            body { font: -apple-system-body; }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}