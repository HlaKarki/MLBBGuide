// Hero Details
type Info = {
  heroid: number;
  head: string;
  hero_win_rate: number;
  increase_win_rate: number;
};

type CountersData = {
  rank: string;
  head: string;
  name: string;
  appearance_rate: number;
  ban_rate: number;
  win_rate: number;
  counters: Info[];
  most_countered_by: Info[];
};

type CompatibilitiesData = {
  head: string;
  name: string;
  appearance_rate: number;
  ban_rate: number;
  win_rate: number;
  most_compatible: Info[];
  least_compatible: Info[];
};

export type HeroDetails = {
  counters: CountersData;
  compatibilities: CompatibilitiesData;
};

export type HeroInfo = {
  name: string;
  head: string;
  head_big: string;
  square_head: string;
  square_head_big: string;
  createdAt: number;
  updatedAt: number;
  abilities: {
    Durability: string;
    Offense: string;
    'Ability Effects': string;
    Difficulty: string;
  };
  lane: string[];
  speciality: string[];
  title: string;
  relation: {
    works_well_with: Relation;
    strong_against: Relation;
    weak_against: Relation;
  };
};

// meta heroes
export type MetaHeroesQueryType = {
  data: {
    main_hero_ban_rate: string;
    main_hero_win_rate: string;
    main_hero_appearance_rate: string;
    main_heroid: string;
    main_hero: {
      data: {
        head: string;
        name: string;
      };
    };
  };
};

export type MetaHeroesType = {
  ban_rate: string;
  win_rate: string;
  pick_rate: string;
  heroid: string;
  head: string;
  name: string;
};

export type StatsType = {
  totalHeroes: string;
  mostWin: string;
  mostWinHead: string;
  mostBanned: string;
  mostBannedHead: string;
  mostPicked: string;
  mostPickedHead: string;
  banRate: string;
  winRate: string;
  pickRate: string;
};

// Stats (Table)

export type StatsTableType = {
  id: string;
  name: string;
  head: string;
  win_rate: number;
  ban_rate: number;
  pick_rate: number;
  speciality: string[];
  abilities: {
    Durability: number;
    Offense: number;
    'Ability Effects': number;
    Difficulty: number;
  };
  lanes: string[];
};

export type RawDataType = {
  data: {
    records: Record<string, { data: any }>;
  };
};

export interface PayloadType {
  pageSize: number;
  filters: Array<{ field?: string; operator?: string; value?: string }>;
  sorts: Array<{ data: { field: string; order: string }; type: string }>;
  pageIndex: number;
  fields?: string[];
}

export interface DataPoint {
  date: string;
  win_rate: number;
  ban_rate: number;
  app_rate: number;
}

export type FinalHeroDataType = {
  name: string;
  hero_id: string;
  role: string[];
  speciality: string[];
  images: {
    head: string;
    head_big: string;
    square: string;
    square_big: string;
  };
  tagline: string;
  abilities: {
    Durability: string;
    Offense: string;
    'Ability Effects': string;
    Difficulty: string;
  };
  relation?: {
    works_well_with: Relation;
    strong_against: Relation;
    weak_against: Relation;
  };
  effective?: CounterHero[];
  ineffective?: CounterHero[];
  compatible?: CounterHero[];
  incompatible?: CounterHero[];
  win_rate?: string;
  ban_rate?: string;
  pick_rate?: string;
  graph?: GraphData;
};

type CounterHero = {
  image: string;
  hero_id: string;
  increase_win_rate: string;
};

export type GraphData = {
  _createdAt: number;
  _updatedAt: number;
  win_rate: {
    app_rate: number;
    ban_rate: number;
    win_rate: number;
    date: string;
  }[];
};

// hero info
type Relation = {
  heads: string[];
  description: string;
};

// clerk
export type UserDataType = {
  clerk_id: string;
  username: string;
  email: string;
  games: {
    name: string;
    createdAt: Date;
  }[];
};

// Ranks
export type RanksType =
  | 'Warrior'
  | 'Elite'
  | 'Grandmaster'
  | 'Epic'
  | 'Legend'
  | 'Mythical Honor'
  | 'Mythical Glory'
  | 'All';

export interface APIRequestConfig {
  pageSize: number;
  filters?: Array<{
    field: string;
    operator: string;
    value: string | number;
  }>;
  sorts: Array<{
    data: {
      field: string;
      order: 'asc' | 'desc';
    };
    type: 'sequence';
  }>;
  pageIndex: number;
  fields: string[];
  object?: any[];
}

// Define interfaces for API responses
export interface HeroDataAPIResponse {
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
        relation: {
          assist: any;
          strong: any;
          weak: any;
        };
      };
    }[];
  };
}

export interface CounterDataAPIResponse {
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

export interface MetaDataAPIResponse {
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

export interface GraphDataAPIResponse {
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
