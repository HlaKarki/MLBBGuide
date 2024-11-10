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
  | 'Overall';

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
