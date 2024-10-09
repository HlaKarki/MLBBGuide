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