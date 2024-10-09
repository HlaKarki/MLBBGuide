'use client'

import React, {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'
import { SearchBar } from "@/components/home/SearchBar"
import { Loader } from "@/components/Loader"
import { HeroDetails as HeroDetailsType, HeroInfo, MetaHeroesType, StatsType } from "@/lib/types"
import { HeroData } from "@/components/home/HeroData"
import { RankSelector } from "@/components/home/RankSelector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentSearch } from '@/components/home/RecentSearch'
import { MetaHeroes } from '@/components/home/MetaHeroes'
import { Stats } from '@/components/home/Stats'
import { motion } from 'framer-motion'

export default function Home() {
  const [heroDetails, setHeroDetails] = useState<HeroDetailsType | null>(null)
  const [heroInfo, setHeroInfo] = useState<HeroInfo | null>(null)
  const [selectedRank, setSelectedRank] = useState<number>(7) // Default to Mythic
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{id: string | number, name: string}>>([])
  const [metaHeroes, setMetaHeroes] = useState<MetaHeroesType[]>([])
  const [stats, setStats] = useState<StatsType | null>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }

    fetchMetaHeroesAndStats().catch(console.error)
  }, [])

  const fetchMetaHeroesAndStats = async () => {
    const [metaHeroes, stats] = await Promise.all([
      fetch('/api/mlbb/meta-heroes').then(res => res.json()),
      fetch('/api/mlbb/stats').then(res => res.json()),
    ])

    if (metaHeroes.error || stats.error) {
      setError("There was an error fetching hero stats and metadata")
    }

    setMetaHeroes(metaHeroes)
    setStats(stats)
  }

  const fetchHeroDetails = useCallback( async (heroId: number | string) => {
    setIsLoading(true)
    setError(null)
    try {
      const [heroInfoResponse, heroDetailsResponse] = await Promise.all([
        fetch(`/api/mlbb/heroes?id=${heroId}`).then(res => res.json()),
        fetch(`/api/mlbb/details?hero_id=${heroId}&rank=${selectedRank}`).then(res => res.json())
      ])

      if (heroInfoResponse.error || heroDetailsResponse.error) {
        return setError("There is no info for this hero for this rank")
      }

      setHeroInfo(heroInfoResponse)
      setHeroDetails(heroDetailsResponse)

      // Update recent searches
      const newSearch = { name: heroDetailsResponse.counters.name, id: heroId, }
      const updatedSearches = [newSearch, ...recentSearches.filter(h => h.id !== heroId)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    } catch (error) {
      console.error('Error fetching hero details:', error)
      setError('Failed to fetch hero details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])


  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-6xl"
        >
          <div className="text-center mb-12">
            <Image
                src="https://akmweb.youngjoygame.com/web/gms/image/99279c21d903397cf56a5a5561c680f1.png"
                alt="Mobile Legends: Bang Bang Logo"
                width={200}
                height={100}
                className="mx-auto mb-6 drop-shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">Hero Finder</h1>
            <p className="text-xl text-blue-200">Discover the perfect hero for your team composition</p>
          </div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-800 bg-opacity-50 rounded-lg p-8 shadow-2xl mb-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <SearchBar onHeroSelect={fetchHeroDetails} />
              <RankSelector selectedRank={selectedRank} onRankChange={setSelectedRank} />
            </div>

            <Tabs defaultValue="hero-info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-blue-700 bg-opacity-50">
                <TabsTrigger value="hero-info" className="data-[state=active]:bg-blue-600">Hero Info</TabsTrigger>
                <TabsTrigger value="recent-searches" className="data-[state=active]:bg-blue-600">Recent Searches</TabsTrigger>
                <TabsTrigger value="meta-heroes" className="data-[state=active]:bg-blue-600">Meta Heroes</TabsTrigger>
              </TabsList>
              <TabsContent value="hero-info">
                {isLoading && <Loader className="mx-auto mt-8" />}
                {error && (
                    <div className="bg-red-600 text-white p-4 rounded-md mt-4">
                      {error}
                    </div>
                )}
                {heroDetails && heroInfo && (
                    <HeroData details={heroDetails} info={heroInfo} />
                )}
              </TabsContent>
              <TabsContent value="recent-searches">
                <RecentSearch recentSearches={recentSearches} onHeroSelect={fetchHeroDetails} />
              </TabsContent>
              <TabsContent value="meta-heroes">
                <MetaHeroes metaHeroes={metaHeroes} onHeroSelect={fetchHeroDetails} />
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Stats stats={stats} />
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mt-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-yellow-400">Need More Help?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white">
                View Tutorials
              </Button>
              <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white">
                Join Community
              </Button>
              <Button variant="outline" className="bg-blue-700 hover:bg-blue-600 text-white">
                Report Bug
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
  )
}