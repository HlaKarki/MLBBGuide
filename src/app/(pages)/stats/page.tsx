'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { StatsTableType } from "@/lib/types"
import { useQuery } from '@tanstack/react-query'
import StatsTable from "@/app/(pages)/stats/Stats";

export default function Statistics() {
  const { data: stats, isLoading, error } = useQuery<StatsTableType[], Error>({
    queryKey: ['stats'],
    queryFn: async (): Promise<StatsTableType[]> => {
      const response = await fetch("/api/mlbb/stats?hla=1")
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.4}}
        >
          <StatsTable stats={stats} isLoading={isLoading} error={error} />
        </motion.div>
      </div>
  )
}