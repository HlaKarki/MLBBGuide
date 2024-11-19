'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/Loader';
import { RanksType } from '@/lib/types';
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

function SearchPageContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRank, setSelectedRank] = useState<RanksType>('Overall');
  const [recentSearches, setRecentSearches] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [selectedHero, setSelectedHero] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // On mount, read the URL query parameter to determine the hero to load
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    const heroParam = searchParams.get('hero');
    if (!heroParam) return;
    const name = replaceHyphenInHeroName(heroParam);
    const heroId = getHeroId(name);
    if (!heroId) return;
    setSelectedHero({ id: heroId, name: name });
  }, [searchParams]);

  // Update URL whenever the selected hero changes
  useEffect(() => {
    if (selectedHero) {
      const heroName = getHeroNameURL(selectedHero.id);
      router.push(`/search?hero=${heroName}`, { scroll: false });
    }
  }, [selectedHero, router]);

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

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Background effects from home page */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="fixed top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-6xl relative"
      >
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

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative backdrop-blur-sm  rounded-lg p-8 shadow-2xl mb-12"
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
              <div className="bg-red-600/80 backdrop-blur-sm text-white p-4 rounded-md mt-4">
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
          className="text-center mt-12 relative z-[5]"
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
      </motion.div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader className="mx-auto mt-8" />}>
      <SearchPageContent />
    </Suspense>
  );
}
