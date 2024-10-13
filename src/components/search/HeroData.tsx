import React from 'react'
import Image from 'next/image'
import { Sword, Shield, Users, TrendingUp, TrendingDown, MapPin, Tag, Info } from 'lucide-react'
import { HeroDetails as HeroDetailsType, HeroInfo } from "@/lib/types"
import dataJSON from "@/lib/data/ids.json"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface CombinedHeroProps {
  details: HeroDetailsType;
  info: HeroInfo;
}

export default function HeroData({ details, info }: CombinedHeroProps) {
  const { counters, compatibilities } = details;

  const BriefStats = () => (
      <Card className="bg-gradient-to-br from-indigo-900 to-indigo-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{counters.name}</CardTitle>
          <Image
              src={counters.head}
              alt={counters.name}
              width={60}
              height={60}
              className="rounded-full border-2 border-indigo-300"
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Rank" value={counters.rank} icon={<Info className="h-4 w-4" />} />
            <Stat label="Appearance" value={`${(counters.appearance_rate * 100).toFixed(1)}%`} icon={<Users className="h-4 w-4" />} />
            <Stat label="Win Rate" value={`${(counters.win_rate * 100).toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} />
          </div>
        </CardContent>
      </Card>
  )

  const Stat = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
      <div className="flex flex-col">
        <div className="text-sm font-medium text-indigo-300 flex items-center">
          {icon}
          <span className="ml-1">{label}</span>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
  )

  const HeroList = ({ heroes, type }: { heroes: any[], type: 'counter' | 'compatibility' }) => (
      <ul className="space-y-2">
        {heroes.map((hero, index) => (
            <li key={index} className="flex items-center justify-between bg-white bg-opacity-10 p-2 rounded-lg">
              <div className="flex items-center">
                <Image src={hero.head} alt={`Hero ${hero.heroid}`} width={40} height={40} className="rounded-full mr-2" />
                <span>{getHeroName(hero.heroid)}</span>
              </div>
              <div className="flex items-center">
                {type === 'counter' ? (
                    <Sword className={`w-4 h-4 mr-1 ${hero.hero_win_rate > 0.5 ? 'text-green-400' : 'text-red-400'}`} />
                ) : (
                    hero.increase_win_rate > 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                    ) : (
                        <TrendingDown className="w-4 h-4 mr-1 text-red-400" />
                    )
                )}
                <span className={
                  type === 'counter'
                      ? (hero.hero_win_rate > 0.5 ? 'text-green-400' : 'text-red-400')
                      : (hero.increase_win_rate > 0 ? 'text-green-400' : 'text-red-400')
                }>
              {type === 'counter'
                  ? `${(hero.hero_win_rate * 100).toFixed(1)}%`
                  : `${hero.increase_win_rate > 0 ? '+' : ''} ${(hero.increase_win_rate * 100).toFixed(1)}%`
              }
            </span>
              </div>
            </li>
        ))}
      </ul>
  )

  return (
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-lg p-6 mt-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start gap-6 mb-8">
          <Image
              src={info.head_big}
              alt={info.title}
              width={300}
              height={300}
              className="rounded-lg shadow-lg border-4 border-indigo-300"
          />
          <div className="flex-grow">
            <h2 className="text-4xl font-bold mb-4 text-indigo-200">{info.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {info.speciality.concat(info.lane).filter(Boolean).map((type, index) => (
                  <span key={index} className="bg-indigo-700 text-indigo-100 px-3 py-1 rounded-full text-sm flex items-center">
                {type.includes('Lane') ? <MapPin className="w-4 h-4 mr-1"/> : <Tag className="w-4 h-4 mr-1"/>}
                    {type}
              </span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
              {Object.entries(info.abilities).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="text-lg font-semibold text-indigo-300">{stat}</div>
                    <Progress value={Number(value) * 10} className="h-2 w-full" />
                    <div className="text-2xl font-bold">{value}</div>
                  </div>
              ))}
            </div>
            <BriefStats />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className={"dark"}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Sword className="mr-2"/> Counters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="best-against" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="best-against">Best Against</TabsTrigger>
                  <TabsTrigger value="worst-against">Worst Against</TabsTrigger>
                </TabsList>
                <TabsContent value="best-against">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2"/> {counters.name} counters these heroes
                  </h3>
                  <HeroList heroes={counters.counters} type="counter" />
                </TabsContent>
                <TabsContent value="worst-against">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingDown className="mr-2"/> {counters.name} is countered by these heroes
                  </h3>
                  <HeroList heroes={counters.most_countered_by} type="counter" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card className={"dark"}>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="mr-2"/> Compatibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="best-with" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="best-with">Best With</TabsTrigger>
                  <TabsTrigger value="worst-with">Worst With</TabsTrigger>
                </TabsList>
                <TabsContent value="best-with">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="mr-2"/> {counters.name} works best with these heroes
                  </h3>
                  <HeroList heroes={compatibilities.most_compatible} type="compatibility" />
                </TabsContent>
                <TabsContent value="worst-with">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingDown className="mr-2"/> {counters.name} works poorly with these heroes
                  </h3>
                  <HeroList heroes={compatibilities.least_compatible} type="compatibility" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className={"dark"}>
          <CardHeader>
            <CardTitle className="text-2xl">Hero Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['works_well_with', 'strong_against', 'weak_against'].map((relation) => (
                  <div key={relation} className="bg-indigo-800 bg-opacity-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      {relation === 'works_well_with' && <Users className="mr-2" />}
                      {relation === 'strong_against' && <Sword className="mr-2" />}
                      {relation === 'weak_against' && <Shield className="mr-2" />}
                      {relation.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {info.relation[relation as keyof typeof info.relation].heads.map((head, index) => (
                          <Image key={index} src={head} alt={`Hero ${index + 1}`} width={40} height={40} className="rounded-full border-2 border-indigo-300" />
                      ))}
                    </div>
                    <p className="text-sm text-indigo-200">{info.relation[relation as keyof typeof info.relation].description}</p>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}

function getHeroName(id: number): string {
  return dataJSON["heroes"] && dataJSON["heroes"][id - 1] && dataJSON.heroes[id-1]["name"] || "N/A"
}