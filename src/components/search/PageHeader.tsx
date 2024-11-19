import { motion } from 'framer-motion';
import React from 'react';

export function PageHeader() {
  return (
    <div className="text-center mb-12">
      <motion.h1
        className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hero Finder
      </motion.h1>
      <motion.p
        className="text-xl text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Find the best hero for your team composition.
      </motion.p>
    </div>
  );
}
