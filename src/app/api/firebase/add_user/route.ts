import { db } from '@/lib/db/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    // Add the new user to Firestore
    await db.collection('users').doc(body.clerk_id).set(
      {
        ...body,
        createdAt: new Date()
      },
    )

    return NextResponse.json({
      success: true,
      message: 'Successfully created user',
      error: undefined
    })
  } catch(error) {
    return NextResponse.json({
      success: false,
      message: "Failed to create user",
      error: error
    })
  }
}