import React from 'react'
import Image from 'next/image'
import { Sword, Shield, Users, TrendingUp, TrendingDown, MapPin, Tag } from 'lucide-react'
import { HeroDetails as HeroDetailsType, HeroInfo } from "@/lib/types"
import dataJSON from "@/lib/data/ids.json"
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

interface CombinedHeroProps {
  details: HeroDetailsType;
  info: HeroInfo;
}

export function HeroData({ details, info }: CombinedHeroProps) {
  const { counters, compatibilities } = details;


  const BriefStats = () => {
    return (
        <>
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
        </>
    )
  }
  return (
      <div className="bg-blue-800 bg-opacity-50 rounded-lg p-6 mt-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Image
              src={info.head_big}
              alt={info.title}
              width={200}
              height={200}
              className="rounded-lg shadow-md"
          />
          <div>
            <h2 className="text-3xl font-bold mb-2">{info.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {info.type.map((type, index) => {
                if (type && type !== "") {
                  return (
                      <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-sm flex items-center">
                    <Tag className="w-4 h-4 mr-1"/>
                        {type}
                    </span>
                  )
                }
              })}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {info.lane.map((lane, index) => {
                if (lane && lane !== "") {
                  return (
                      <span key={index} className="bg-green-600 text-white px-2 py-1 rounded text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-1"/>
                          {lane}
                    </span>
                  )
                }
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {info.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold">{stat}</div>
                    <div className="text-sm text-blue-200">
                      {['Durability', 'Offense', 'Ability Effects', 'Difficulty'][index]}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <BriefStats />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sword className="mr-2"/> Counters
            </h2>
            <Tabs defaultValue="best-against" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="best-against">Best Against</TabsTrigger>
                <TabsTrigger value="worst-against">Worst Against</TabsTrigger>
              </TabsList>
              <TabsContent value="best-against">
                <div className="p-4 bg-background rounded-b-lg border border-t-0">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2"/> {counters.name} counters these heroes very well
                  </h3>
                  <ul className="space-y-2">
                    {counters.counters.map((counter, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-black">
                            <Image src={counter.head} alt={`Hero ${counter.heroid}`} width={30} height={30}
                                   className="rounded-full mr-2"/>
                            <span>{getHeroName(counter.heroid)}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-400"/>
                            <span className="text-green-400">{(counter.hero_win_rate * 100).toFixed(1)}%</span>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="worst-against">
                <div className="p-4 bg-background rounded-b-lg border border-t-0">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingDown className="mr-2"/> {counters.name} is most countered by these heroes
                  </h3>
                  <ul className="space-y-2">
                    {counters.most_countered_by.map((counter, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-black">
                            <Image src={counter.head} alt={`Hero ${counter.heroid}`} width={30} height={30}
                                   className="rounded-full mr-2"/>
                            <span>{getHeroName(counter.heroid)}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingDown className="w-4 h-4 mr-1 text-red-400"/>
                            <span className="text-red-400">{(counter.hero_win_rate * 100).toFixed(1)}%</span>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="mr-2"/> Compatibilities
            </h2>
            <Tabs defaultValue="best-with" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="best-with">Best With</TabsTrigger>
                <TabsTrigger value="worst-with">Worst With</TabsTrigger>
              </TabsList>
              <TabsContent value="best-with">
                <div className="p-4 bg-background rounded-b-lg border border-t-0">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2"/> {counters.name} works best with these heroes
                  </h3>
                  <ul className="space-y-2">
                    {compatibilities.most_compatible.map((hero, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-black">
                            <Image src={hero.head} alt={`Hero ${hero.heroid}`} width={30} height={30}
                                   className="rounded-full mr-2"/>
                            <span>{getHeroName(hero.heroid)}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-400"/>
                            <span className="text-green-400">{(hero.increase_win_rate * 100).toFixed(1)}%</span>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="worst-with">
                <div className="p-4 bg-background rounded-b-lg border border-t-0">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingDown className="mr-2"/> {counters.name} does not work well with these heroes
                  </h3>
                  <ul className="space-y-2">
                    {compatibilities.least_compatible.map((hero, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <div className="flex items-center text-black">
                            <Image src={hero.head} alt={`Hero ${hero.heroid}`} width={30} height={30}
                                   className="rounded-full mr-2"/>
                            <span>{getHeroName(hero.heroid)}</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
                            <span className="text-red-400">{(hero.increase_win_rate * 100).toFixed(1)}%</span>
                          </div>
                        </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Hero Relationships</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Users className="mr-2" /> Works Well With
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {info.relation.works_well_with.heads.map((head, index) => (
                    <Image key={index} src={head} alt={`Hero ${index + 1}`} width={40} height={40} className="rounded-full" />
                ))}
              </div>
              <p className="text-sm">{info.relation.works_well_with.description}</p>
            </div>
            <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Sword className="mr-2" /> Strong Against
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {info.relation.strong_against.heads.map((head, index) => (
                    <Image key={index} src={head} alt={`Hero ${index + 1}`} width={40} height={40} className="rounded-full" />
                ))}
              </div>
              <p className="text-sm">{info.relation.strong_against.description}</p>
            </div>
            <div className="bg-blue-700 bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Shield className="mr-2" /> Weak Against
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {info.relation.weak_against.heads.map((head, index) => (
                    <Image key={index} src={head} alt={`Hero ${index + 1}`} width={40} height={40} className="rounded-full" />
                ))}
              </div>
              <p className="text-sm">{info.relation.weak_against.description}</p>
            </div>
          </div>
        </div>
      </div>
  )
}

function getHeroName(id: number) : string {
  return dataJSON["heroes"][id - 1]["name"] || "Unknown"
}