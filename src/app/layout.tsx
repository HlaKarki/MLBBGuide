import type { Metadata } from 'next';
import './styling/globals.css';
import { Footer } from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';
import QueryClientProvider, {
  GameProviderLayout,
  ThemeProvider,
} from '@/app/providers';

// analytic
import { Analytics } from '@vercel/analytics/react';

// speed insights
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  metadataBase: new URL('https://mlbb.hlakarki.com'),
  title: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
  description:
    'A comprehensive analytics and team composition tool for Mobile Legends: Bang Bang (MLBB) players, built with Next.js and TypeScript.',
  keywords:
    'Mobile Legends, Bang Bang, MLBB, analytics, rank helper, team composition, hero statistics, counter-picking, meta analysis, guide',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
    description:
      'A comprehensive analytics and team composition tool for Mobile Legends: Bang Bang (MLBB) players, built with Next.js and TypeScript.',
    url: 'https://mlbb.hlakarki.com',
    siteName: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
    images: [
      {
        url: 'https://mlbb.hlakarki.com/mlbb.png',
        width: 1200,
        height: 630,
        alt: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`antialiased min-h-screen flex flex-col justify-between`}
        >
          <QueryClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <GameProviderLayout>
                <Header />
                <main className={'flex-grow'}>{children}</main>
                <Analytics />
                <SpeedInsights />
                <Footer />
              </GameProviderLayout>
            </ThemeProvider>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
