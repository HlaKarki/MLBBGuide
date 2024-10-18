// src/app/api/mlbb/heroes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {fetchHeroInfoData, processData} from "@/app/api/mlbb/fetches";

export async function GET(request: NextRequest) {
  const heroId = request.nextUrl.searchParams.get('id') || null;

  const data = await fetchHeroInfoData(heroId);
  const processedData = processData(data);

  return NextResponse.json(heroId ? Object.values(processedData)[0] : processedData);

}