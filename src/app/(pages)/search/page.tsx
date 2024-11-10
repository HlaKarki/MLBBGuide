'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from '@/components/Loader';
import { FinalHeroDataType, RanksType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';
import RankSelector from '@/components/search/RankSelector';
import HeroGraph from '@/components/search/HeroGraph';
import HeroData from '@/components/search/HeroData';
import {
  getHeroId,
  getHeroName,
  getHeroNameURL,
  replaceHyphenInHeroName,
} from '@/lib/utils';

export default function SearchPage() {
  const queryClient = useQueryClient();

  const [selectedRank, setSelectedRank] = useState<RanksType>('All'); // Default to All
  const [recentSearches, setRecentSearches] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [selectedHero, setSelectedHero] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // On mount, read the URL hash to determine the hero to load
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    const name = replaceHyphenInHeroName(window.location.hash.substring(1));
    if (!name) return;
    const heroId = getHeroId(name);
    if (!heroId) return;
    setSelectedHero({ id: heroId, name: name });
  }, []);

  // Update URL whenever the selected hero changes
  useEffect(() => {
    if (selectedHero) {
      window.location.hash = `#${getHeroNameURL(selectedHero.id)}`;
    }
  }, [selectedHero]);

  // Handle hero selection, which sets both state and updates URL
  const handleHeroSelect = useCallback(
    (heroId: number | string) => {
      setSelectedHero({ id: Number(heroId), name: getHeroName(heroId) });

      // Update recent searches
      const newSearch = { id: heroId, name: getHeroName(heroId) };
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(h => h.id !== heroId),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    },
    [recentSearches]
  );

  // Handle rank changes
  const handleRankChange = useCallback(
    (newRank: RanksType) => {
      setSelectedRank(newRank);
      if (selectedHero) {
        queryClient
          .invalidateQueries({ queryKey: ['heroInfo', selectedHero.id] })
          .catch(error => console.error(error));
      }
    },
    [selectedHero, queryClient]
  );

  // Fetch once for all data
  const finalData = useQuery({
    queryKey: ['heroInfo', selectedHero?.id],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final', {
        method: 'POST',
        body: JSON.stringify({
          hero_id: selectedHero?.id,
          rank: selectedRank,
        }),
      });
      return response.json();
    },
    enabled: !!selectedHero?.id,
  });

  const isLoading = finalData.isLoading;
  const error = finalData.error;

  useEffect(() => {
    console.log(finalData.data);
  }, [finalData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-6xl"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
            Hero Finder
          </h1>
          <p className="text-xl text-gray-200">
            Find the best hero for your team composition.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 bg-opacity-50 rounded-lg p-8 shadow-2xl mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="w-full md:w-2/3">
              <SearchBar
                onHeroSelect={handleHeroSelect}
                selectedHero={selectedHero}
              />
            </div>
            <div className="w-full md:w-1/3">
              <RankSelector
                selectedRank={selectedRank}
                onRankChange={handleRankChange}
              />
            </div>
          </div>

          <div>
            {isLoading && <Loader className="mx-auto mt-8" />}
            {error && (
              <div className="bg-red-600 text-white p-4 rounded-md mt-4">
                {error.message}
              </div>
            )}
            {finalData.data && <HeroData data={finalData.data.data[0]} />}
          </div>
        </motion.div>

        {finalData.data && <HeroGraph heroData={finalData.data.data[0]} />}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">
            Need More Help?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              View Tutorials
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Join Community
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Report Bug
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
