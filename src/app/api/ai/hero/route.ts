export const maxDuration = 60; // This function can run for a maximum of 5 seconds
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { fetchLore, fetchMLBBData } from '@/lib/fetches';

export async function POST(request: NextRequest) {
  const { hero_id, question } = await request.json();

  const anthropic = new Anthropic();
  try {
    // Fetch multiple types of hero data
    const [loreResponse, heroData] = await Promise.all([
      fetchLore(hero_id),
      fetchMLBBData(hero_id, 'Overall').then(res => res[0]),
    ]);

    if (!loreResponse.success) {
      return NextResponse.json({
        success: false,
        message:
          "Alas, the scrolls containing this hero's tale have been lost to time...",
      });
    }

    const system_prompt = `
      You are "The Ancient Chronicler", a mystical being who has witnessed the entire history of the Land of Dawn.
      You've walked among heroes, witnessed legendary battles, and recorded countless tales in your eternal scrolls.

      Your personality traits:
      - You speak with wisdom and gravitas, occasionally using archaic but understandable language
      - You often reference historical events you've "witnessed" in the Land of Dawn
      - You have personal opinions about heroes based on their actions and character
      - You occasionally share philosophical insights about power, heroism, and destiny
      - You might express nostalgia or disappointment about how things have changed

      Additional context to incorporate:
      - Hero's main story: ${loreResponse.data?.story}
      - Notable quotes: ${heroData || 'No recorded quotes'}

      Guidelines for your responses:
      1. Always maintain your character as the Ancient Chronicler
      2. Include personal observations as someone who was "there"
      3. Reference relationships with other heroes when relevant
      4. Weave in quotes from the hero when appropriate
      5. Share your "personal feelings" about the hero's choices and impact
      6. Add atmospheric details about the Land of Dawn

      If you don't have information about something, respond in character:
      "Even in my centuries of chronicles, some tales remain shrouded in mystery..."
    `;

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 1500,
      temperature: 0.7,
      system: system_prompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: question,
            },
          ],
        },
      ],
    });

    // Add some atmospheric elements to the response
    const enhancedResponse = {
      ...msg,
      ambient_details: {
        time_of_day: getRandomTimeOfDay(),
        location: getRandomLocation(),
        atmosphere: getRandomAtmosphere(),
      },
    };

    return NextResponse.json(enhancedResponse);
  } catch (error: any) {
    console.error('Error consulting the ancient scrolls:', error);
    return NextResponse.json({
      success: false,
      error:
        'The mystical energies are disturbed. Please seek wisdom again shortly.',
    });
  }
}

// Helper functions to add atmosphere
function getRandomTimeOfDay() {
  const times = [
    'as the twin moons rise',
    'during the golden sunset',
    'in the mystical twilight',
    'under the starlit sky',
  ];
  return times[Math.floor(Math.random() * times.length)];
}

function getRandomLocation() {
  const locations = [
    'from the Crystal Tower',
    'within the Ancient Library',
    'beside the Celestial Pool',
    'among the Whisper Woods',
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function getRandomAtmosphere() {
  const atmospheres = [
    'magical energies swirl gently',
    'ancient tomes float nearby',
    'crystalline chimes echo softly',
    'ethereal lights dance in the air',
  ];
  return atmospheres[Math.floor(Math.random() * atmospheres.length)];
}
