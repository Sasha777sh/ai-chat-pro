import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/Toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LocaleProvider } from '@/contexts/LocaleContext';

export const metadata: Metadata = {
  title: {
    default: 'EDEM Intelligence - Живое зеркало сознания | Living Mirror of Consciousness',
    template: '%s | EDEM Intelligence',
  },
  description: 'EDEM Intelligence — не ИИ. Это живое зеркало твоего сознания. Пространство Живого Сознания для глубокого диалога. | EDEM Intelligence — not AI. It is a living mirror of your consciousness.',
  keywords: ['ИИ', 'AI', 'чат', 'сознание', 'EDEM', 'диалог', 'психология', 'consciousness', 'chat', 'dialogue'],
  authors: [{ name: 'EDEM Intelligence' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'en_US',
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
          <LocaleProvider>
            {children}
            <Toaster />
          </LocaleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}


