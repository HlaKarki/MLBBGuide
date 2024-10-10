// src/app/api/mlbb/lore/route.ts
import {NextRequest, NextResponse} from "next/server";

const baseUrl = process.env.MLBB_API_LORE_URL || "";

export async function GET(request: NextRequest) {
  const hero_name = request.nextUrl.searchParams.get("name") || "Miya";

  const formData = new URLSearchParams({
    name: hero_name,
    type: 'story',
    lang: 'en',
    is_preview: 'null',
    sort: '0',
  });

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });

    if (!response.ok) throw new Error(`API responded with status: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching lore data:', error);
    return NextResponse.json({ error: 'Failed to fetch lore data' }, { status: 500 });
  }
}