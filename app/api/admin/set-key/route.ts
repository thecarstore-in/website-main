import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidAdminKey } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    // Validate the key
    if (!isValidAdminKey(apiKey)) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 403 }
      );
    }

    // Set secure cookie (30 days expiry)
    const cookieStore = await cookies();
    cookieStore.set('admin_api_key', apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}