'use client'

import { useGame } from '@/app/gameContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { FinalHeroDataType } from '@/lib/types'
import { Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { DndProvider, DragSourceMonitor, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { suggestHeroes } from '@/app/(pages)/rank-helper/recommendations';

const HERO_HEAD_SIZE: string = '40px'

type RoleType = {
  label: string
  hero_id: string
  hero_name: string
  head: string
  cursor: number
}

type RolesType = {
  team: RoleType[]
  enemy: RoleType[]
}

const HeroItem = ({ hero, onSelect }: { hero: FinalHeroDataType; onSelect: (hero: FinalHeroDataType) => void }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag<
    { hero: FinalHeroDataType }, // Drag Item Type
    void,                        // Drop Result Type
    { isDragging: boolean }      // Collected Props Type
  >(() => ({
    type: 'hero',
    item: { hero },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  drag(ref) // Pass the ref to the drag function


  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col justify-start items-center truncate w-[50px] mb-[5px] cursor-move',
        isDragging && 'opacity-50'
      )}
      onClick={() => onSelect(hero)}
    >
      <img
        className={`rounded-full w-[${HERO_HEAD_SIZE}] h-[${HERO_HEAD_SIZE}]`}
        src={hero.images.head}
        alt={hero.name}
      />
      <h4 className={'text-[0.6rem] flex mx-auto text-neutral-400'}>{hero.name}</h4>
    </div>
  )
}

const RoleSlot = ({ role, onDrop, onClick, isSelected }: {
  role: RoleType;
  onDrop: (hero: FinalHeroDataType, cursor: number) => void;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop<
    { hero: FinalHeroDataType }, // Drag Item Type
    void,                        // Drop Result Type
    { isOver: boolean; canDrop: boolean } // Collected Props Type
  >(() => ({
    accept: 'hero',
    drop: (item) => {
      onDrop(item.hero, role.cursor)
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  // Attach the drop function to the ref
  drop(ref)

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
        isOver ? 'border-primary ring-2 ring-primary' : 'border-neutral-200 dark:border-neutral-800',
        isSelected && 'ring-2 ring-blue-500',
      )}
      onClick={onClick}
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
    </div>
  )
}

export default function GameId() {
  const { state } = useGame()
  const router = useRouter()
  const [heroFilter, setHeroFilter] = useState<string>('Suggestion')
  const [selectedCursor, setSelectedCursor] = useState<number | null>(null)
  const [roles, setRoles] = useState<RolesType>({
    team: [
      { label: 'Jungle', hero_id: '', hero_name: '', head: '', cursor: 1 },
      { label: 'Mid Lane', hero_id: '', hero_name: '', head: '', cursor: 2 },
      { label: 'Gold Lane', hero_id: '', hero_name: '', head: '', cursor: 3 },
      { label: 'Exp Lane', hero_id: '', hero_name: '', head: '', cursor: 4 },
      { label: 'Roam', hero_id: '', hero_name: '', head: '', cursor: 5 },
    ],
    enemy: [
      { label: 'Jungle', hero_id: '', hero_name: '', head: '', cursor: 6 },
      { label: 'Mid Lane', hero_id: '', hero_name: '', head: '', cursor: 7 },
      { label: 'Gold Lane', hero_id: '', hero_name: '', head: '', cursor: 8 },
      { label: 'Exp Lane', hero_id: '', hero_name: '', head: '', cursor: 9 },
      { label: 'Roam', hero_id: '', hero_name: '', head: '', cursor: 10 },
    ],
  })

  if (!state.laneType || !state.gameType) {
    router.push('/rank-helper')
  }

  const { data: heroData, isLoading, isError, error } = useQuery({
    queryKey: ['newgame', state.gameType, state.laneType],
    queryFn: async () => {
      const response = await fetch('/api/mlbb/final')
      return response.json()
    },
    enabled: !!state.laneType,
  })

  const suggestedHeroes = useMemo(() => {
    if (!heroData || !heroData.data) return []
    const heroes = heroData.data as FinalHeroDataType[]
    const teamHeroIds = roles.team.map((role) => role.hero_id).filter(hero_id => hero_id !== '');
    const enemyHeroIds = roles.enemy.map((role) => role.hero_id).filter(hero_id => hero_id !== '');

    console.log("passing in: ", {teamHeroIds, enemyHeroIds});
    const suggestions = suggestHeroes(teamHeroIds, enemyHeroIds, [], heroes)
    console.log("suggested!: ", suggestions);
    return suggestions.map(suggestion => suggestion.hero)
  }, [heroData, heroFilter, roles])

  const filteredHeroes = useMemo(() => {
    if (!heroData || !heroData.data) return []
    const heroes = heroData.data as FinalHeroDataType[]
    return heroFilter === 'Suggestion'
      ? suggestedHeroes
      : heroes
        .filter(hero => hero.role.includes(heroFilter))
        .sort((a, b) => Number(a.hero_id) - Number(b.hero_id))
  }, [heroData, heroFilter])

  const handleRoleSelect = (hero: FinalHeroDataType, cursor: number) => {
    setRoles(prevState => {
      if (cursor <= 5) {
        return {
          ...prevState,
          team: prevState.team.map(role =>
            role.cursor === cursor
              ? { ...role, hero_id: hero.hero_id, hero_name: hero.name, head: hero.images.square }
              : role
          ),
        }
      } else {
        return {
          ...prevState,
          enemy: prevState.enemy.map(role =>
            role.cursor === cursor
              ? { ...role, hero_id: hero.hero_id, hero_name: hero.name, head: hero.images.square }
              : role
          ),
        }
      }
    })
    setSelectedCursor(null)
  }

  const handleHeroSelect = (hero: FinalHeroDataType) => {
    if (selectedCursor !== null) {
      handleRoleSelect(hero, selectedCursor)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={''}>
        <section className={'grid grid-cols-6 gap-4'}>
          <Card className="flex justify-start col-span-1 border-0">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-4">Team Picks</h2>
              <div className="grid grid-cols-1 gap-0">
                {roles.team.map(role => (
                  <RoleSlot
                    key={role.label}
                    role={role}
                    onDrop={handleRoleSelect}
                    onClick={() => setSelectedCursor(role.cursor)}
                    isSelected={selectedCursor === role.cursor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className={'col-span-4'}>
            <div className={'flex justify-evenly items-center overflow-x-auto'}>
              {['Suggestion', 'Roam', 'Exp Lane', 'Jungle', 'Mid Lane', 'Gold Lane'].map(filter => (
                <Button
                  key={filter}
                  onClick={() => setHeroFilter(filter)}
                  variant={heroFilter === filter ? 'default' : 'ghost'}
                >
                  {filter === 'Suggestion' && <Sparkles />}
                  <p className={"text-[12px]"}>{filter}</p>
                </Button>
              ))}
            </div>
            <div className={'h-[350px]'}>
              <div className={'mx-2 my-4 flex gap-x-[15px] flex-wrap max-h-[350px] overflow-y-auto'}>
                {heroData &&
                  filteredHeroes &&
                  filteredHeroes.map((hero: FinalHeroDataType) => (
                    <HeroItem key={hero.name} hero={hero} onSelect={handleHeroSelect} />
                  ))}
              </div>
            </div>
          </div>

          <Card className="flex justify-end col-span-1 border-0">
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold mb-4">Enemy Picks</h2>
              <div className="grid grid-cols-1 gap-0">
                {roles.enemy.map(role => (
                  <RoleSlot
                    key={role.label}
                    role={role}
                    onDrop={handleRoleSelect}
                    onClick={() => setSelectedCursor(role.cursor)}
                    isSelected={selectedCursor === role.cursor}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DndProvider>
  )
}