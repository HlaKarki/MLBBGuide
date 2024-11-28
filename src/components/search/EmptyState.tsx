import React from 'react';
import { motion } from 'framer-motion';
import { APIMetaHeroDataType, MetaStatsType, RanksType } from '@/lib/types';
import { BarChart2, Search, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RankSelector from '@/components/search/RankSelector';
import { FeatureCard } from '@/components/featureCard';

export function EmptyState({
  data,
  stat_type,
  setStatType,
  selectedRank,
  onRankChange,
}: {
  data?: APIMetaHeroDataType;
  stat_type: MetaStatsType;
  setStatType: (stat_type: MetaStatsType) => void;
  selectedRank: RanksType;
  onRankChange: (rank: RanksType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-12 mt-12"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
          Get Started with Hero Analysis
        </h2>
        <p className="text-violet-200 max-w-2xl mx-auto text-lg">
          Search for any hero to discover detailed statistics, counters, and
          team compositions. Make informed decisions for your next match!
        </p>
      </div>

      <div className="mt-12 p-6 rounded-lg">
        <h3 className="text-2xl font-semibold text-violet-300 mb-6">
          Popular Heroes
        </h3>
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Select onValueChange={setStatType} value={stat_type}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select stat type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pick">Pick rate</SelectItem>
              <SelectItem value="win">Win rate</SelectItem>
              <SelectItem value="ban">Ban rate</SelectItem>
            </SelectContent>
          </Select>
          <RankSelector
            selectedRank={selectedRank}
            onRankChange={onRankChange}
          />
        </div>
        <div className="flex flex-wrap  gap-4 justify-center">
          {data &&
            data.success &&
            data.data
              .sort((a, b) => b[`${stat_type}_rate`] - a[`${stat_type}_rate`])
              .map(hero => (
                <motion.div
                  key={hero.hero_id}
                  whileHover={{ scale: 1.1 }}
                  className="relative group"
                >
                  <img
                    src={hero.head}
                    className="w-16 h-16 rounded-full border-2 border-violet-500"
                    alt={hero.name}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-semibold text-white">
                      {(hero[`${stat_type}_rate`] * 100).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          feature={{
            title: 'Search Heroes',
            description:
              'Look up any hero to see their current performance stats and trends',
            icon: Search,
          }}
        />
        <FeatureCard
          feature={{
            title: 'Find Counters',
            description:
              'Discover which heroes work best with or against your chosen hero',
            icon: Users,
          }}
        />
        <FeatureCard
          feature={{
            title: 'Track Performance',
            description:
              'View detailed win rates and performance metrics across different ranks',
            icon: BarChart2,
          }}
        />
      </div>
    </motion.div>
  );
}
