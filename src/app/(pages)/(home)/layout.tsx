import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
  description:
    'A comprehensive analytics and team composition tool for Mobile Legends: Bang Bang (MLBB) players, built with Next.js and TypeScript.',
  keywords:
    'Mobile Legends, Bang Bang, MLBB, analytics, rank helper, team composition, hero statistics, counter-picking, meta analysis',
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
        url: '/mlbb.png',
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
  return <>{children}</>;
}
