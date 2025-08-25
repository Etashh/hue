import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = request.headers.get('host') || 'localhost:3000';
  
  // Add default username to URL if none exists
  const { pathname, search } = request.nextUrl;
  if (pathname === '/' && !search.includes('u=')) {
    const newUrl = new URL(request.nextUrl);
    newUrl.searchParams.set('u', 'Etashh');
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
