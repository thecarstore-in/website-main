import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// HARDCODED ADMIN API KEY - Must match the one in admin page
const ADMIN_API_KEY = 'your-secret-admin-key-here';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();

    // Validate against hardcoded key
    if (apiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Set session cookie (expires when browser closes)
    const cookieStore = await cookies();
    cookieStore.set('admin_api_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      // No maxAge = session cookie (deleted when browser closes)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting admin key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}