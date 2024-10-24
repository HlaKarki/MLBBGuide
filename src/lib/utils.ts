import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsonData from "@/lib/data/ids.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHeroName(id: string | number): string {
  return jsonData.heroes.find(hero => hero.id === Number(id))?.name || "unknown";
}

export function getHeroId(name: string) : number | undefined {
  return jsonData.heroes.find(hero => hero.name === name)?.id || undefined
}