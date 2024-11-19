import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsonData from '@/lib/data/ids.json';
import { RanksType } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getHeroNames(): string[] {
  return jsonData.heroes.map(hero => hero.name);
}

export function getHeroName(id: string | number): string {
  return (
    jsonData.heroes.find(hero => hero.id === Number(id))?.name || 'unknown'
  );
}

export function getHeroNameURL(id: string | number): string {
  const heroName =
    jsonData.heroes.find(hero => hero.id === Number(id))?.name || 'unknown';
  return encodeURIComponent(heroName.replace(/\s+/g, '-').toLowerCase());
}

export function replaceHyphenInHeroName(name: string): string {
  return name.replace(/-+/g, ' ');
}

export function getHeroId(name: string): number | undefined {
  // Convert name to lowercase and remove all non-alphanumeric characters
  const normalizedSearchName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  return (
    jsonData.heroes.find(
      hero =>
        hero.name.toLowerCase().replace(/[^a-z0-9]/g, '') ===
        normalizedSearchName
    )?.id || undefined
  );
}

export function getRankId(rank: string): number {
  const decodedRank = decodeURIComponent(rank); // Decode any URL-encoded rank
  return jsonData.rankId[decodedRank as keyof typeof jsonData.rankId];
}

export function getRanks(): RanksType[] {
  return Object.values(jsonData.rank) as RanksType[];
}
