'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RanksType } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import StatsTable from '@/components/stats/Stats';

export default function Statistics() {
  const [rank, setRank] = useState<RanksType>('Overall');
  const {
    data: stats,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch(
        '/api/mlbb/final?rank=' + encodeURIComponent(rank)
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    enabled: false,
  });

  useEffect(() => {
    refetch().catch(error => console.error(error));
  }, [rank, refetch]);

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="fixed top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.h1
          className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hero Statistics
        </motion.h1>
        <motion.div
          className="backdrop-blur-sm rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsTable
            stats={stats?.data}
            isLoading={isFetching}
            error={error}
            currentRank={rank}
            setRank={setRank}
          />
        </motion.div>
      </div>
    </div>
  );
}
