// src/app/api/mlbb/heroes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {processData} from "@/app/api/mlbb/fetches";

const baseUrl = process.env.MLBB_API_BASE_URL;
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const secondId = process.env.MLBB_SECOND_ID_HEROES || "/2756564";

export const fetchHeroInfoData = async (heroId? : string | null) => {
  try {
    const url = `${baseUrl}${firstId}${secondId}`;
    const requestBody = {
      pageSize: 200,
      filters: heroId ? [{field: 'hero_id', operator: 'eq', value: parseInt(heroId)}] : [],
      sorts: [{data: {field: 'hero_id', order: 'desc'}, type: 'sequence'}],
      pageIndex: 1,
      object: [],
      fields: [
        "data.hero._createdAt", "data.hero._updatedAt", "data.hero.data.name",
        "data.head", "data.head_big", "data.hero.data.story", "data.hero.data.head_big",
        "data.hero.data.squarehead", "data.hero.data.squareheadbig",
        "data.hero.data.roadsortlabel", "data.hero.data.speciality",
        "data.hero.data.abilityshow", "data.relation"
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return NextResponse.json({error: "Failed to fetch hero data"}, {status: response.status});
    }
    return await response.json();
  }
  catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const heroId = request.nextUrl.searchParams.get('id') || null;

  const data = await fetchHeroInfoData(heroId);
  const processedData = processData(data);

  return NextResponse.json(heroId ? Object.values(processedData)[0] : processedData);

}