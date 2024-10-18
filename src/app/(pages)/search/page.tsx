'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from "@/components/Loader";
import {HeroDetails as HeroDetailsType, HeroGraphData, HeroInfo} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { SearchBar } from "@/components/search/SearchBar";
import RankSelector from "@/components/search/RankSelector";
import HeroGraph from "@/components/search/HeroChart";
import HeroData from "@/components/search/HeroData";

const fetchHeroInfo = async (heroId: number | string) => {
  const response = await fetch(`/api/mlbb/heroes?id=${heroId}`);
  if (!response.ok) throw new Error('Failed to fetch hero info');
  return response.json();
};

const fetchHeroDetails = async (heroId: number | string, rank: number) => {
  const response = await fetch(`/api/mlbb/details?id=${heroId}&rank=${rank}`);
  if (!response.ok) throw new Error('Failed to fetch hero details');
  return response.json();
};

const fetchGraphData = async (heroId: number | string, rank: number) => {
  const response = await fetch(`/api/mlbb/graph?id=${heroId}&period=${30}&rank=${rank}`);
  if (!response.ok) throw new Error('Failed to fetch hero graph');
  return response.json();
}

export default function Component() {
  const [selectedRank, setSelectedRank] = useState<number>(7); // Default to Mythic
  const [recentSearches, setRecentSearches] = useState<Array<{ id: string | number, name: string }>>([]);
  const [selectedHero, setSelectedHero] = useState<{ id: number, name: string } | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const heroInfoQuery = useQuery<HeroInfo, Error>({
    queryKey: ['heroInfo', selectedHero?.id],
    queryFn: () => fetchHeroInfo(selectedHero?.id || ''),
    enabled: !!selectedHero,
  });

  const heroDetailsQuery = useQuery<HeroDetailsType, Error>({
    queryKey: ['heroDetails', selectedHero?.id, selectedRank],
    queryFn: () => fetchHeroDetails(selectedHero?.id || '', selectedRank),
    enabled: !!selectedHero,
  });

  const graphDataQuery = useQuery<HeroGraphData, Error>({
    queryKey: ['heroGraph', selectedHero?.id, selectedRank],
    queryFn: () => fetchGraphData(selectedHero?.id || '', selectedRank),
    enabled: !!selectedHero
  })

  const handleHeroSelect = useCallback((heroId: number | string) => {
    setSelectedHero({ id: Number(heroId), name: '' });

    // Update recent searches
    const newSearch = { id: heroId, name: '' };
    const updatedSearches = [newSearch, ...recentSearches.filter(h => h.id !== heroId)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }, [recentSearches]);

  const handleRankChange = useCallback((newRank: number) => {
    setSelectedRank(newRank);
    if (selectedHero) {
      queryClient.invalidateQueries({ queryKey: ['heroDetails', selectedHero.id] }).catch(error => console.error(error));
    }
  }, [selectedHero, queryClient]);

  const isLoading = heroInfoQuery.isLoading || heroDetailsQuery.isLoading || graphDataQuery.isLoading;
  const error = heroInfoQuery.error || heroDetailsQuery.error || graphDataQuery.error;

  return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-6xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">Hero Finder</h1>
            <p className="text-xl text-gray-200">Find the best hero for your team composition.</p>
          </div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800 bg-opacity-50 rounded-lg p-8 shadow-2xl mb-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full md:w-2/3">
                <SearchBar onHeroSelect={handleHeroSelect} selectedHero={selectedHero} />
              </div>
              <div className="w-full md:w-1/3">
                <RankSelector selectedRank={selectedRank} onRankChange={handleRankChange} />
              </div>
            </div>

            <Tabs defaultValue="hero-info" className="space-y-6">
              <TabsList className="w-full bg-gray-700 bg-opacity-50">
                <TabsTrigger value="hero-info" className="data-[state=active]:bg-gray-600 text-gray-400 data-[state=active]:text-white">Hero Info</TabsTrigger>
              </TabsList>
              <TabsContent value="hero-info">
                {isLoading && <Loader className="mx-auto mt-8" />}
                {error && (
                    <div className="bg-red-600 text-white p-4 rounded-md mt-4">
                      {error.message}
                    </div>
                )}
                {heroDetailsQuery.data && heroInfoQuery.data && (
                    <HeroData details={heroDetailsQuery.data} info={heroInfoQuery.data} />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          {
            graphDataQuery.data && <HeroGraph graphData={graphDataQuery.data} />
          }

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mt-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">Need More Help?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white">View Tutorials</Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white">Join Community</Button>
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white">Report Bug</Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
  );
}