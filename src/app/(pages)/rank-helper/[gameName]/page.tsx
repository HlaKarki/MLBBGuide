'use client';

import { useGame } from '@/app/gameContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinalHeroDataType } from '@/lib/types';
import { Sparkles } from 'lucide-react';

const HERO_HEAD_SIZE: string = "40px"

export default function GameId() {
  const { state } = useGame();
  const router = useRouter();
  const [heroFilter, setHeroFilter] = useState<string>('Suggestion');

  if (!state.laneType || !state.gameType) {
    router.push('/rank-helper');
  }

  const {
    data: heroData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['newgame', state.gameType, state.laneType],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final');
      return response.json();
    },
    enabled: !!state.laneType,
  });

  const filteredHeroes = useMemo(() => {
    if (!heroData || !heroData.data) return [];
    const heroes = heroData.data as FinalHeroDataType[];
    return heroFilter === 'Suggestion'
      ? heroes
      : heroes.filter(hero => hero.role.includes(heroFilter)).sort((a, b) => Number(a.hero_id) - Number(b.hero_id));
  }, [heroData, heroFilter]);

  const roles = {
    team: [
      { label: 'Jungle', hero_name: '', head: '' },
      { label: 'Mid Lane', hero_name: '', head: '' },
      { label: 'Gold Lane', hero_name: '', head: '' },
      { label: 'Exp Lane', hero_name: '', head: '' },
      { label: 'Roam', hero_name: '', head: '' },
    ],
    enemy: [
      { label: 'Jungle', hero_name: '', head: '' },
      { label: 'Mid Lane', hero_name: '', head: '' },
      { label: 'Gold Lane', hero_name: '', head: '' },
      { label: 'Exp Lane', hero_name: '', head: '' },
      { label: 'Roam', hero_name: '', head: '' },
    ],
  };

  return (
    <div className={''}>
      {/* Game Custom Information */}

      {/* Game Replica Section */}
      <section className={'grid grid-cols-6 gap-4'}>
        {/* Team Selections */}
        <div className={'col-span-1'}>
          <h3 className={'mb-5'}>Team Picks</h3>
          <div className={'flex flex-col gap-4'}>
            {roles.team.map(role => {
              return (
                <div key={role.label}>
                  <img src={role.head} />
                  <h4>{role.hero_name}</h4>
                  <h3>{role.label}</h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Poll*/}
        <div className={'col-span-4'}>
          <h3>Hero Selection</h3>
          <div className={'flex items-center'}>
            <div className={'flex overflow-x-auto'}>
              <Button
                onClick={() => setHeroFilter('Suggestion')}
                variant={heroFilter === 'Suggestion' ? 'default' : 'ghost'}
              >
                <Sparkles />
                Suggestion
              </Button>
              <Button
                onClick={() => setHeroFilter('Roam')}
                variant={heroFilter === 'Roam' ? 'default' : 'ghost'}
              >
                Roam
              </Button>
              <Button
                onClick={() => setHeroFilter('Exp Lane')}
                variant={heroFilter === 'Exp Lane' ? 'default' : 'ghost'}
              >
                Exp Lane
              </Button>
              <Button
                onClick={() => setHeroFilter('Jungle')}
                variant={heroFilter === 'Jungle' ? 'default' : 'ghost'}
              >
                Jungle
              </Button>
              <Button
                onClick={() => setHeroFilter('Mid Lane')}
                variant={heroFilter === 'Mid Lane' ? 'default' : 'ghost'}
              >
                Mid Lane
              </Button>
              <Button
                onClick={() => setHeroFilter('Gold Lane')}
                variant={heroFilter === 'Gold Lane' ? 'default' : 'ghost'}
              >
                Gold Lane
              </Button>
            </div>
          </div>
          <div className={"h-[300px]"}>
            <div className={'px-2 py-4 flex gap-x-[15px] flex-wrap max-h-[300px] overflow-y-auto'}>
              {heroData &&
                filteredHeroes &&
                filteredHeroes.map((hero: FinalHeroDataType) => {
                  return (
                    <div
                      key={hero.name}
                      className={'flex flex-col justify-start items-center truncate w-[50px] mb-[5px]'}
                    >
                      <img
                        className={`rounded-full w-[${HERO_HEAD_SIZE}] h-[${HERO_HEAD_SIZE}]`}
                        src={hero.images.head}
                        alt={hero.name}
                      />
                      <h4 className={'text-[0.6rem] flex mx-auto text-neutral-400'}>{hero.name}</h4>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

        {/* Enemy Selections */}
        <div className={'col-span-1'}>
          <h3 className={'mb-5'}>Enemy Picks</h3>
          <div className={'flex flex-col gap-4'}>
            {roles.enemy.map(role => {
              return (
                <div key={role.label}>
                  <img src={role.head} />
                  <h4>{role.hero_name}</h4>
                  <h3>{role.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
