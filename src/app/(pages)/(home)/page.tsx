'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart2, Search, Shield } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Hero Statistics',
      description:
        'Comprehensive win rates, ban rates, and performance metrics across all ranks',
      icon: <BarChart2 className="h-6 w-6" />,
      link: '/stats',
    },
    {
      title: 'Hero Search',
      description:
        'Find detailed information about any hero, including counters and synergies',
      icon: <Search className="h-6 w-6" />,
      link: '/search',
    },
    {
      title: 'Rank Helper',
      description:
        'Get personalized hero recommendations based on your rank and playstyle',
      icon: <Shield className="h-6 w-6" />,
      link: '/rank-helper',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16 max-w-6xl"
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
            Mobile Legends: Bang Bang Analytics
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Mobile Legends: Bang Bang is a multiplayer online battle arena
            (MOBA) game where two teams of five players battle to destroy the
            enemy base while defending their own. With over 100 unique heroes,
            each with distinct abilities and roles, mastering the game requires
            deep understanding of hero mechanics, team composition, and counter
            strategies.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <Link href={feature.link} key={index}>
              <Card className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 transition-all cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {feature.icon}
                      {feature.title}
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center bg-blue-800 bg-opacity-50 p-8 rounded-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">
            Why Use Our Analytics?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Data-Driven Decisions
              </h3>
              <p>
                Make informed choices based on real-time statistics and
                performance metrics from millions of matches.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Counter Picking</h3>
              <p>
                Learn which heroes effectively counter your opponents and
                improve your draft phase strategy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Team Composition</h3>
              <p>
                Understand hero synergies and build optimal team compositions
                for better coordination.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
