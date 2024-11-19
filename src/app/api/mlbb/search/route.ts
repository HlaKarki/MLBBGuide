import { NextRequest, NextResponse } from 'next/server';
import { fetchMicroData } from '@/lib/fetches';

export async function POST(request: NextRequest){
  const {heroes} = await request.json();

  try {
    const response = await fetchMicroData(heroes);

    return NextResponse.json({
      data: response,
      success: true,
    });
  } catch (error) {
    NextResponse.json({
      success: false,
      message: 'Failed to fetch final data',
    });
  }
}