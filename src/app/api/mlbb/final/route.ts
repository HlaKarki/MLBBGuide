import { NextResponse } from 'next/server';

const baseUrl = process.env.MLBB_API_BASE_URL || '';
const firstId = process.env.MLBB_FIRST_ID;
const heroes = process.env.MLBB_SECOND_ID_HEROES;
const details = process.env.MLBB_SECOND_ID_DETAILS;
const meta = process.env.MLBB_SECOND_ID_META_HEROES;

export async function GET() {
  const urlHeroData = baseUrl + firstId + heroes;
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

  const urlHeroDetails = baseUrl + firstId + details;
  const requestBodyCounters = {
    pageSize: 200,
    filters: [
      {field: "match_type", operator: "eq", value: 0},
      {field: "bigrank", operator: "eq", value: "101"}
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
      "data.main_hero_appearance_rate",
      "data.main_hero_ban_rate",
      "data.main_hero_win_rate",
      "data.main_heroid",

      "data.sub_hero.hero",
      "data.sub_hero.heroid",
      "data.sub_hero.hero_win_rate",
      "data.sub_hero.hero_appearance_rate",
      "data.sub_hero.increase_win_rate",

      "data.sub_hero_last.hero",
      "data.sub_hero_last.heroid",
      "data.sub_hero_last.hero_appearance_rate",
      "data.sub_hero_last.hero_win_rate",
      "data.sub_hero_last.increase_win_rate"
    ],
    pageIndex: 1
  }
  const requestBodyCompatibles = {
    pageSize: 200,
    filters: [
      {field: "match_type", operator: "eq", value: 1},
      {field: "bigrank", operator: "eq", value: "101"}
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
      "data.main_hero_appearance_rate",
      "data.main_hero_ban_rate",
      "data.main_hero_win_rate",
      "data.main_heroid",

      "data.sub_hero.hero",
      "data.sub_hero.heroid",
      "data.sub_hero.hero_win_rate",
      "data.sub_hero.hero_appearance_rate",
      "data.sub_hero.increase_win_rate",

      "data.sub_hero_last.hero",
      "data.sub_hero_last.heroid",
      "data.sub_hero_last.hero_appearance_rate",
      "data.sub_hero_last.hero_win_rate",
      "data.sub_hero_last.increase_win_rate"
    ],
    pageIndex: 1
  }

  const urlHeroMeta = baseUrl + firstId + meta;
  const requestBodyMeta = {
    pageSize: 200,
    filters: [
      { "field": "bigrank", "operator": "eq", "value": "101" },
      { "field": "match_type", "operator": "eq", "value": "0" },
    ],
    sorts: [
      { "data": { "field": "main_heroid", "order": "desc" }, "type": "sequence" }
    ],
    pageIndex: 1,
    fields: [
      "main_hero_ban_rate",
      "main_hero_win_rate",
      "main_hero_appearance_rate",
      "main_heroid"
    ]
  }

  try {
    const [heroData, counters, compatible, metaStats] = await Promise.all([
      await fetch(urlHeroData, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyHeroData),
      }).then(response => response.json()),
      await fetch(urlHeroDetails, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyCounters),
      }).then(response => response.json()),
      await fetch(urlHeroDetails, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyCompatibles),
      }).then(response => response.json()),
      await fetch(urlHeroMeta, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBodyMeta),
      }).then(response => response.json()),
    ])

    const processedHeroData = processHeroData(heroData);
    const processedHeroCounters = processCounters(counters)
    const processedHeroCompatible = processCompatibles(compatible)
    const processedHeroMeta = processMeta(metaStats)

    const combinedData = combineData(processedHeroData, processedHeroCounters, processedHeroCompatible, processedHeroMeta);

    return NextResponse.json({
      data: combinedData
    });
  } catch (error) {
    return NextResponse.json({ status: 404 });
  }
}

type queryHeroData = {
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
};

function processHeroData(data: {
  data: {
    records: queryHeroData[];
  };
}) {
  const truncate = data.data.records;
  return truncate.map(heroData => {
    return {
      name: heroData.data.hero.data.name,
      hero_id: heroData.data.hero_id,
      role: heroData.data.hero.data.roadsortlabel,
      speciality: heroData.data.hero.data.speciality,
      images: {
        head: heroData.data.head,
        head_big: heroData.data.head_big,
        square: heroData.data.hero.data.squarehead,
        square_big: heroData.data.hero.data.squareheadbig,
      },
      tagline: heroData.data.hero.data.story,
      abilities: {
        Durability: heroData.data.hero.data.abilityshow[0],
        Offense: heroData.data.hero.data.abilityshow[1],
        'Ability Effects': heroData.data.hero.data.abilityshow[2],
        Difficulty: heroData.data.hero.data.abilityshow[3],
      },
    };
  });
}

type queryCounterData = {
  data: {
    main_heroid: string;
    sub_hero: [
      {
        hero: {
          data: {
            head: string;
          }
        };
        heroid: string;
        increase_win_rate: string
      }
    ],
    sub_hero_last: [
      {
        hero: {
          data: {
            head: string;
          }
        };
        heroid: string;
        increase_win_rate: string
      }
    ]
  };
};

function processCounters(data: {
  data: {
    records: queryCounterData[];
  }
}) {
  const truncate = data.data.records;
  return truncate.map(counter => {
    return {
      // hero_id: counter.data.main_heroid,
      effective: counter.data.sub_hero.map((data) => {
        return {
          image: data.hero.data.head,
          hero_id: data.heroid,
          increase_win_rate: data.increase_win_rate,
        }
      }),
      ineffective: counter.data.sub_hero_last.map((data) => {
        return {
          image: data.hero.data.head,
          hero_id: data.heroid,
          increase_win_rate: data.increase_win_rate,
        }
      }),
    }
  })
}

function processCompatibles(data: {
  data: {
    records: queryCounterData[];
  }
}) {
  const truncate = data.data.records;
  return truncate.map(counter => {
    return {
      // hero_id: counter.data.main_heroid,
      compatible: counter.data.sub_hero.map((data) => {
        return {
          image: data.hero.data.head,
          hero_id: data.heroid,
          increase_win_rate: data.increase_win_rate,
        }
      }),
      incompatible: counter.data.sub_hero_last.map((data) => {
        return {
          image: data.hero.data.head,
          hero_id: data.heroid,
          increase_win_rate: data.increase_win_rate,
        }
      }),
    }
  })
}

type queryMetaData = {
  data: {
    main_hero_win_rate: string;
    main_hero_ban_rate: string;
    main_hero_appearance_rate: string;
    main_heroid: string;
  }
}

function processMeta(data: {
  data: {
    records: queryMetaData[]
  }
}) {
  const truncate = data.data.records;
  return truncate.map(meta => {
    return {
      // hero_id: meta.data.main_heroid,
      win_rate: meta.data.main_hero_win_rate,
      ban_rate: meta.data.main_hero_ban_rate,
      pick_rate: meta.data.main_hero_appearance_rate,
    }
  })
}

type heroDataType = {
  name: string,
  hero_id: string,
  role: string[],
  speciality: string[],
  images: {
    head: string,
    head_big: string,
    square: string,
    square_big: string,
  },
  tagline: string,
  abilities: {
    Durability: string,
    Offense: string,
    'Ability Effects': string,
    Difficulty: string,
  },
};

type countersDataType = {
  hero_id?: string,
  effective: {
    image: string,
    hero_id: string,
    increase_win_rate: string,
  }[],
  ineffective: {
    image: string,
    hero_id: string,
    increase_win_rate: string,
  }[]
}

type compatiblesDataType = {
  hero_id?: string,
  compatible: {
    image: string,
    hero_id: string,
    increase_win_rate: string,
  }[],
  incompatible: {
    image: string,
    hero_id: string,
    increase_win_rate: string,
  }[]
}

type metaDataType = {
  hero_id?: string,
  win_rate: string,
  ban_rate: string,
  pick_rate: string,
}


function combineData(heroData: heroDataType[], counters: countersDataType[], compatibles: compatiblesDataType[], meta: metaDataType[]) {
  return heroData.map((data, index) => {
    return {
      ...data,
      ...counters[index],
      ...compatibles[index],
      ...meta[index],
    }
  })
}