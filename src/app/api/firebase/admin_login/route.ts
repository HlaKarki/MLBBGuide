import { NextRequest, NextResponse } from 'next/server';

const EMAIL = process.env.FIREBASE_VERIFIED_EMAIL
const PASSWORD = process.env.FIREBASE_VERIFIED_PASSWORD

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const password = request.nextUrl.searchParams.get("password");

  console.log({
    EMAIL,
    PASSWORD,
    email,
    password
  });
  if (email && password && (email === EMAIL && password === PASSWORD)) {
    return NextResponse.json({
      success: true,
      message: 'All good boi'
    })
  } else {
    return NextResponse.json({
      success: false,
      message: 'Wrong credentials boi',
    })
  }
}