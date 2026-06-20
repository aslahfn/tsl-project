import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminJWT } from '@/lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Routes protection
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    // Admin login page check
    if (pathname === '/admin/login') {
      if (adminToken) {
        const payload = await verifyAdminJWT(adminToken);
        if (payload && payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
      return NextResponse.next();
    }

    // Protect all other admin pages
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyAdminJWT(adminToken);
    if (!payload || payload.role !== 'admin') {
      // Not an admin or invalid token, delete cookie and redirect
      const response = NextResponse.redirect(new URL('/admin/login?error=AccessDenied', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    return NextResponse.next();
  }

  // 2. User Protected Routes (e.g., /profile)
  if (pathname.startsWith('/profile')) {
    const isProd = process.env.NODE_ENV === 'production';
    const nextAuthCookieName = isProd ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const sessionToken = request.cookies.get(nextAuthCookieName)?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  // Allow access to login page for users
  if (pathname === '/login') {
    const isProd = process.env.NODE_ENV === 'production';
    const nextAuthCookieName = isProd ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const sessionToken = request.cookies.get(nextAuthCookieName)?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/login'],
};
