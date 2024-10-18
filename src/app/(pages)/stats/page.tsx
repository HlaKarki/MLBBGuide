'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { StatsTableType } from "@/lib/types"
import { useQuery } from '@tanstack/react-query'
import StatsTable from "@/components/stats/Stats"

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <motion.h1
              className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            Hero Statistics
          </motion.h1>
          <motion.div
              className="bg-gray-800 rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatsTable stats={stats} isLoading={isLoading} error={error} />
          </motion.div>
        </div>
      </div>
  )
}