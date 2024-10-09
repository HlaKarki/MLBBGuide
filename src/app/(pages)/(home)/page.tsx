'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { SearchBar } from "@/components/home/SearchBar"
import { Loader } from "@/components/Loader"
import { HeroDetails as HeroDetailsType, HeroInfo } from "@/lib/types"
import { HeroData } from "@/components/home/HeroData"
import { RankSelector } from "@/components/home/RankSelector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, Sword, Shield } from 'lucide-react'

export default function Home() {
  const [heroDetails, setHeroDetails] = useState<HeroDetailsType | null>(null)
  const [heroInfo, setHeroInfo] = useState<HeroInfo | null>(null)
  const [selectedRank, setSelectedRank] = useState<number>(7) // Default to Mythic
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<Array<{ id: number; name: string }>>([])
  const [metaHeroes, setMetaHeroes] = useState<Array<{ id: number; name: string; winRate: number }>>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches')
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches))
    }

    // Fetch meta heroes (this would be an API call in a real application)
    fetchMetaHeroes()
  }, [])

  const fetchMetaHeroes = async () => {
    // This would be an actual API call in a real application
    const mockMetaHeroes = [
      { id: 1, name: "Ling", winRate: 54.2 },
      { id: 2, name: "Fanny", winRate: 53.8 },
      { id: 3, name: "Wanwan", winRate: 52.5 },
      { id: 4, name: "Beatrix", winRate: 51.9 },
      { id: 5, name: "Valentina", winRate: 51.7 },
    ]
    setMetaHeroes(mockMetaHeroes)
  }

  const fetchHeroDetails = async (heroId: number) => {
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
      const newSearch = { id: heroId, name: heroInfoResponse.name }
      const updatedSearches = [newSearch, ...recentSearches.filter(h => h.id !== heroId)].slice(0, 5)
      setRecentSearches(updatedSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
    } catch (error) {
      console.error('Error fetching hero details:', error)
      setError('Failed to fetch hero details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={"mb-8 h-[90vh] container mx-auto px-4 py-8 max-w-6xl"}>
      <div className="text-center">
        <Image
            src="https://akmweb.youngjoygame.com/web/gms/image/99279c21d903397cf56a5a5561c680f1.png"
            alt="Mobile Legends: Bang Bang Logo"
            width={200}
            height={100}
            className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Hero Finder</h1>
        <p className="text-xl text-blue-200">Find the perfect hero for your team composition</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <SearchBar onHeroSelect={fetchHeroDetails} />
        <RankSelector selectedRank={selectedRank} onRankChange={setSelectedRank} />
      </div>

      <Tabs defaultValue="hero-info" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="hero-info">Hero Info</TabsTrigger>
          <TabsTrigger value="recent-searches">Recent Searches</TabsTrigger>
          <TabsTrigger value="meta-heroes">Meta Heroes</TabsTrigger>
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Your last 5 hero searches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {recentSearches.map((hero) => (
                    <Button
                        key={hero.id}
                        variant="outline"
                        onClick={() => fetchHeroDetails(hero.id)}
                        className="w-full"
                    >
                      {hero.name}
                    </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="meta-heroes">
          <Card>
            <CardHeader>
              <CardTitle>Current Meta Heroes</CardTitle>
              <CardDescription>Top performing heroes in the current meta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {metaHeroes.map((hero) => (
                    <Card key={hero.id} className="bg-blue-800 text-white">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{hero.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-blue-200">Win Rate: {hero.winRate}%</p>
                        <Button
                            variant="secondary"
                            className="w-full mt-2"
                            onClick={() => fetchHeroDetails(hero.id)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Heroes</CardTitle>
            <Users className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-blue-200">+3 since last update</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
            <BarChart className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50.2%</div>
            <p className="text-xs text-blue-200">Across all ranks</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Banned</CardTitle>
            <Shield className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ling</div>
            <p className="text-xs text-blue-200">85% ban rate in Mythic+</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Win Rate</CardTitle>
            <Sword className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fanny</div>
            <p className="text-xs text-blue-200">54.8% win rate overall</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            View Tutorials
          </Button>
          <Button variant="outline">
            Join Community
          </Button>
          <Button variant="outline">
            Report Bug
          </Button>
        </div>
      </div>
    </div>
  )
}