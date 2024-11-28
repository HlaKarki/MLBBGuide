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
import { FeatureCard } from '@/components/featureCard';
import { BarChart2, Search, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RankSelector from '@/components/search/RankSelector';

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

function EmptyState({
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
      className="text-center space-y-8 mt-12"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
          Get Started with Hero Analysis
        </h2>
        <p className="text-violet-200 max-w-2xl mx-auto">
          Search for any hero to discover detailed statistics, counters, and
          team compositions. Make informed decisions for your next match!
        </p>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-violet-300 mb-4">
          Popular Heroes
        </h3>
        <div className={'flex gap-4'}>
          <Select onValueChange={setStatType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={'Pick rate'} />
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
        <div className={'flex flex-wrap gap-4'}>
          {data &&
            data.success &&
            data.data
              .sort((a, b) => b[`${stat_type}_rate`] - a[`${stat_type}_rate`])
              .map(hero => {
                return (
                  <div key={hero.hero_id}>
                    <img
                      src={hero.head}
                      className={'w-10 h-10'}
                      alt={hero.name}
                    />
                  </div>
                );
              })}
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
