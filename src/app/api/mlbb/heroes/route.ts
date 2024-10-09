// src/app/api/mlbb/heroes/route.ts

import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.MLBB_API_BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const heroId = searchParams.get('id');
  try {
    let url: string;
    let requestBody: unknown;

    if (heroId) {
      // Fetch details for a specific hero
      url = `${API_BASE_URL}/2669606/2756564`;
      requestBody = {
        pageSize: 1,
        filters: [
          {
            field: 'hero_id',
            operator: 'eq',
            value: parseInt(heroId)
          }
        ],
        sorts: [],
        pageIndex: 1,
        object: []
      };
    } else {
      // Fetch list of all heroes
      url = `${API_BASE_URL}/2669606/2756564`;
      requestBody = {
        pageSize: 30,
        filters: [],
        sorts: [
          {
            data: {
              field: 'name',
              order: 'asc'
            },
            type: 'sequence'
          }
        ],
        pageIndex: 1,
        object: []
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Failed to fetch hero data');
      return NextResponse.json({ error: "Failed to fetch hero data" })
    }

    const data = await response.json();
    const parsedData = data["data"]["records"][0]["data"]

    const processedData = {
      name: parsedData.hero.data.name,
      head: parsedData.head,
      head_big: parsedData.head_big,
      square_head: parsedData.hero.data.squarehead,
      square_head_big: parsedData.hero.data.squareheadbig,
      createdAt: parsedData.hero._createdAt,
      updatedAt: parsedData.hero._updatedAt,
      stats: parsedData.hero.data.abilityshow,
      lane: parsedData.hero.data.roadsortlabel,
      type: parsedData.hero.data.speciality,
      title: parsedData.hero.data.story,
      relation: {
        "works_well_with": {
          heads: parsedData.relation.assist.target_hero
              .filter((hero: unknown): hero is { data: { head: string } } => typeof hero === 'object' && hero !== null)
              .map((hero: { data: { head: string }}) => hero.data.head),
          description: parsedData.relation.assist.desc
        },
        "strong_against": {
          heads: parsedData.relation.strong.target_hero
              .filter((hero: unknown): hero is { data: { head: string } } => typeof hero === 'object' && hero !== null)
              .map((hero: { data: { head: string }}) => hero.data.head),
          description: parsedData.relation.strong.desc
        },
        "weak_against": {
          heads: parsedData.relation.weak.target_hero
              .filter((hero: unknown): hero is { data: { head: string } } => typeof hero === 'object' && hero !== null)
              .map((hero: { data: { head: string }}) => hero.data.head),
          description: parsedData.relation.weak.desc
        }
      }
    }

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}