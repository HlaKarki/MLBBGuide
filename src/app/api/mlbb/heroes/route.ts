// src/app/api/mlbb/heroes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HeroInfo } from "@/lib/types";

const baseUrl = process.env.MLBB_API_BASE_URL;
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const secondId = process.env.MLBB_SECOND_ID_HEROES || "/2756564";

type RawDataType = {
  data: {
    records: Record<string, { data: any }>
  }
};

const processAllHeroData = (rawData: RawDataType): Record<string, HeroInfo> => {
  return Object.entries(rawData.data.records).reduce((acc, [key, { data }]) => {
    const { hero, head, head_big, relation } = data;
    const { _createdAt, _updatedAt, data: heroData } = hero;

    acc[key] = {
      name: heroData.name,
      head,
      head_big,
      square_head: heroData.squarehead,
      square_head_big: heroData.squareheadbig,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      stats: {
        Durability: heroData.abilityshow[0] || "0",
        Offense: heroData.abilityshow[1] || "0",
        "Ability Effects": heroData.abilityshow[2] || "0",
        Difficulty: heroData.abilityshow[3] || "0"
      },
      lane: heroData.roadsortlabel,
      type: heroData.speciality,
      title: heroData.story,
      relation: {
        "works_well_with": processRelation(relation.assist),
        "strong_against": processRelation(relation.strong),
        "weak_against": processRelation(relation.weak)
      }
    };
    return acc;
  }, {} as Record<string, HeroInfo>);
};

const processRelation = (relationData: any) => ({
  heads: relationData.target_hero
      .filter((hero: any) => hero && typeof hero === 'object' && hero.data && hero.data.head)
      .map((hero: any) => hero.data.head),
  description: relationData.desc
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const heroId = searchParams.get('id');

  try {
    const url = `${baseUrl}${firstId}${secondId}`;
    const requestBody = {
      pageSize: 200,
      filters: heroId ? [{ field: 'hero_id', operator: 'eq', value: parseInt(heroId) }] : [],
      sorts: [{ data: { field: 'name', order: 'asc' }, type: 'sequence' }],
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch hero data" }, { status: response.status });
    }

    const data: RawDataType = await response.json();
    const processedData = processAllHeroData(data);

    return NextResponse.json(heroId ? Object.values(processedData)[0] : processedData);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}