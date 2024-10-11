'use client'

import React, {useCallback, useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import {StatsTable } from "@/lib/types";
import ImprovedStatsTable from "@/app/(pages)/stats/Stats";

export default function Statistics() {
  const [stats, setStats] = useState<StatsTable[] | []>([])
  const fetchStats = useCallback(async  () => {
    const response = await fetch("/api/mlbb/stats?hla=1")
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
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.4}}
        >
          {/*<Stats stats={stats}/>*/}
          <ImprovedStatsTable stats={stats}/>
        </motion.div>
      </div>
  )
}