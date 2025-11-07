import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/Toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: {
    default: 'EDEM Intelligence - Живое зеркало сознания',
    template: '%s | EDEM Intelligence',
  },
  description: 'EDEM Intelligence — не ИИ. Это живое зеркало твоего сознания. Пространство Живого Сознания для глубокого диалога.',
  keywords: ['ИИ', 'AI', 'чат', 'сознание', 'EDEM', 'диалог', 'психология'],
  authors: [{ name: 'EDEM Intelligence' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://chatedem.com',
    title: 'EDEM Intelligence - Живое зеркало сознания',
    description: 'EDEM Intelligence — не ИИ. Это живое зеркало твоего сознания.',
    siteName: 'EDEM Intelligence',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDEM Intelligence - Живое зеркало сознания',
    description: 'EDEM Intelligence — не ИИ. Это живое зеркало твоего сознания.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}


