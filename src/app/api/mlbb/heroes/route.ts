// src/app/api/mlbb/heroes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {HeroInfo} from "@/lib/types";

const baseUrl = process.env.MLBB_API_BASE_URL;
const firstId = process.env.MLBB_FIRST_ID || "/2669606";
const secondId = process.env.MLBB_SECOND_ID_HEROES || "/2756564";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const heroId = searchParams.get('id');
  try {
    let requestBody: unknown;
    const url = baseUrl + firstId + secondId;

    if (heroId) {
      // Fetch details for a specific hero
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

    const processedData: HeroInfo = {
      name: parsedData.hero.data.name,
      head: parsedData.head,
      head_big: parsedData.head_big,
      square_head: parsedData.hero.data.squarehead,
      square_head_big: parsedData.hero.data.squareheadbig,
      createdAt: parsedData.hero._createdAt,
      updatedAt: parsedData.hero._updatedAt,
      stats: {
        Durability: parsedData.hero.data.abilityshow[0] || "0",
        Offense: parsedData.hero.data.abilityshow[1] || "0",
        "Ability Effects": parsedData.hero.data.abilityshow[2] || "0",
        Difficulty: parsedData.hero.data.abilityshow[3] || "0"
      },
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