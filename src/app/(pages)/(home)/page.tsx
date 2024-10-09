'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { SearchBar } from "@/components/home/SearchBar"
import { Loader } from "@/components/Loader"
import { Footer } from "@/components/Footer"
import { HeroDetails as HeroDetailsType } from "@/lib/types"
import {HeroDetails} from "@/components/home/HeroDetails";

export default function Home() {
  const [heroDetails, setHeroDetails] = useState<HeroDetailsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHeroDetails = async (heroId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const [heroInfo, heroDetails] = await Promise.all([
        fetch(`/api/mlbb/heroes?id=${heroId}`).then(res => res.json()),
        fetch(`/api/mlbb/details?hero_id=${heroId}`).then(res => res.json())
      ])
      setHeroDetails(heroDetails)
    } catch (error) {
      console.error('Error fetching hero details:', error)
      setError('Failed to fetch hero details. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <Image
                src="/mlbb-logo.png"
                alt="Mobile Legends: Bang Bang Logo"
                width={200}
                height={100}
                className="mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">Hero Finder</h1>
            <p className="text-xl text-blue-200">Find the perfect hero for your team composition</p>
          </div>

          <SearchBar onHeroSelect={fetchHeroDetails} />

          {isLoading && <Loader className="mx-auto mt-8" />}

          {error && (
              <div className="bg-red-600 text-white p-4 rounded-md mt-4">
                {error}
              </div>
          )}

          {heroDetails && <HeroDetails {...heroDetails} />}
        </main>

        <Footer />
      </div>
  )
}