import { FinalHeroDataType } from '@/lib/types';

export async function fetchMLBBData(): Promise<FinalHeroDataType[]> {
  const baseUrl = process.env.MLBB_API_BASE_URL || '';
  const firstId = process.env.MLBB_FIRST_ID;
  const heroes = process.env.MLBB_SECOND_ID_HEROES;
  const details = process.env.MLBB_SECOND_ID_DETAILS;
  const meta = process.env.MLBB_SECOND_ID_META_HEROES;
  const graph = process.env.MLBB_SECOND_ID_GRAPH_30;

  const urlHeroData = baseUrl + firstId + heroes;
  const urlHeroDetails = baseUrl + firstId + details;
  const urlHeroMeta = baseUrl + firstId + meta;
  const urlHeroGraph = baseUrl + firstId + graph;

  const requestBodyHeroData = {
    pageSize: 200,
    sorts: [
      {
        data: {
          field: 'hero_id',
          order: 'desc',
        },
        type: 'sequence',
      },
    ],
    pageIndex: 1,
    object: [],
    fields: [
      'data.hero.data.name',
      'data.head',
      'data.head_big',
      'data.hero.data.story',
      'data.hero.data.squarehead',
      'data.hero.data.squareheadbig',
      'data.hero.data.roadsortlabel',
      'data.hero.data.speciality',
      'data.hero.data.abilityshow',
    ],
  };

  const requestBodyCounters = {
    pageSize: 200,
    filters: [
      { field: 'match_type', operator: 'eq', value: 0 },
      { field: 'bigrank', operator: 'eq', value: '101' },
    ],
    sorts: [
      {
        data: {
          field: 'main_heroid',
          order: 'desc',
        },
        type: 'sequence',
      },
    ],
    fields: [
      'data.main_hero_appearance_rate',
      'data.main_hero_ban_rate',
      'data.main_hero_win_rate',
      'data.main_heroid',
      'data.sub_hero.hero',
      'data.sub_hero.heroid',
      'data.sub_hero.hero_win_rate',
      'data.sub_hero.hero_appearance_rate',
      'data.sub_hero.increase_win_rate',
      'data.sub_hero_last.hero',
      'data.sub_hero_last.heroid',
      'data.sub_hero_last.hero_appearance_rate',
      'data.sub_hero_last.hero_win_rate',
      'data.sub_hero_last.increase_win_rate',
    ],
    pageIndex: 1,
  };

  const requestBodyCompatibles = {
    ...requestBodyCounters,
    filters: [
      { field: 'match_type', operator: 'eq', value: 1 },
      { field: 'bigrank', operator: 'eq', value: '101' },
    ],
  };

  const requestBodyMeta = {
    pageSize: 200,
    filters: [
      { field: 'bigrank', operator: 'eq', value: '101' },
      { field: 'match_type', operator: 'eq', value: '0' },
    ],
    sorts: [
      { data: { field: 'main_heroid', order: 'desc' }, type: 'sequence' },
    ],
    pageIndex: 1,
    fields: [
      'main_hero_ban_rate',
      'main_hero_win_rate',
      'main_hero_appearance_rate',
      'main_heroid',
    ],
  };

  const requestBodyGraph = {
    pageSize: 200,
    filters: [
      {
        field: 'bigrank',
        operator: 'eq',
        value: '101',
      },
      {
        field: 'match_type',
        operator: 'eq',
        value: '1',
      },
    ],
    sorts: [
      { data: { field: 'main_heroid', order: 'desc' }, type: 'sequence' },
    ],
    fields: [
      '_createdAt',
      '_updatedAt',
      'data.bigrank',
      'data.main_heroid',
      'data.win_rate',
    ],
    pageIndex: 1,
  };

  // Helper function for POST requests
  async function postData(url: string, data: any) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Fetch all data in parallel
  const [
    heroDataResponse,
    countersResponse,
    compatiblesResponse,
    metaResponse,
    graphResponse,
  ] = await Promise.all([
    postData(urlHeroData, requestBodyHeroData),
    postData(urlHeroDetails, requestBodyCounters),
    postData(urlHeroDetails, requestBodyCompatibles),
    postData(urlHeroMeta, requestBodyMeta),
    postData(urlHeroGraph, requestBodyGraph),
  ]);

  // Process and combine data
  const processedHeroData = processHeroData(heroDataResponse);
  const processedHeroCounters = processCounters(countersResponse);
  const processedHeroCompatibles = processCompatibles(compatiblesResponse);
  const processedHeroMeta = processMeta(metaResponse);
  const processedHeroGraph = processGraph(graphResponse);

  return combineData(
    processedHeroData,
    processedHeroCounters,
    processedHeroCompatibles,
    processedHeroMeta,
    processedHeroGraph
  );
}

// Define interfaces for API responses
interface HeroDataAPIResponse {
  data: {
    records: {
      data: {
        hero_id: string;
        head: string;
        head_big: string;
        hero: {
          data: {
            name: string;
            squarehead: string;
            squareheadbig: string;
            speciality: string[];
            abilityshow: string[];
            roadsortlabel: string[];
            story: string;
          };
        };
      };
    }[];
  };
}

interface CounterDataAPIResponse {
  data: {
    records: {
      data: {
        main_heroid: string;
        sub_hero: {
          hero: {
            data: {
              head: string;
            };
          };
          heroid: string;
          increase_win_rate: string;
        }[];
        sub_hero_last: {
          hero: {
            data: {
              head: string;
            };
          };
          heroid: string;
          increase_win_rate: string;
        }[];
      };
    }[];
  };
}

interface MetaDataAPIResponse {
  data: {
    records: {
      data: {
        main_heroid: string;
        main_hero_win_rate: string;
        main_hero_ban_rate: string;
        main_hero_appearance_rate: string;
      };
    }[];
  };
}

interface GraphDataAPIResponse {
  data: {
    records: {
      _createdAt: number;
      _updatedAt: number;
      data: {
        bigrank: string;
        main_heroid: string;
        win_rate: {
          app_rate: number;
          ban_rate: number;
          win_rate: number;
          date: string;
        }[];
      };
    }[];
  };
}

// Processing functions
function processHeroData(
  data: HeroDataAPIResponse
): Map<string, Partial<FinalHeroDataType>> {
  const heroMap = new Map<string, Partial<FinalHeroDataType>>();
  data.data.records.forEach((heroRecord) => {
    const heroData = heroRecord.data;
    const hero_id = heroData.hero_id;
    heroMap.set(hero_id, {
      name: heroData.hero.data.name,
      hero_id: hero_id,
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
    });
  });
  return heroMap;
}

function processCounters(
  data: CounterDataAPIResponse
): Map<string, Partial<FinalHeroDataType>> {
  const counterMap = new Map<string, Partial<FinalHeroDataType>>();
  data.data.records.forEach((counterRecord) => {
    const counterData = counterRecord.data;
    const hero_id = counterData.main_heroid;
    counterMap.set(hero_id, {
      effective: counterData.sub_hero.map((item) => ({
        image: item.hero.data.head,
        hero_id: item.heroid,
        increase_win_rate: item.increase_win_rate,
      })),
      ineffective: counterData.sub_hero_last.map((item) => ({
        image: item.hero.data.head,
        hero_id: item.heroid,
        increase_win_rate: item.increase_win_rate,
      })),
    });
  });
  return counterMap;
}

function processCompatibles(
  data: CounterDataAPIResponse
): Map<string, Partial<FinalHeroDataType>> {
  const compatibleMap = new Map<string, Partial<FinalHeroDataType>>();
  data.data.records.forEach((record) => {
    const dataItem = record.data;
    const hero_id = dataItem.main_heroid;
    compatibleMap.set(hero_id, {
      compatible: dataItem.sub_hero.map((item) => ({
        image: item.hero.data.head,
        hero_id: item.heroid,
        increase_win_rate: item.increase_win_rate,
      })),
      incompatible: dataItem.sub_hero_last.map((item) => ({
        image: item.hero.data.head,
        hero_id: item.heroid,
        increase_win_rate: item.increase_win_rate,
      })),
    });
  });
  return compatibleMap;
}

function processMeta(
  data: MetaDataAPIResponse
): Map<string, Partial<FinalHeroDataType>> {
  const metaMap = new Map<string, Partial<FinalHeroDataType>>();
  data.data.records.forEach((record) => {
    const dataItem = record.data;
    const hero_id = dataItem.main_heroid;
    metaMap.set(hero_id, {
      win_rate: dataItem.main_hero_win_rate,
      ban_rate: dataItem.main_hero_ban_rate,
      pick_rate: dataItem.main_hero_appearance_rate,
    });
  });
  return metaMap;
}

function processGraph(
  data: GraphDataAPIResponse
): Map<string, Partial<FinalHeroDataType>> {
  const graphMap = new Map<string, Partial<FinalHeroDataType>>();
  data.data.records.forEach((record) => {
    const hero_id = record.data.main_heroid;
    graphMap.set(hero_id, {
      graph: {
        _createdAt: record._createdAt,
        _updatedAt: record._updatedAt,
        win_rate: record.data.win_rate,
      },
    });
  });
  return graphMap;
}

// Combine all data into HeroData objects
function combineData(
  heroDataMap: Map<string, Partial<FinalHeroDataType>>,
  countersMap: Map<string, Partial<FinalHeroDataType>>,
  compatiblesMap: Map<string, Partial<FinalHeroDataType>>,
  metaMap: Map<string, Partial<FinalHeroDataType>>,
  graphMap: Map<string, Partial<FinalHeroDataType>>
): FinalHeroDataType[] {
  const combinedData: FinalHeroDataType[] = [];

  heroDataMap.forEach((heroData, hero_id) => {
    combinedData.push({
      ...heroData,
      ...(countersMap.get(hero_id) || {}),
      ...(compatiblesMap.get(hero_id) || {}),
      ...(metaMap.get(hero_id) || {}),
      ...(graphMap.get(hero_id) || {}),
      hero_id: hero_id,
    } as FinalHeroDataType);
  });

  return combinedData;
}
