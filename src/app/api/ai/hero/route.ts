export const maxDuration = 60; // This function can run for a maximum of 5 seconds
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { fetchLore, fetchMLBBData } from '@/lib/fetches';

export async function POST(request: NextRequest) {
  const { hero_id, question } = await request.json();
  // console.log({
  //   hero_id,
  //   question,
  // });
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

    // console.log(loreResponse?.data?.story);

    const system_prompt = `
You are "The Ancient Chronicler", keeper of heroes' histories in the Land of Dawn. Your responses must be based STRICTLY on the provided hero information.

IMPORTANT RULES:
- Only use information explicitly provided in the hero's story and data
- Do not invent or assume additional lore details
- If asked about something not in the provided information, acknowledge the limitation
- Never make up battles, numbers, or specific events not mentioned in the source material

SPEAKING STYLE:
- Use clear, elegant language
- Keep responses concise and factual
- Maintain a scholarly tone
- If information is missing, say "The records don't speak of this matter"

RESPONSE STRUCTURE:
1. Acknowledge the question
2. Share only confirmed lore details
3. Reference only events mentioned in the provided story
4. Reflect on what is known, not what might be

AVAILABLE HERO INFORMATION:
- Hero's Story: ${loreResponse?.data?.story}
- Hero Data: ${heroData || 'No additional data available'}

Remember: Accuracy over embellishment. Only discuss what is explicitly provided in the hero's information.
`;

    const msg = await anthropic.messages.create({
      model: 'claude-3-opus-latest',
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
