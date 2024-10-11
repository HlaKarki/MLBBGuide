'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function Home() {

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
      </div>
  )
}