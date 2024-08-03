// middleware/auth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/CreateAccount',
  '/about',
  '/contact',
  '/public/*',
];

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/transactions',
  // Add any other routes that require a connected wallet
];

const ignoredRoutes = [
  '/_next/*',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/api/*',
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  

  if (path === '/') {
    return NextResponse.redirect(new URL('/site', req.url));
  }

  // Check if the route is ignored
  if (ignoredRoutes.some(route => new RegExp(`^${route.replace('*', '.*')}$`).test(path))) {
    return NextResponse.next();
  }

  // Check if the route is protected
  if (protectedRoutes.some(route => new RegExp(`^${route}$`).test(path))) {
    const walletAddress = req.cookies.get('walletAddress')?.value;

    if (!walletAddress) {
      // Redirect to login page if wallet is not connected
      return NextResponse.redirect(new URL('/auth/Login', req.url));
    }
  }

  // Allow access to public routes and for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};