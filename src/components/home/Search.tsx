'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { getHeroNames } from '@/lib/utils';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export function HeroSearch() {
  const [openValve, setOpenValve] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const heroes = useMemo(() => {
    return getHeroNames().filter(
      hero =>
        searchTerm &&
        hero.trim().toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="relative">
      <Button
        className="border-violet-500 text-violet-400 hover:bg-violet-950"
        variant="outline"
        size="lg"
      >
        <Search className="mr-2" />
        <Input
          placeholder="Search heroes"
          className="border-0 focus-visible:ring-0 bg-transparent text-violet-400 placeholder:text-violet-400/70"
          value={searchTerm}
          onFocus={() => setOpenValve(true)}
          onBlur={() => setOpenValve(false)}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Button>
      {openValve && heroes.length > 0 && (
        <div className="max-h-[300px] bg-gray-900/10 backdrop-blur-sm absolute mt-2 w-full border border-violet-500/20 rounded-lg shadow-lg overflow-y-auto">
          {heroes.map((hero, index) => (
            <Link
              key={index}
              href="#"
              className="block px-4 py-2 text-violet-400 hover:bg-violet-950/50 transition-colors duration-150"
            >
              {hero}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
