'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/Loader';
import { APIMetaHeroDataType, MetaStatsType, RanksType } from '@/lib/types';
import { motion } from 'framer-motion';
import HeroGraph from '@/components/search/HeroGraph';
import { getHeroId, getHeroNameURL } from '@/lib/utils';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { HelpSection } from '@/components/search/HelpSection';
import { PageHeader } from '@/components/search/PageHeader';
import { SearchSection } from '@/components/search/SearchSection';
import { EmptyState } from '@/components/search/EmptyState';

function SearchPageContent() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [statType, setStatType] = useState<MetaStatsType>('pick');
  const [selectedRank, setSelectedRank] = useState<RanksType>('Overall');
  const [selectedHero, setSelectedHero] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const heroParam = searchParams.get('hero');
    if (!heroParam) return;
    const heroId = getHeroId(heroParam);
    if (!heroId) return;
    setSelectedHero({ id: heroId, name: heroParam });
  }, [searchParams]);

  useEffect(() => {
    if (selectedHero) {
      const heroName = getHeroNameURL(selectedHero.id);
      router.push(`/search?hero=${heroName}`, { scroll: false });
    }
  }, [selectedHero, router]);

  const handleRankChange = useCallback(
    (newRank: RanksType) => {
      setSelectedRank(newRank);
      if (selectedHero) {
        queryClient
          .invalidateQueries({
            queryKey: ['heroInfo', selectedHero.id, selectedRank],
          })
          .catch(console.error);
      }
    },
    [selectedHero, queryClient]
  );

  const {
    data: finalData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['heroInfo', selectedHero?.id, selectedRank],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final', {
        method: 'POST',
        body: JSON.stringify({
          hero_id: selectedHero?.id,
          rank: selectedRank,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hero data');
      }
      return response.json();
    },
    enabled: !!selectedHero?.id,
  });

  const { data: metaHeroStats } = useQuery<APIMetaHeroDataType>({
    queryKey: ['metaHeroStats', statType, selectedRank],
    queryFn: async () => {
      const res = await fetch(
        `/api/mlbb/search?rank=${selectedRank}&hero_count=10&stat_type=${statType}`
      );
      return await res.json();
    },
  });

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <BackgroundEffects />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-6xl relative"
      >
        <PageHeader />
        <SearchSection
          selectedRank={selectedRank}
          onRankChange={handleRankChange}
          isLoading={isLoading}
          error={error}
          finalData={finalData}
        />
        {!selectedHero && (
          <EmptyState
            data={metaHeroStats}
            stat_type={statType}
            setStatType={setStatType}
            selectedRank={selectedRank}
            onRankChange={setSelectedRank}
          />
        )}
        {finalData && <HeroGraph heroData={finalData.data[0]} />}
        <HelpSection />
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
