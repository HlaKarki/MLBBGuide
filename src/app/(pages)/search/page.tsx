'use client'

import React, {useState, useEffect, useCallback} from 'react'
import { Loader } from "@/components/Loader"
import { HeroDetails as HeroDetailsType, HeroInfo, MetaHeroesType, StatsType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from 'framer-motion'
import {SearchBar} from "@/components/search/SearchBar";
import RankSelector from "@/components/search/RankSelector";
import {HeroData} from "@/components/search/HeroData";

export default function Home() {
  const [heroDetails, setHeroDetails] = useState<HeroDetailsType | null>(null)
  const [heroInfo, setHeroInfo] = useState<HeroInfo | null>(null)
  const [selectedRank, setSelectedRank] = useState<number>(7) // Default to Mythic
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{id: string | number, name: string}>>([])
  // const [metaHeroes, setMetaHeroes] = useState<MetaHeroesType[]>([])
  // const [stats, setStats] = useState<StatsType | null>(null)
  const [selectedHero, setSelectedHero] = useState<{ id: number, name: string } | null>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }

    // fetchMetaHeroesAndStats().catch(console.error)
  }, [])

  // const fetchMetaHeroesAndStats = async () => {
  //   const [metaHeroes, stats] = await Promise.all([
  //     fetch('/api/mlbb/meta-heroes').then(res => res.json()),
  //     fetch('/api/mlbb/stats').then(res => res.json()),
  //   ])
  //
  //   if (metaHeroes.error || stats.error) {
  //     setError("There was an error fetching hero stats and metadata")
  //   }
  //
  //   setMetaHeroes(metaHeroes)
  //   setStats(stats)
  // }

  const fetchHeroDetails = useCallback(async (heroId: number | string, rank?: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const [heroInfoResponse, heroDetailsResponse] = await Promise.all([
        fetch(`/api/mlbb/heroes?id=${heroId}`).then(res => res.json()),
        fetch(`/api/mlbb/details?hero_id=${heroId}&rank=${rank ? rank : selectedRank}`).then(res => res.json())
      ])

      if (heroInfoResponse.error || heroDetailsResponse.error) {
        return setError("There is no info for this hero for this rank")
      }

      console.log("rank: ", heroDetailsResponse.counters.rank)
      setHeroInfo(heroInfoResponse)
      setHeroDetails(heroDetailsResponse)
      setSelectedHero({ id: Number(heroId), name: heroDetailsResponse.counters.name })

      // Update recent searches
      const newSearch = { name: heroDetailsResponse.counters.name, id: heroId }
      const updatedSearches = [newSearch, ...recentSearches.filter(h => h.id !== heroId)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    } catch (error) {
      console.error('Error fetching hero details:', error)
      setError('Failed to fetch hero details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [recentSearches, selectedRank])

  const handleRankChange = useCallback((newRank: number) => {
    setSelectedRank(newRank)
    if (selectedHero) {
      fetchHeroDetails(selectedHero.id, newRank).catch(console.error)
    }
  }, [selectedHero, fetchHeroDetails])


  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 max-w-6xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-yellow-400 drop-shadow-lg">Hero Finder</h1>
            <p className="text-xl text-blue-200">Discover the perfect hero for your team composition</p>
          </div>

          <motion.div
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}
              className="bg-blue-800 bg-opacity-50 rounded-lg p-8 shadow-2xl mb-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="w-full md:w-2/3">
                <SearchBar onHeroSelect={fetchHeroDetails} selectedHero={selectedHero}/>
              </div>
              <div className="w-full md:w-1/3">
                <RankSelector selectedRank={selectedRank} onRankChange={handleRankChange}/>
              </div>
            </div>

            <Tabs defaultValue="hero-info" className="space-y-6">
              <TabsList className="w-full bg-blue-700 bg-opacity-50">
                <TabsTrigger value="hero-info"
                             className="data-[state=active]:bg-blue-600 text-gray-400 data-[state=active]:text-white">Hero
                  Info</TabsTrigger>
              </TabsList>
              <TabsContent value="hero-info">
                {isLoading && <Loader className="mx-auto mt-8"/>}
                {error && (
                    <div className="bg-red-600 text-white p-4 rounded-md mt-4">
                      {error}
                    </div>
                )}
                {heroDetails && heroInfo && (
                    <HeroData details={heroDetails} info={heroInfo}/>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
              initial={{opacity: 0, y: 50}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.6}}
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