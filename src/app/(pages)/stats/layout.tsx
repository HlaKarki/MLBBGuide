import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hero Statistics & Analytics | Mobile Legends: Bang Bang',
  description:
    'Comprehensive hero statistics including win rates, ban rates, and pick rates across all ranks in Mobile Legends: Bang Bang. Compare hero performance, abilities, and roles with our detailed analytics dashboard.',
  keywords: [
    'MLBB hero statistics',
    'Mobile Legends hero stats',
    'MLBB win rates',
    'MLBB ban rates',
    'MLBB pick rates',
    'hero performance',
    'hero comparison',
    'hero tier list',
    'hero rankings',
    'MLBB analytics',
    'hero abilities',
    'hero roles',
    'rank statistics',
    'meta analysis',
  ].join(', '),
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Hero Statistics & Analytics | Mobile Legends: Bang Bang',
    description:
      'Comprehensive hero statistics including win rates, ban rates, and pick rates across all ranks in Mobile Legends: Bang Bang. Compare hero performance, abilities, and roles with our detailed analytics dashboard.',
    url: 'https://mlbb.hlakarki.com/stats',
    siteName: 'Mobile Legends: Bang Bang Analytics & Rank Helper',
    images: [
      {
        url: '/mlbbStatsSEO.png',
        width: 1200,
        height: 630,
        alt: 'MLBB Hero Statistics Dashboard',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hero Statistics & Analytics | Mobile Legends: Bang Bang',
    description:
      'Comprehensive hero statistics including win rates, ban rates, and pick rates across all ranks. Compare hero performance and analyze the meta.',
    images: ['/mlbbStatsSEO.png'],
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
    canonical: 'https://mlbb.hlakarki.com/stats',
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
