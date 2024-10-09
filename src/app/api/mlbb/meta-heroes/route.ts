// src/app/api/mlbb/meta-heroes/route.ts
import {NextResponse} from "next/server";
import {MetaHeroesQueryType} from "@/lib/types";
import {fetchStats} from "@/app/api/mlbb/stats/route";

export async function GET() {
  try {
    const data =  await fetchStats("main_hero_ban_rate", 5);

    const processedData = data.data.records.map((record: MetaHeroesQueryType) => {
      return {
        ban_rate: record.data.main_hero_ban_rate,
        win_rate: record.data.main_hero_win_rate,
        heroid: record.data.main_heroid,
        head: record.data.main_hero.data.head,
        name: record.data.main_hero.data.name,
      }
    })

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}