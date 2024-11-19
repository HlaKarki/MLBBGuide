'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getHeroNameURL } from '@/lib/utils';

type Hero = {
  name: string;
  hero_id: string;
  head: string;
  pick_rate: string;
  ban_rate: string;
  win_rate: string;
};

type APIMetaHeroDataType = {
  data: Hero[];
  success: boolean;
  error?: any;
};

export function HeroSearch() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: heroes } = useQuery<APIMetaHeroDataType>({
    queryKey: ['heroes'],
    queryFn: async () => {
      const res = await fetch('/api/mlbb/search');
      return res.json();
    },
  });

  const filteredHeroes = useMemo(() => {
    if (!heroes) return [];
    return heroes.data.filter(hero =>
      hero.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [heroes, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400" />
        <Input
          placeholder="Search heroes"
          className="w-full pl-10 pr-4 py-2 border-violet-500 bg-transparent text-violet-400 placeholder:text-violet-400/70 focus:ring-2 focus:ring-violet-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && heroes && filteredHeroes.length > 0 && (
        <div className="max-h-[300px] bg-gray-900/95 backdrop-blur-sm absolute mt-2 w-full border border-violet-500/20 rounded-lg shadow-lg overflow-y-auto z-10">
          {filteredHeroes.map(hero => (
            <HeroListItem key={hero.hero_id} hero={hero} />
          ))}
        </div>
      )}
    </div>
  );
}

function HeroListItem({ hero }: { hero: Hero }) {
  return (
    <Link
      href={'/search?hero=' + getHeroNameURL(hero.hero_id)}
      className="block px-4 py-2 text-violet-400 hover:bg-violet-950/50 transition-colors duration-150"
    >
      <div className="flex items-center space-x-2 justify-between">
        <div className="flex items-center space-x-2">
          <img
            className="w-8 h-8 rounded-full"
            src={hero.head}
            alt={`${hero.name}'s avatar`}
          />
          <h3 className="font-medium">{hero.name}</h3>
        </div>
        <div className="flex space-x-4">
          <StatDisplay label="Win" value={hero.win_rate} />
          <StatDisplay
            className={'hidden sm:flex lg:hidden xl:flex'}
            label="Ban"
            value={hero.ban_rate}
          />
          <StatDisplay
            className={'hidden md:flex'}
            label="Pick"
            value={hero.pick_rate}
          />
        </div>
      </div>
    </Link>
  );
}

function StatDisplay({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  const percentage = (Number(value) * 100).toFixed(1);
  return (
    <div className={'flex flex-col items-center ' + className}>
      <p className="text-xs text-violet-500">{label}</p>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  );
}
