'use client'

import React, {useCallback, useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import {Stats} from "@/components/search/Stats";
import {StatsType} from "@/lib/types";
import StatsTemp from "@/app/(pages)/(home)/Stats";

export default function Home() {
  const [stats, setStats] = useState<StatsType | null>(null)
  const fetchStats = useCallback(async  () => {
    const response = await fetch("/api/mlbb/stats")
    const stats = await response.json()

    if (stats.errors) {return}

    setStats(stats)
  }, [])

  useEffect(() => {
      fetchStats().catch((err) => console.error(err))
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <motion.div
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="container mx-auto px-4 py-8 max-w-6xl"
        >
          WELCOME
        </motion.div>

        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.4}}
        >
          {/*<Stats stats={stats}/>*/}
          <StatsTemp />
        </motion.div>
      </div>
  )
}