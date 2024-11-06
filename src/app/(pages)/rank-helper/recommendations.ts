import { FinalHeroDataType } from '@/lib/types';

// Constants for weights and thresholds
const WEIGHTS = {
  COUNTER: 3,
  SYNERGY: 2,
  ROLE_BALANCE: 2.5,
  SPECIALTY_BALANCE: 1,
  WIN_RATE: 1.5,
  PICK_RATE: 1,
  BAN_RATE: 0.5
} as const;

interface HeroScore {
  hero: FinalHeroDataType;
  score: number;
  breakdowns: {
    counterScore: number;
    synergyScore: number;
    roleScore: number;
    specialtyScore: number;
    performanceScore: number;
  };
}

export function suggestHeroes(
  teamPicks: string[],
  enemyPicks: string[],
  bannedHeroes: string[],
  allHeroes: FinalHeroDataType[],
  requiredRole?: string // Optional parameter to filter by specific role
): HeroScore[] {
  // Helper function to get hero by ID
  const getHeroById = (heroId: string): FinalHeroDataType | undefined =>
    allHeroes.find(h => h.hero_id === heroId);

  // Get current team composition
  const teamHeroes = teamPicks.map(id => getHeroById(id)).filter(Boolean) as FinalHeroDataType[];

  // Determine team's current roles and specialties
  const teamRoles = new Set<string>();
  const teamSpecialties = new Set<string>();

  teamHeroes.forEach(hero => {
    hero.role.forEach(role => teamRoles.add(role));
    hero.speciality.forEach(spec => teamSpecialties.add(spec));
  });

  // Determine missing roles
  const allRoles = ['Roam', 'Exp Lane', 'Jungle', 'Mid Lane', 'Gold Lane'];
  const missingRoles = allRoles.filter(role => !teamRoles.has(role));

  // Filter available heroes
  let availableHeroes = allHeroes.filter(hero =>
    !teamPicks.includes(hero.hero_id) &&
    !enemyPicks.includes(hero.hero_id) &&
    !bannedHeroes.includes(hero.hero_id)
  );

  // Filter heroes based on requiredRole or missing roles
  if (requiredRole) {
    availableHeroes = availableHeroes.filter(hero =>
      hero.role.includes(requiredRole)
    );
  } else {
    // Automatically filter heroes to those suitable for missing roles
    availableHeroes = availableHeroes.filter(hero =>
      hero.role.some(role => missingRoles.includes(role))
    );
  }

  // Calculate scores for each hero
  const heroScores: HeroScore[] = availableHeroes.map(hero => {
    // Initialize score components
    let counterScore = 0;
    let synergyScore = 0;
    let roleScore = 0;
    let specialtyScore = 0;
    let performanceScore = 0;

    // Check for hard counters (ineffective against)
    const isHardCountered = hero.ineffective?.some(
      counter => enemyPicks.includes(counter.hero_id)
    );

    if (isHardCountered) {
      return {
        hero,
        score: -1,
        breakdowns: {
          counterScore: 0,
          synergyScore: 0,
          roleScore: 0,
          specialtyScore: 0,
          performanceScore: 0
        }
      };
    }

    // Counter score
    if (hero.effective) {
      const counterCount = enemyPicks.filter(enemyId =>
        hero.effective?.some(counter => counter.hero_id === enemyId)
      ).length;
      counterScore = (counterCount / Math.max(enemyPicks.length, 1)) * WEIGHTS.COUNTER;
    }

    // Synergy score
    if (hero.compatible) {
      const synergyCount = teamPicks.filter(teamId =>
        hero.compatible?.some(sync => sync.hero_id === teamId)
      ).length;
      synergyScore = (synergyCount / Math.max(teamPicks.length, 1)) * WEIGHTS.SYNERGY;
    }

    // Role balance score
    if (requiredRole) {
      roleScore = WEIGHTS.ROLE_BALANCE;
    } else {
      // If the hero fills one of the missing roles, assign roleScore
      const fillsMissingRole = hero.role.some(role => missingRoles.includes(role));
      roleScore = fillsMissingRole ? WEIGHTS.ROLE_BALANCE : 0;
    }

    // Specialty balance score
    const requiredSpecialties = ['Burst', 'Crowd Control', 'Poke', 'Regen'];
    const missingSpecialties = requiredSpecialties.filter(
      spec => !teamSpecialties.has(spec)
    );
    specialtyScore = hero.speciality.filter(
      spec => missingSpecialties.includes(spec)
    ).length * WEIGHTS.SPECIALTY_BALANCE;

    // Performance score based on win rate, pick rate, and ban rate
    if (hero.win_rate && hero.pick_rate) {
      const winRate = parseFloat(hero.win_rate) / 100;
      const pickRate = parseFloat(hero.pick_rate) / 100;
      const banRate = hero.ban_rate ? parseFloat(hero.ban_rate) / 100 : 0;

      performanceScore =
        (winRate * WEIGHTS.WIN_RATE) +
        (pickRate * WEIGHTS.PICK_RATE) +
        (banRate * WEIGHTS.BAN_RATE);
    }

    // Calculate final score
    const finalScore = counterScore + synergyScore + roleScore + specialtyScore + performanceScore;

    return {
      hero,
      score: finalScore,
      breakdowns: {
        counterScore,
        synergyScore,
        roleScore,
        specialtyScore,
        performanceScore
      }
    };
  });

  // Sort heroes by score in descending order
  return heroScores
    .filter(score => score.score >= 0)
    .sort((a, b) => b.score - a.score);
}

// Helper function to get explanation for hero suggestion
export function explainHeroSuggestion(heroScore: HeroScore): string {
  const { hero, breakdowns } = heroScore;

  return `${hero.name} Suggestion Analysis:
• Counter potential: ${(breakdowns.counterScore / WEIGHTS.COUNTER * 100).toFixed(1)}%
• Team synergy: ${(breakdowns.synergyScore / WEIGHTS.SYNERGY * 100).toFixed(1)}%
• Role fit: ${(breakdowns.roleScore / WEIGHTS.ROLE_BALANCE * 100).toFixed(1)}%
• Specialty contribution: ${(breakdowns.specialtyScore / WEIGHTS.SPECIALTY_BALANCE * 100).toFixed(1)}%
• Current meta performance: ${(breakdowns.performanceScore / (WEIGHTS.WIN_RATE + WEIGHTS.PICK_RATE + WEIGHTS.BAN_RATE) * 100).toFixed(1)}%`;
}


// const fetchHeroData = async () => {
//   const response = await fetch('http://localhost:3000/api/mlbb/final')
//   const data = await response.json();
//   return data.data
// }
//
// fetchHeroData().then(heroes => {
//   console.log(suggestHeroes(["36", "60", "77", "6"], [], [], heroes));
// })

