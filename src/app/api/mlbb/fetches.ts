import {HeroInfo, PayloadType, RawDataType} from "@/lib/types";
import {NextResponse} from "next/server";

const baseUrl = process.env.MLBB_API_BASE_URL || "";
const firstId = process.env.MLBB_FIRST_ID;
const meta_heroes = process.env.MLBB_SECOND_ID_META_HEROES;
const heroes = process.env.MLBB_SECOND_ID_HEROES;
const details = process.env.MLBB_SECOND_ID_DETAILS;
const graph_7 = process.env.MLBB_SECOND_ID_GRAPH_7;
const graph_30 = process.env.MLBB_SECOND_ID_GRAPH_30;

export const fetchHeroInfoData = async (heroId? : string | null) => {
  try {
    const url = `${baseUrl}${firstId}${heroes}`;
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

export async function fetchHeroDetails(match_type: string, hero_id: string | null, rank: string | null, pickRate?: boolean) {
  const url = baseUrl + firstId + details;
  const payload: PayloadType = {
    pageSize: hero_id ? 1 : 200,
    filters: [
      { field: "match_type", operator: "eq", value: match_type },
      hero_id ? { field: "main_heroid", operator: "eq", value: hero_id } : {},
      { field: "bigrank", operator: "eq", value: rank || "101" }
    ],
    sorts: [{data: {field: 'main_heroid', order: 'desc'}, type: 'sequence'}],
    pageIndex: 1
  };

  if (pickRate) {
    payload["fields"] = [
      "data.main_hero_appearance_rate",
      // "data.main_hero.data.head",
      // "data.main_hero.data.name",
      // "data.main_heroid",
    ]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function fetchStats(sortField: string, count: number, hero_id?: number) {
  const url = baseUrl + firstId + meta_heroes;
  const payload = {
    pageSize: count,
    filters: [
      { field: "bigrank", operator: "eq", value: "101" },
      { field: "match_type", operator: "eq", value: "0" }
    ],
    sorts: [
      { data: { field: sortField, order: "desc" }, type: "sequence" },
      { data: { field: "main_heroid", order: "desc" }, type: "sequence" }
    ],
    pageIndex: 1,
    fields: [
      "main_hero",
      "main_hero_ban_rate",
      "main_hero_win_rate",
      "main_heroid",
      "main_hero_appearance_rate"
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function fetchGraph(heroId: string, period: number, rank?: string) {
  const url = baseUrl + firstId + (period === 30 ? graph_30 : graph_7);
  const payload = {
    pageSize: 1,
    filters: [
      {
        "field": "main_heroid",
        "operator": "eq",
        "value": heroId
      },
      {
        "field": "bigrank",
        "operator": "eq",
        "value": rank || 7
      },
      {
        "field": "match_type",
        "operator": "eq",
        "value": "1"
      }
    ],
    sorts: [],
    fields: [
        "_createdAt",
        "_updatedAt",
        "data.bigrank",
        "data.main_heroid",
        "data.win_rate"
    ],
    pageIndex: 1
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

const processRelation = (relationData: any) => ({
  heads: relationData.target_hero
      .filter((hero: any) => hero && typeof hero === 'object' && hero.data && hero.data.head)
      .map((hero: any) => hero.data.head),
  description: relationData.desc
});

export const processData = (rawData: RawDataType): Record<string, HeroInfo> => {
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
      abilities: {
        Durability: heroData.abilityshow[0] || "0",
        Offense: heroData.abilityshow[1] || "0",
        "Ability Effects": heroData.abilityshow[2] || "0",
        Difficulty: heroData.abilityshow[3] || "0"
      },
      lane: heroData.roadsortlabel,
      speciality: heroData.speciality,
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