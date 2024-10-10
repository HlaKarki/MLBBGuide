// src/app/api/mlbb/stats/route.ts
import { NextResponse } from "next/server";

const baseUrl = process.env.MLBB_API_BASE_URL || "";
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const secondId = process.env.MLBB_SECOND_ID_META_HEROES || "/2756567";

export async function fetchStats(sortField: string, count: number) {
  const url = baseUrl + firstId + secondId;
  const payload = {
    pageSize: count,
    filters: [
      { field: "bigrank", operator: "eq", value: "101" },
      { field: "match_type", operator: "eq", value: "0" }
    ],
    sorts: [
      { data: { field: sortField, order: "desc" }, type: "sequence" },
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

export async function GET() {
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