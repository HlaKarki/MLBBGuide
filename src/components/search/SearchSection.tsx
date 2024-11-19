import { FinalHeroDataType, RanksType } from '@/lib/types';
import { motion } from 'framer-motion';
import { HeroSearch } from '@/components/home/Search';
import RankSelector from '@/components/search/RankSelector';
import { Loader } from '@/components/Loader';
import HeroData from '@/components/search/HeroData';
import React from 'react';

export function SearchSection({ selectedRank, onRankChange, isLoading, error, finalData }: {
  selectedRank: RanksType;
  onRankChange: (newRank: RanksType) => void;
  isLoading: boolean;
  error: Error | null;
  finalData: {data: FinalHeroDataType[]};
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative z-20 backdrop-blur-sm rounded-lg p-8 shadow-2xl mb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-2/3">
          <HeroSearch />
        </div>
        <div className="w-full md:w-1/3">
          <RankSelector
            selectedRank={selectedRank}
            onRankChange={onRankChange}
          />
        </div>
      </div>

      <div>
        {isLoading && <Loader className="mx-auto mt-8" />}
        {error && (
          <div className="bg-red-600/80 backdrop-blur-sm text-white p-4 rounded-md mt-4">
            {error.message}
          </div>
        )}
        {finalData && <HeroData data={finalData.data[0]} />}
      </div>
    </motion.div>
  );
}