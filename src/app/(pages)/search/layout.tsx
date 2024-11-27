import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hero Search & Analytics | Mobile Legends: Bang Bang',
  description:
    'Find detailed hero statistics, counters, and team compositions for Mobile Legends: Bang Bang. Analyze win rates, counter picks, and hero synergies to improve your gameplay.',
  keywords: [
    'Mobile Legends',
    'MLBB hero search',
    'MLBB hero counters',
    'MLBB analytics',
    'hero statistics',
    'win rates',
    'counter picks',
    'team composition',
    'hero synergy',
    'meta analysis',
    'MLBB guide',
  ].join(', '),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Hero Search & Analytics | Mobile Legends: Bang Bang',
    description:
      'Find detailed hero statistics, counters, and team compositions for Mobile Legends: Bang Bang. Analyze win rates, counter picks, and hero synergies to improve your gameplay.',
    url: 'https://mlbb.hlakarki.com/search',
    siteName: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
    images: [
      {
        url: '/mlbbSearchSEO.png',
        width: 1200,
        height: 630,
        alt: 'MLBB Hero Search & Analytics Dashboard',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hero Search & Analytics | Mobile Legends: Bang Bang',
    description:
      'Find detailed hero statistics, counters, and team compositions for Mobile Legends: Bang Bang. Analyze win rates, counter picks, and hero synergies.',
    images: ['/mlbbSearchSEO.png'],
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
  alternates: {
    canonical: 'https://mlbb.hlakarki.com/search',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
