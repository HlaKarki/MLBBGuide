'use client';

import { useGame } from '@/app/gameContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FinalHeroDataType } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const HERO_HEAD_SIZE: string = '40px';

type rolesType = {
  team: {
    label: string;
    hero_name: string;
    head: string;
    cursor: number;
  }[];
  enemy: {
    label: string;
    hero_name: string;
    head: string;
    cursor: number;
  }[];
};

export default function GameId() {
  const { state } = useGame();
  const router = useRouter();
  const [heroFilter, setHeroFilter] = useState<string>('Suggestion');
  const [cursor, setCursor] = useState<number>(1);
  const [roles, setRoles] = useState<rolesType>({
    team: [
      { label: 'Jungle', hero_name: '', head: '', cursor: 1 },
      { label: 'Mid Lane', hero_name: '', head: '', cursor: 2 },
      { label: 'Gold Lane', hero_name: '', head: '', cursor: 3 },
      { label: 'Exp Lane', hero_name: '', head: '', cursor: 4 },
      { label: 'Roam', hero_name: '', head: '', cursor: 5 },
    ],
    enemy: [
      { label: 'Jungle', hero_name: '', head: '', cursor: 6 },
      { label: 'Mid Lane', hero_name: '', head: '', cursor: 7 },
      { label: 'Gold Lane', hero_name: '', head: '', cursor: 8 },
      { label: 'Exp Lane', hero_name: '', head: '', cursor: 9 },
      { label: 'Roam', hero_name: '', head: '', cursor: 10 },
    ],
  });

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
      : heroes
          .filter(hero => hero.role.includes(heroFilter))
          .sort((a, b) => Number(a.hero_id) - Number(b.hero_id));
  }, [heroData, heroFilter]);

  const handleRoleSelect = (hero: FinalHeroDataType) => {
    setRoles(prevState => {
      // Check if the current cursor corresponds to the `team` or `enemy` array
      if (cursor <= 5) {
        // Update the `team` array
        return {
          ...prevState,
          team: prevState.team.map(role =>
            role.cursor === cursor
              ? { ...role, hero_name: hero.name, head: hero.images.square }
              : role
          ),
        };
      } else {
        // Update the `enemy` array
        return {
          ...prevState,
          enemy: prevState.enemy.map(role =>
            role.cursor === cursor
              ? { ...role, hero_name: hero.name, head: hero.images.square }
              : role
          ),
        };
      }
    });
  };

  return (
    <div className={''}>
      {/* Game Custom Information */}

      {/* Game Replica Section */}
      <section className={'grid grid-cols-6 gap-4'}>
        {/* Team Selections */}
        <Card className="flex justify-start col-span-1 border-0">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold mb-4">Team Picks</h2>
            <div className="grid grid-cols-1 gap-0">
              {roles.team.map(role => (
                <div
                  key={role.label}
                  className={cn(
                    'relative overflow-hidden rounded-lg -border cursor-pointer transition-all duration-200 hover:shadow-md',
                    cursor === role.cursor
                      ? 'border-primary-ring-2-ring-primary'
                      : 'border-neutral-200 dark:border-neutral-800'
                  )}
                  onClick={() => setCursor(role.cursor)}
                >
                  <div className="h-[70px] w-full aspect-square relative">
                    <Image
                      src={role.head || '/unselected.webp'}
                      alt={`${role.hero_name || 'Unselected'} avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <h3 className="text-[10px] font-semibold text-white truncate">
                      {role.hero_name || 'Select Hero'}
                    </h3>
                    <p className="text-[9px] text-neutral-300">{role.label}</p>
                  </div>
                  <div
                    className={
                      cursor === role.cursor
                        ? 'absolute inset-0 bg-blue-700 opacity-20'
                        : ''
                    }
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hero Poll*/}
        <div className={'col-span-4'}>
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
          <div className={'h-[350px]'}>
            <div
              className={
                'mx-2 my-4 flex gap-x-[15px] flex-wrap max-h-[350px] overflow-y-auto'
              }
            >
              {heroData &&
                filteredHeroes &&
                filteredHeroes.map((hero: FinalHeroDataType) => {
                  return (
                    <button
                      key={hero.name}
                      className={
                        'flex flex-col justify-start items-center truncate w-[50px] mb-[5px]'
                      }
                      onClick={() => handleRoleSelect(hero)}
                    >
                      <img
                        className={`rounded-full w-[${HERO_HEAD_SIZE}] h-[${HERO_HEAD_SIZE}]`}
                        src={hero.images.head}
                        alt={hero.name}
                      />
                      <h4
                        className={
                          'text-[0.6rem] flex mx-auto text-neutral-400'
                        }
                      >
                        {hero.name}
                      </h4>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Enemy Selections */}
        <Card className="flex justify-end col-span-1 border-0">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold mb-4">Enemy Picks</h2>
            <div className="grid grid-cols-1 gap-0">
              {roles.enemy.map(role => (
                <div
                  key={role.label}
                  className={cn(
                    'relative overflow-hidden rounded-lg -border cursor-pointer transition-all duration-200 hover:shadow-md',
                    cursor === role.cursor
                      ? 'border-primary-ring-2-ring-primary'
                      : 'border-neutral-200 dark:border-neutral-800'
                  )}
                  onClick={() => setCursor(role.cursor)}
                >
                  <div className="h-[70px] w-full aspect-square relative">
                    <Image
                      src={role.head || '/unselected.webp'}
                      alt={`${role.hero_name || 'Unselected'} avatar`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <h3 className="text-[10px] font-semibold text-white truncate">
                      {role.hero_name || 'Select Hero'}
                    </h3>
                    <p className="text-[9px] text-neutral-300">{role.label}</p>
                  </div>
                  <div
                    className={
                      cursor === role.cursor
                        ? 'absolute inset-0 bg-blue-700 opacity-20'
                        : ''
                    }
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
