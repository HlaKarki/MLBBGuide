// src/app/api/firebase/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Fetch all documents from the 'test' collection
    const snapshot = await db.collection('test').get();
    // Map over documents to extract data
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Return data as JSON response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error signing in:', error);
  }
}