import { NextResponse } from 'next/server';
import { fetchMicroHeroData } from '@/lib/fetches';

export async function GET() {
  try {
    const response = await fetchMicroHeroData();
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
