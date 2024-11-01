import { NextResponse } from 'next/server';
import { fetchMLBBData } from '@/lib/fetches';

export async function GET() {
  try {
    const response = await fetchMLBBData()

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