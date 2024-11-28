import { NextRequest, NextResponse } from 'next/server';
import { fetchMicroHeroData } from '@/lib/fetches';
import { MetaStatsType } from '@/lib/types';

export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const rank = request.nextUrl.searchParams.get('rank')!;
  const hero_count = Number(request.nextUrl.searchParams.get('hero_count'));
  const stat_type = request.nextUrl.searchParams.get(
    'stat_type'
  ) as MetaStatsType;

  try {
    const response = await fetchMicroHeroData(rank, stat_type, hero_count);
    return NextResponse.json({
      data: response.reverse(),
      success: true,
    });
  } catch (error) {
    NextResponse.json({
      success: false,
      message: 'Failed to fetch final data',
    });
  }
}
