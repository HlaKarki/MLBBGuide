import { getHeroId, getHeroNames } from '@/lib/utils';

export function guessHeroName(message: string): {
  found: boolean;
  exact_match?: boolean;
  guesses?: string[];
  opinionated_guess?: string;
  hero_id?: number;
} {
  const heroNames = getHeroNames();
  const arrayed = message
    .replace(/[.,!?]/g, '')
    .split(' ')
    .filter(word => word.length > 1);
  console.log(arrayed);

  // Try multi-word matches first (from longest to shortest)
  for (let wordCount = 3; wordCount > 0; wordCount--) {
    let guesses: string[] = []; // Move inside the loop

    for (let i = 0; i < arrayed.length - (wordCount - 1); i++) {
      const phrase = arrayed.slice(i, i + wordCount).join(' ');
      if (phrase.length < 2) continue;

      // Try exact match first
      const exactMatch = heroNames.find(
        name => name.toLowerCase().replace(/[-']/g, '') === phrase.toLowerCase()
      );
      if (exactMatch) {
        return {
          found: true,
          exact_match: true,
          guesses: [exactMatch],
          opinionated_guess: exactMatch,
        };
      }

      // Then try partial matches
      heroNames.forEach(name => {
        const normalizedName = name.toLowerCase().replace(/[-']/g, '');

        // Check if all words in the phrase are in the hero name
        const allWordsMatch = phrase
          .toLowerCase()
          .split(' ')
          .every(word => normalizedName.includes(word));

        if (allWordsMatch) {
          guesses.push(name);
        }
      });
    }

    // If we found matches at this word count, use the best one
    if (guesses.length > 0) {
      // Remove duplicates without using Set
      guesses = guesses.filter(
        (name, index) => guesses.indexOf(name) === index
      );

      const currentPhrase = arrayed.slice(0, wordCount).join(' ').toLowerCase();

      // Find the hero name that matches the most words from the phrase
      const bestGuess = guesses.reduce((best, current) => {
        const bestMatchCount = best
          .toLowerCase()
          .split(/[-\s]/)
          .filter(word => currentPhrase.includes(word)).length;
        const currentMatchCount = current
          .toLowerCase()
          .split(/[-\s]/)
          .filter(word => currentPhrase.includes(word)).length;
        return currentMatchCount > bestMatchCount ? current : best;
      });

      return {
        found: true,
        exact_match: false,
        guesses: guesses,
        opinionated_guess: bestGuess,
        hero_id: getHeroId(bestGuess),
      };
    }
  }

  return {
    found: false,
  };
}

// testing
// const result = guessHeroName('tell me about yi sun shi\'s story');
// console.log({
//   name: result,
//   id: getHeroId(result.opinionated_guess!)
// });
//
// const result2 = guessHeroName(
//   'Can you tell me a tale about miya? how does it relate to esme? Balmond'
// );
// console.log({
//   name: result2,
//   id: getHeroId(result2.opinionated_guess!)
// });
