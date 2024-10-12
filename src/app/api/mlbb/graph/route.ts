// src/app/api/mlbb/graph/route.ts
import {NextRequest, NextResponse} from "next/server";
import {fetchGraph} from "@/app/api/mlbb/fetches";

export async function GET(request: NextRequest) {
  const hero_id = request.nextUrl.searchParams.get("id") || "-1"
  const rank = request.nextUrl.searchParams.get("rank") || "7"
  const period = Number(request.nextUrl.searchParams.get("period")) || 7
  try {
    const data =  await fetchGraph(hero_id, period, rank).then(res => res.data.records[0]);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}