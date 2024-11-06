import { FinalHeroDataType } from '@/lib/types';

export function suggestHeroes(
  teamPicks: string[],
  enemyPicks: string[],
  bannedHeroes: string[],
  allHeroes: FinalHeroDataType[]
): FinalHeroDataType[] {
  const WEIGHT_COUNTER = 3;
  const WEIGHT_SYNERGY = 2;
  const WEIGHT_ROLE_BALANCE = 2;
  const WEIGHT_SPECIALTY_BALANCE = 1;

  // Determine missing roles and specialties in the team
  const teamRoles = new Set<string>();
  const teamSpecialties = new Set<string>();
  teamPicks.forEach((heroId) => {
    const hero = allHeroes.find((h) => h.hero_id === heroId);
    if (hero) {
      hero.role.forEach((role) => teamRoles.add(role));
      hero.speciality.forEach((spec) => teamSpecialties.add(spec));
    }
  });

  // const requiredRoles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  const requiredRoles = ['Roam', 'Exp Lane', 'Jungle', 'Mid Lane', 'Gold Lane'];
  const missingRoles = requiredRoles.filter((role) => !teamRoles.has(role));

  const requiredSpecialties = ['Burst', 'Chase', 'Crowd Control', 'Poke', 'Regen'];
  const missingSpecialties = requiredSpecialties.filter((spec) => !teamSpecialties.has(spec));

  const availableHeroes = allHeroes.filter(
    (hero) =>
      !teamPicks.includes(hero.hero_id) &&
      !enemyPicks.includes(hero.hero_id) &&
      !bannedHeroes.includes(hero.hero_id)
  );

  const heroScores: { [heroId: string]: number } = {};

  availableHeroes.forEach((hero) => {
    let score = 0;

    // Avoid Weaknesses
    if (
      hero.ineffective &&
      hero.ineffective.some((counterHero) => enemyPicks.includes(counterHero.hero_id))
    ) {
      return; // Skip this hero
    }

    // Counter Picks
    if (hero.effective) {
      enemyPicks.forEach((enemyHeroId) => {
        if (hero.effective?.some((counterHero) => counterHero.hero_id === enemyHeroId)) {
          score += WEIGHT_COUNTER;
        }
      });
    }

    // Synergy Picks
    if (hero.compatible) {
      teamPicks.forEach((teamHeroId) => {
        if (hero.compatible?.some((compHero) => compHero.hero_id === teamHeroId)) {
          score += WEIGHT_SYNERGY;
        }
      });
    }

    // Role Balance
    if (hero.role.some((role) => missingRoles.includes(role))) {
      score += WEIGHT_ROLE_BALANCE;
    }

    // Specialty Balance
    if (hero.speciality.some((spec) => missingSpecialties.includes(spec))) {
      score += WEIGHT_SPECIALTY_BALANCE;
    }

    heroScores[hero.hero_id] = score;
  });

  // Sort heroes by score in descending order
  const recommendedHeroes = availableHeroes
    .filter((hero) => heroScores.hasOwnProperty(hero.hero_id))
    .sort((a, b) => heroScores[b.hero_id] - heroScores[a.hero_id]);

  return recommendedHeroes;
}



/*
**
**
function recommendHeroes(teamPicks, enemyPicks, bannedHeroes):
    availableHeroes = allHeroes - teamPicks - enemyPicks - bannedHeroes
    heroScores = {}

    for hero in availableHeroes:
        score = 0

        // Avoid Weaknesses
        if hero is ineffective against any enemyPicks:
            continue  // Skip this hero

        // Counter Picks
        for enemyHero in enemyPicks:
            if hero is effective against enemyHero:
                score += WEIGHT_COUNTER

        // Synergy Picks
        for teamHero in teamPicks:
            if hero is compatible with teamHero:
                score += WEIGHT_SYNERGY

        // Role Balance
        if hero's role fills a missing team role:
            score += WEIGHT_ROLE_BALANCE

        // Specialty Balance
        if hero's specialty fills a missing specialty:
            score += WEIGHT_SPECIALTY_BALANCE

        heroScores[hero] = score

    // Sort heroes by score in descending order
    recommendedHeroes = sortByValue(heroScores, descending=True)
    return recommendedHeroes

*
*
*
*
def suggest_hero(team_picks=[], enemy_picks=[], banned_heroes=[], player_preferences=[]):
    available_heroes = get_available_heroes(banned_heroes)
    scored_heroes = []

    for hero in available_heroes:
        score = 0

        # Team composition score
        score += evaluate_team_composition(hero, team_picks)

        # Counter-picking score
        score += evaluate_counter_opportunities(hero, enemy_picks)

        # Synergy score
        score += evaluate_team_synergy(hero, team_picks)

        # Meta relevance score
        score += get_meta_score(hero)

        # Player proficiency score
        score += evaluate_player_proficiency(hero, player_preferences)

        scored_heroes.append((hero, score))

    return sorted(scored_heroes, key=lambda x: x[1], reverse=True)[:5]
 */