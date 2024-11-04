// /api/firebase/add_user/route.ts
import { db } from '@/lib/db/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    // Verify authentication
    const auth = getAuth(request);
    if (!auth.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

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
    console.error('Error adding user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}