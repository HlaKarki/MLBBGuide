// src/app/api/mlbb/details/route.ts
import { NextRequest, NextResponse } from "next/server";
import dataJSON from "@/lib/data/ids.json";
import {fetchHeroDetails} from "@/app/api/mlbb/fetches";

type sub_hero_types = {
  heroid: string,
  hero: {
    data: { head: string }
  },
  hero_win_rate: string,
  increase_win_rate: string
}

export async function GET(request: NextRequest) {
  const hero_id = request.nextUrl.searchParams.get("id");
  const rank = request.nextUrl.searchParams.get("rank");

  if (!hero_id) {
    return NextResponse.json({ error: "hero_id is required" }, { status: 400 });
  }

  try {
    const [counterResponse, compatibilityResponse] = await Promise.all([
      fetchHeroDetails("0", hero_id, rank),
      fetchHeroDetails("1", hero_id, rank)
    ]);

    const counters = counterResponse.data.records[0].data
    const compatibilities = compatibilityResponse.data.records[0].data

    const processedData = {
      counters: {
        rank: getRank(counters.bigrank),
        head: counters.main_hero.data.head,
        name: counters.main_hero.data.name,
        appearance_rate: counters.main_hero_appearance_rate,
        ban_rate: counters.main_hero_ban_rate,
        win_rate: counters.main_hero_win_rate,
        counters: counters.sub_hero.map((hero: sub_hero_types) => ({
          heroid: hero.heroid,
          head: hero.hero.data.head,
          hero_win_rate: hero.hero_win_rate,
          increase_win_rate: hero.increase_win_rate
        })),
        most_countered_by: counters.sub_hero_last.map((hero: sub_hero_types) => ({
          heroid: hero.heroid,
          head: hero.hero.data.head,
          hero_win_rate: hero.hero_win_rate,
          increase_win_rate: hero.increase_win_rate
        })),
      },
      compatibilities: {
        rank: getRank(compatibilities.bigrank),
        head: compatibilities.main_hero.data.head,
        name: compatibilities.main_hero.data.name,
        appearance_rate: compatibilities.main_hero_appearance_rate,
        ban_rate: compatibilities.main_hero_ban_rate,
        win_rate: compatibilities.main_hero_win_rate,
        most_compatible: compatibilities.sub_hero.map((hero: sub_hero_types) => ({
          heroid: hero.heroid,
          head: hero.hero.data.head,
          hero_win_rate: hero.hero_win_rate,
          increase_win_rate: hero.increase_win_rate
        })),
        least_compatible: compatibilities.sub_hero_last.map((hero: sub_hero_types) => ({
          heroid: hero.heroid,
          head: hero.hero.data.head,
          hero_win_rate: hero.hero_win_rate,
          increase_win_rate: hero.increase_win_rate
        })),
      }
    }
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
  }
}


function getRank (rankId: string) {
  return dataJSON.rank[rankId as keyof typeof dataJSON.rank] || "Unknown";
}