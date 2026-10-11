import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/toast';
import { ErrorHandlingProvider } from '@/components/error-handling-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Bano Qabil One — Operations Platform',
  description:
    'Intelligent student operations, allocation and capacity management for the Bano Qabil network.',
  icons: {
    icon: '/bano-qabil-official.png',
  },
  openGraph: {
    title: 'Bano Qabil One',
    description: 'Every learner. Every seat. One intelligent platform.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Bano Qabil One' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bano Qabil One',
    description: 'Every learner. Every seat. One intelligent platform.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isRO = function(e) {
                  var m = (e && e.message) || (e && e.error && e.error.message) || String(e || '');
                  return m.indexOf('ResizeObserver') !== -1;
                };
                window.addEventListener('error', function(event) {
                  if (isRO(event)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(event) {
                  if (isRO(event.reason)) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return true;
                  }
                }, true);
                var origOnError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (isRO(message) || isRO(error)) {
                    return true;
                  }
                  if (origOnError) return origOnError.apply(this, arguments);
                  return false;
                };
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster><ErrorHandlingProvider>{children}</ErrorHandlingProvider></Toaster>
      </body>
    </html>
  );
}
