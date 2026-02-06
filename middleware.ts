import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// HARDCODED ADMIN API KEY - Must match the one in admin page
const ADMIN_API_KEY = 'your-secret-admin-key-here';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (pathname.startsWith('/admin-upload-secret')) {
    const apiKey = request.cookies.get('admin_api_key')?.value;

    // If no valid API key, redirect to setup page
    if (apiKey !== ADMIN_API_KEY) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin-setup';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin-upload-secret/:path*',
};