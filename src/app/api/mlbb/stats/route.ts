// src/app/api/mlbb/stats/route.ts
import {NextRequest, NextResponse} from "next/server";
import {fetchHeroDetails, fetchHeroInfoData, fetchStats, processData} from "@/app/api/mlbb/fetches";
import {MetaHeroesQueryType} from "@/lib/types";
import { getRankId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const all = Number(request.nextUrl.searchParams.get("hla"))
  const rank = request.nextUrl.searchParams.get("rank") || 'All'

  if (all) {
    const [metaStats, heroDetails, pickRate] = await Promise.all([
      await fetchStatsTemp(rank).then(data => {
        return data.data.records.map((record: MetaHeroesQueryType) => {
          return {
            ban_rate: record.data.main_hero_ban_rate,
            win_rate: record.data.main_hero_win_rate,
            heroid: record.data.main_heroid,
            head: record.data.main_hero.data.head,
            name: record.data.main_hero.data.name,
          }
        })
      })
      .catch(error => {
        console.error("Error fetching meta stats:", error);
        return []; // Fallback in case of failure
      }),
      await fetchHeroInfoData().then(response => processData(response))
        .catch(error => {
          console.error("Error fetching meta stats:", error);
          return []; // Fallback in case of failure
        }),
      await fetchHeroDetails("0", null, rank, true).then(data => {
        return data.data.records.map((record: {data: { main_hero_appearance_rate: string }}) => {
          return record.data.main_hero_appearance_rate
        })
      })
        .catch(error => {
          console.error("Error fetching meta stats:", error);
          return []; // Fallback in case of failure
        })
    ])

    const data = combineData(metaStats, heroDetails, pickRate)
    return NextResponse.json(data)
  }

  try {
    const [banRateData, winRateData, pickRateData] = await Promise.all([
      fetchStats("main_hero_ban_rate", 1),
      fetchStats("main_hero_win_rate", 1),
      fetchStats("main_hero_appearance_rate", 1)
    ]);

    const mostBannedHero = banRateData.data.records[0];
    const mostWinningHero = winRateData.data.records[0];
    const mostPickedHero = pickRateData.data.records[0];

    return NextResponse.json({
      totalHeroes: banRateData.data.total,
      mostWin: mostWinningHero.data.main_hero.data.name,
      mostWinHead: mostWinningHero.data.main_hero.data.head,
      mostBanned: mostBannedHero.data.main_hero.data.name,
      mostBannedHead: mostBannedHero.data.main_hero.data.head,
      mostPicked: mostPickedHero.data.main_hero.data.name,
      mostPickedHead: mostPickedHero.data.main_hero.data.head,
      banRate: mostBannedHero.data.main_hero_ban_rate,
      winRate: mostWinningHero.data.main_hero_win_rate,
      pickRate: mostPickedHero.data.main_hero_appearance_rate,
    });

  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}

async function fetchStatsTemp(rank?: string) {
  const baseUrl = process.env.MLBB_API_BASE_URL || "";
  const firstId = process.env.MLBB_FIRST_ID || "/2669606";
  const meta_heroes = process.env.MLBB_SECOND_ID_META_HEROES || "/2756567";

  const url = baseUrl + firstId + meta_heroes;
  const payload = {
    pageSize: 200,
    filters: [
      { field: "bigrank", operator: "eq", value: getRankId(rank || "All") },
      { field: "match_type", operator: "eq", value: "0" }
    ],
    sorts: [
      { data: { field: "main_heroid", order: "desc" }, type: "sequence" }
    ],
    pageIndex: 1,
    fields: [
      "main_hero",
      "main_hero_ban_rate",
      "main_hero_win_rate",
      "main_heroid",
      "main_hero_appearance_rate"
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

interface MetaStat {
  ban_rate: number;
  win_rate: number;
  heroid: number;
  head: string;
  name: string;
}

function combineData(
    metaStats: any,
    heroDetails: any,
    pickRate: any
)
{
  return metaStats.map((meta: MetaStat, index: number) => {
    const detail = heroDetails[index.toString()];
    return {
      id: meta.heroid.toString(),
      name: meta.name,
      head: meta.head,
      win_rate: meta.win_rate,
      ban_rate: meta.ban_rate,
      pick_rate: pickRate[index],
      speciality: detail.speciality,
      abilities: {
        Durability: parseInt(detail.abilities.Durability),
        Offense: parseInt(detail.abilities.Offense),
        "Ability Effects": parseInt(detail.abilities["Ability Effects"]),
        Difficulty: parseInt(detail.abilities.Difficulty)
      },
      lanes: detail.lane.filter((lane: string) => lane !== "")
    };
  });
}