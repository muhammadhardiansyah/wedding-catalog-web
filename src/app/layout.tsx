import type { Metadata } from 'next';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: {
    default: 'UndanganId — Jasa Undangan Pernikahan Digital Premium',
    template: '%s — UndanganId',
  },
  description: 'Jasa pembuatan undangan pernikahan digital profesional. Ratusan desain eksklusif, elegan, dan modern.',
  keywords: 'undangan pernikahan digital, jasa undangan pernikahan, undangan pernikahan online',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}