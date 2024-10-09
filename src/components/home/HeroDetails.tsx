import React from 'react'
import Image from 'next/image'
import { Sword, Users, Percent, TrendingUp, TrendingDown } from 'lucide-react'
import { HeroDetails as HeroDetailsType } from "@/lib/types"

export function HeroDetails({ counters, compatibilities }: HeroDetailsType) {
  return (
      <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6 mt-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sword className="mr-2" /> Counters
            </h2>
            <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Image
                    src={counters.head}
                    alt={counters.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                />
                <div className="text-right">
                  <p className="font-semibold">{counters.name}</p>
                  <p className="text-sm text-blue-200">Rank: {counters.rank}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-200">Appearance Rate</p>
                  <p className="font-semibold">{(counters.appearance_rate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Ban Rate</p>
                  <p className="font-semibold">{(counters.ban_rate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Win Rate</p>
                  <p className="font-semibold">{(counters.win_rate * 100).toFixed(2)}%</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2" /> Most Efficient Counters
              </h3>
              <ul className="space-y-2 mb-4">
                {counters.most_efficient_counters.map((counter, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image src={counter.head} alt={`Hero ${counter.heroid}`} width={30} height={30} className="rounded-full mr-2" />
                        <span>Hero {counter.heroid}</span>
                      </div>
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        <span className="text-green-400">{(counter.hero_win_rate * 100).toFixed(1)}%</span>
                      </div>
                    </li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingDown className="mr-2" /> Least Efficient Counters
              </h3>
              <ul className="space-y-2">
                {counters.least_efficient_counters.map((counter, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image src={counter.head} alt={`Hero ${counter.heroid}`} width={30} height={30} className="rounded-full mr-2" />
                        <span>Hero {counter.heroid}</span>
                      </div>
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 mr-1" />
                        <span className="text-red-400">{(counter.hero_win_rate * 100).toFixed(1)}%</span>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="mr-2" /> Compatibilities
            </h2>
            <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Image
                    src={compatibilities.head}
                    alt={compatibilities.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                />
                <div className="text-right">
                  <p className="font-semibold">{compatibilities.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-200">Appearance Rate</p>
                  <p className="font-semibold">{(compatibilities.appearance_rate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Ban Rate</p>
                  <p className="font-semibold">{(compatibilities.ban_rate * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Win Rate</p>
                  <p className="font-semibold">{(compatibilities.win_rate * 100).toFixed(2)}%</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingUp className="mr-2" /> Most Compatible
              </h3>
              <ul className="space-y-2 mb-4">
                {compatibilities.most_compatible.map((hero, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image src={hero.head} alt={`Hero ${hero.heroid}`} width={30} height={30} className="rounded-full mr-2" />
                        <span>Hero {hero.heroid}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-green-400">{(hero.increase_win_rate * 100).toFixed(1)}%</span>
                      </div>
                    </li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingDown className="mr-2" /> Least Compatible
              </h3>
              <ul className="space-y-2">
                {compatibilities.least_compatible.map((hero, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image src={hero.head} alt={`Hero ${hero.heroid}`} width={30} height={30} className="rounded-full mr-2" />
                        <span>Hero {hero.heroid}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        <span className="text-red-400">{(hero.increase_win_rate * 100).toFixed(1)}%</span>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  )
}