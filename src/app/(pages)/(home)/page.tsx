'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronRight,
  BarChart2,
  // Users,
  Search,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { Discord } from '@/lib/assets/icons';
import { getHeroNames } from '@/lib/utils';
import { HeroSearch } from '@/components/home/Search';
import Link from 'next/link';

const HeroBackground = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => (
  <div className="fixed inset-0 w-full h-full pointer-events-none">
    {/* Grid Background */}
    <div className="fixed inset-0 w-full h-full bg-[linear-gradient(to_right,#8B5CF6_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

    {/* Mouse-following glow effect */}
    <motion.div
      className="fixed rounded-full w-96 h-96 bg-blue-500 filter blur-3xl opacity-20"
      animate={{
        x: mousePosition.x - 200,
        y: mousePosition.y - 200,
      }}
      transition={{ type: 'spring', damping: 10, stiffness: 50 }}
    />

    {/* Additional ambient glow effects */}
    <div className="fixed top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
    <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
  </div>
);

export default function MLBBLandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const heroes = getHeroNames();

  if (!heroes || heroes.length < 1) return null;

  return (
    <div className="min-h-screen  text-white overflow-hidden">
      <HeroBackground mousePosition={mousePosition} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className={'relative z-10'}>
            <motion.h1
              className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dominate the Land of Dawn
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Elevate your MLBB game with data-driven insights, team composition
              analysis, and real-time strategies.
            </motion.p>
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <HeroSearch />
              <Button size="lg" variant="outline">
                <Discord className="mr-2 h-4 w-4" />
                Join Discord
              </Button>
            </motion.div>
          </div>

          {/* Featured Heroes Card */}
          <motion.div
            className={'relative z-0'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg filter blur-xl opacity-50" />
            <Card className="relative bg-gray-900/80 backdrop-blur-sm p-8 border-violet-500/20">
              <h2 className="text-2xl font-bold mb-4">Featured Heroes</h2>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div
                    key={i}
                    className="bg-gray-800 rounded-lg p-2 flex items-center justify-center"
                  >
                    <Image
                      src={`/unselected.webp`}
                      alt={`Hero ${i}`}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </main>

        {/* Features Section */}
        <section className="mt-24 relative z-0">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                link: '/stats',
                icon: BarChart2,
                title: 'Hero Statistics',
                description: 'Comprehensive win rates and performance metrics',
              },
              {
                link: '/search',
                icon: Search,
                title: 'Counter Picking',
                description: 'Get real-time suggestions to counter opponents',
              },
              // {
              //   link: '/rank-helper',
              //   icon: Users,
              //   title: 'Team Composition',
              //   description: 'Build the perfect team with our analysis tool',
              // },
              {
                link: '/ai',
                icon: Zap,
                title: 'Real-time Analytics',
                description: 'Stay updated with the latest meta across ranks',
              },
            ].map((feature, index) => (
              <motion.a
                href={feature.link}
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <feature.icon className="w-12 h-12 mb-4 text-violet-400" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* New Ancient Chronicler Section */}
        <section className="mt-24 relative z-0">
          <motion.div
            className="relative rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 " />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Meet The Ancient Chronicler
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Unlock the secrets of the Land of Dawn through conversations
                  with our AI loremaster. Get unique insights into hero stories,
                  relationships, and strategies straight from an immortal
                  witness.
                </p>
                <Link href={"/ai"}>
                  <Button  className="bg-violet-600 hover:bg-violet-700 text-violet-100">
                    Start a Conversation <ChevronRight className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="relative h-[300px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full filter blur-3xl opacity-20 " />
                <MessageSquare className="w-32 h-32 text-violet-200" />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
