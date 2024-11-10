import { NextRequest, NextResponse } from 'next/server';
import { fetchMLBBData } from '@/lib/fetches';

export async function GET() {
  try {
    const response = await fetchMLBBData(undefined, undefined)

    return NextResponse.json({
      data: response,
      success: true,
    })
  } catch(error) {
    NextResponse.json({
      success: false,
      message: "Failed to fetch final data"
      }
    )
  }
}

export async function POST(request: NextRequest){
  const { hero_id, rank } = await request.json();

  try {
    const response = await fetchMLBBData(hero_id, rank)

    return NextResponse.json({
      data: response,
      success: true,
    })
  } catch(error) {
    NextResponse.json({
      success: false,
      message: "Failed to fetch final data (single)",
    })
  }
}