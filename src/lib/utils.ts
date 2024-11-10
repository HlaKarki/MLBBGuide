import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsonData from "@/lib/data/ids.json"
import { RanksType } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHeroName(id: string | number): string {
  return jsonData.heroes.find(hero => hero.id === Number(id))?.name || "unknown";
}

export function getHeroNameURL(id: string | number): string {
  return jsonData.heroes.find(hero => hero.id === Number(id))?.name.replace(/\s+/g, '-') || "unknown";
}

export function replaceHyphenInHeroName(name: string): string {
  return name.replace(/-+/g, ' ')
}

export function getHeroId(name: string) : number | undefined {
  return jsonData.heroes.find(hero => hero.name === (name.replace(/\-+/g, ' ')))?.id || undefined
}

export function getRole(apiRole: string) {
  return jsonData.roles[apiRole as keyof typeof jsonData.roles]
}

export function getRankId(rank: string): number {
  const decodedRank = decodeURIComponent(rank); // Decode any URL-encoded rank
  return jsonData.rankId[decodedRank as keyof typeof jsonData.rankId]
}

export function getRanks(): RanksType[] {
  return Object.values(jsonData.rank) as RanksType[]
}