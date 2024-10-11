// src/app/api/mlbb/stats/route.ts
import {NextRequest, NextResponse} from "next/server";
import {fetchStats} from "@/app/api/mlbb/fetches";

export async function GET(request: NextRequest) {
  const all = Number(request.nextUrl.searchParams.get("hla"))

  if (all) {
    // fetch meta stats
    // fetch hero lane + type data "/api/mlbb/heroes

    return NextResponse.json({message: "ok"})
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

