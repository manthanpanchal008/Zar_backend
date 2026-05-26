import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle internal requests, APIs, and static files
  if (
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/careers' ||
    pathname === '/clientele' ||
    pathname === '/collections' ||
    pathname.startsWith('/collections/') ||
    pathname === '/contact' ||
    pathname === '/partner' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/event' ||
    pathname.startsWith('/product') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // We rewrite the request to a non-existent path so that Next.js 
  // automatically handles it with its default 404 Not Found page
  // while keeping the original URL in the user's browser.
  return NextResponse.rewrite(new URL('/404', request.url));
}

// The matcher ensures middleware is only triggered on document pathways
// and ignored for static files, APIs, and Next.js internal calls.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.png).*)',
  ],
};
