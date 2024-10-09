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


// hero info
type AbilityShow = string[];

type Relation = {
  heads: string[];
  description: string;
};

export type HeroInfo = {
  name: string;
  head: string;
  head_big: string;
  square_head: string;
  square_head_big: string;
  createdAt: number;
  updatedAt: number;
  stats: AbilityShow;
  lane: string[];
  type: string[];
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
    main_hero_ban_rate: string,
    main_hero_win_rate: string,
    main_heroid: string,
    main_hero: {
      data: {
        head: string,
        name: string,
      }
    }
  }
}

export type MetaHeroesType = {
  ban_rate: string,
  win_rate: string,
  heroid: string,
  head: string,
  name: string,
}

export type StatsType = {
  totalHeroes: string,
  mostWin: string,
  mostWinHead: string,
  mostBanned: string,
  mostBannedHead: string,
  banRate: string,
  winRate: string,
}