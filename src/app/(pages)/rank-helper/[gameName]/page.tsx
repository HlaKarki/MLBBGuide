'use client'

import { useGame } from '@/app/gameContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinalHeroDataType } from '@/lib/types';

export default function GameId() {
  const { state } = useGame();
  const router = useRouter();
  const [heroFilter, setHeroFilter] = useState<string>('All');

  if (!state.laneType || !state.gameType) {
    router.push('/rank-helper')
  }

  const { data: heroData, isLoading, isError, error } = useQuery({
    queryKey: ['newgame', state.gameType, state.laneType],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final')
      return response.json()
    },
    enabled: !!state.laneType
  })

  console.log({
    gameType: state.gameType,
    laneType: state.laneType
  });

  const roles = {
    "team": [
      { label: 'Jungle', hero_name: '', head: '' },
      { label: 'Mid Lane', hero_name: '', head: '' },
      { label: 'Gold Lane', hero_name: '', head: '' },
      { label: 'Exp Lane', hero_name: '', head: '' },
      { label: 'Roam', hero_name: '', head: '' },
    ],
    "enemy": [
      { label: 'Jungle', hero_name: '', head: '' },
      { label: 'Mid Lane', hero_name: '', head: '' },
      { label: 'Gold Lane', hero_name: '', head: '' },
      { label: 'Exp Lane', hero_name: '', head: '' },
      { label: 'Roam', hero_name: '', head: '' },
    ],
  }

  return (
    <div className={""}>
      {/* Game Custom Information */}

      {/* Game Replica Section */}
      <section className={"grid grid-cols-6 gap-4"}>
        {/* Team Selections */}
        <div className={"col-span-1 border-2 border-red-700"}>
          <h3 className={"mb-5"}>Team Picks</h3>
          <div className={"flex flex-col gap-4"}>
            {roles.team.map((role) => {
              return (
                <div key={role.label} className={"w-[300px]"}>
                  <img src={role.head} />
                  <h4>{role.hero_name}</h4>
                  <h3>{role.label}</h3>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hero Poll*/}
        <div className={"col-span-4 border-2 border-red-700"}>
          <h3>Hero Selection</h3>
          <div className={"flex items-center"}>
            <ArrowRightLeft />
            <div className={"flex overflow-x-auto"}>
              <Button variant={heroFilter === "All" ? "default" : "ghost"}>All</Button>
              <Button variant={heroFilter === "Tank" ? "default" : "ghost"}>Tank</Button>
              <Button variant={heroFilter === "Fighter" ? "default" : "ghost"}>Fighter</Button>
              <Button variant={heroFilter === "Assassin" ? "default" : "ghost"}>Assassin</Button>
              <Button variant={heroFilter === "Mage" ? "default" : "ghost"}>Mage</Button>
              <Button variant={heroFilter === "Marksman" ? "default" : "ghost"}>Marksman</Button>
              <Button variant={heroFilter === "Support" ? "default" : "ghost"}>Support</Button>
            </div>
          </div>
          <div className={"flex gap-x-8 flex-wrap"}>
            {heroData && heroData.data.map((hero: FinalHeroDataType) => {
              return (
                <div key={hero.name} className={"flex flex-col items-center truncate w-[50px]"}>
                  <img className={"rounded-full w-10 h-10"} src={hero.images.head} alt={hero.name} />
                  <h4 className={"flex mx-auto"}>{hero.name}</h4>
                </div>
              )
            })
            }
          </div>
        </div>

        {/* Enemy Selections */}
        <div className={"col-span-1 border-2 border-red-700"}>
          <h3 className={"mb-5"}>Enemy Picks</h3>
          <div className={"flex flex-col gap-4"}>
            {roles.enemy.map((role) => {
              return (
                <div key={role.label} className={'w-[300px]'}>
                  <img src={role.head} />
                  <h4>{role.hero_name}</h4>
                  <h3>{role.label}</h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}