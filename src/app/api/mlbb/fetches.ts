import {HeroInfo, RawDataType} from "@/lib/types";

const baseUrl = process.env.MLBB_API_BASE_URL || "";
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const meta_heroes = process.env.MLBB_SECOND_ID_META_HEROES || "/2756567";

export async function fetchStats(sortField: string, count: number) {
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
      stats: {
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