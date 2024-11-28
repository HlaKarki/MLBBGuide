import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import React from 'react';

export function HelpSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="text-center mt-40 relative z-0"
    >
      <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
        Need More Help?
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="outline"
          className="border-violet-500/20 hover:border-violet-500/40 backdrop-blur-sm"
        >
          <a href={'https://discord.gg/xDcdyPdGEw'}>Join Community</a>
        </Button>
        <Button
          variant="outline"
          className="border-violet-500/20 hover:border-violet-500/40 backdrop-blur-sm"
          asChild
        >
          <a href="https://discord.gg/A7kmUGzJsr">Report Bug</a>
        </Button>
        <Button
          variant="outline"
          className="border-violet-500/20 hover:border-violet-500/40 backdrop-blur-sm"
          asChild
        >
          <a href="https://github.com/HlaKarki/mlbb/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=">
            GitHub Issues
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
