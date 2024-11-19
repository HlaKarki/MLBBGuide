// Data processors
import {
  CounterDataAPIResponse,
  FinalHeroDataType,
  GraphDataAPIResponse,
  HeroDataAPIResponse,
  MetaDataAPIResponse,
} from '@/lib/types';

export class DataProcessor {
  static processHeroData(
    data: HeroDataAPIResponse
  ): Map<string, Partial<FinalHeroDataType>> {
    const heroMap = new Map<string, Partial<FinalHeroDataType>>();

    data.data.records.forEach(({ data: heroData }) => {
      const { hero_id } = heroData;
      heroMap.set(hero_id, {
        name: heroData.hero.data.name,
        hero_id,
        role: heroData.hero.data.roadsortlabel,
        speciality: heroData.hero.data.speciality,
        images: {
          head: heroData.head,
          head_big: heroData.head_big,
          square: heroData.hero.data.squarehead,
          square_big: heroData.hero.data.squareheadbig,
        },
        tagline: heroData.hero.data.story,
        abilities: {
          Durability: heroData.hero.data.abilityshow[0],
          Offense: heroData.hero.data.abilityshow[1],
          'Ability Effects': heroData.hero.data.abilityshow[2],
          Difficulty: heroData.hero.data.abilityshow[3],
        },
        relation: {
          works_well_with: processRelation(heroData.relation.assist),
          strong_against: processRelation(heroData.relation.strong),
          weak_against: processRelation(heroData.relation.weak),
        },
      });
    });

    return heroMap;
  }

  static processMatchupData(
    data: CounterDataAPIResponse,
    type: 'counter' | 'compatible'
  ): Map<string, Partial<FinalHeroDataType>> {
    const matchupMap = new Map<string, Partial<FinalHeroDataType>>();

    data.data.records.forEach(({ data: matchupData }) => {
      const hero_id = matchupData.main_heroid;
      const processedData = {
        [type === 'counter' ? 'effective' : 'compatible']:
          matchupData.sub_hero.map(item => ({
            image: item.hero.data.head,
            hero_id: item.heroid,
            increase_win_rate: item.increase_win_rate,
          })),
        [type === 'counter' ? 'ineffective' : 'incompatible']:
          matchupData.sub_hero_last.map(item => ({
            image: item.hero.data.head,
            hero_id: item.heroid,
            increase_win_rate: item.increase_win_rate,
          })),
      };

      matchupMap.set(hero_id, processedData);
    });

    return matchupMap;
  }

  static processMeta(
    data: MetaDataAPIResponse
  ): Map<string, Partial<FinalHeroDataType>> {
    return new Map(
      data.data.records.map(({ data: metaData }) => [
        metaData.main_heroid,
        {
          win_rate: metaData.main_hero_win_rate,
          ban_rate: metaData.main_hero_ban_rate,
          pick_rate: metaData.main_hero_appearance_rate,
        },
      ])
    );
  }

  static processGraph(
    data: GraphDataAPIResponse
  ): Map<string, Partial<FinalHeroDataType>> {
    return new Map(
      data.data.records.map(record => [
        record.data.main_heroid,
        {
          graph: {
            _createdAt: record._createdAt,
            _updatedAt: record._updatedAt,
            win_rate: record.data.win_rate,
          },
        },
      ])
    );
  }

  static processSearchMeta(
    data: MetaDataAPIResponse
  ){
    return data.data.records.map(record => {
      return {
        hero_id: record.data.main_heroid,
        head: record.data.main_hero.data.head,
        pick_rate: record.data.main_hero_appearance_rate,
        ban_rate: record.data.main_hero_ban_rate,
        win_rate: record.data.main_hero_win_rate
      }
    })
  }

  static combineData(
    heroData: Map<string, Partial<FinalHeroDataType>>,
    counters: Map<string, Partial<FinalHeroDataType>>,
    compatibles: Map<string, Partial<FinalHeroDataType>>,
    meta: Map<string, Partial<FinalHeroDataType>>,
    graph: Map<string, Partial<FinalHeroDataType>>
  ): FinalHeroDataType[] {
    return Array.from(heroData.entries()).map(([hero_id, heroInfo]) => ({
      ...heroInfo,
      ...(counters.get(hero_id) || {}),
      ...(compatibles.get(hero_id) || {}),
      ...(meta.get(hero_id) || {}),
      ...(graph.get(hero_id) || {}),
      hero_id,
    })) as FinalHeroDataType[];
  }
}

const processRelation = (relationData: any) => ({
  heads: relationData.target_hero
    .filter(
      (hero: any) =>
        hero && typeof hero === 'object' && hero.data && hero.data.head
    )
    .map((hero: any) => hero.data.head),
  description: relationData.desc,
});
