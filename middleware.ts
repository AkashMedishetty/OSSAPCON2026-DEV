import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { logAuthError } from './lib/utils/auth-debug'

// Protected routes that require authentication
export const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/api/user'
]

// Auth routes that should not be accessed when logged in
export const authRoutes = [
  '/auth/login',
  '/auth/register'
]

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Debug RSC requests
  const isRSCRequest = searchParams.has('_rsc')
  const acceptHeader = request.headers.get('accept') || ''
  const isServerComponent = acceptHeader.includes('text/x-component')
  
  if (isRSCRequest || isServerComponent) {
    console.log(`🔍 RSC Request: ${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`)
    console.log(`🔍 Accept: ${acceptHeader}`)
    console.log(`🔍 Headers:`, Object.fromEntries(request.headers.entries()))
  }

  // Bypass auth and disable caching for registration and auth pages (fix mobile redirect caching)
  if (pathname === '/register' || pathname.startsWith('/register/') || pathname.startsWith('/auth')) {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')
    res.headers.set('Vary', 'Cookie, Authorization')
    
    // no-op
    
    return res
  }

  const token = await getToken({ req: request })
  let isAuthenticated = !!token
  // Fallback: if NextAuth JWT not parsed yet but session cookie exists, allow pass-through
  if (!isAuthenticated) {
    const hasSessionCookie = request.cookies.has('__Secure-next-auth.session-token') || request.cookies.has('next-auth.session-token')
    if (hasSessionCookie) {
      isAuthenticated = true
    }
  }

  // Enhanced cache control for auth-related routes
  const response = NextResponse.next()
  
  // More aggressive cache control for auth and API routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth') || pathname.startsWith('/dashboard')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    response.headers.set('Vary', 'Cookie, Authorization')
  } else {
    // Less aggressive caching for static content
    response.headers.set('Cache-Control', 'no-cache, must-revalidate')
  }

  // Prevent redirect loops with more comprehensive checks
  const redirectCount = parseInt(searchParams.get('redirectCount') || '0')
  if (redirectCount > 3) {
    logAuthError(new Error('Redirect loop detected'), 'MIDDLEWARE', { pathname })
    return NextResponse.redirect(new URL('/auth/error?error=RedirectLoop', request.url))
  }

  // Handle auth routes
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
      loginUrl.searchParams.set('redirectCount', (redirectCount + 1).toString())
      return NextResponse.redirect(loginUrl)
    }
  }

  // Clear conflicting cookies if present
  const cookies = request.cookies
  if (cookies.has('legacy-session') || cookies.has('conflicting-cookie')) {
    response.cookies.delete('legacy-session')
    response.cookies.delete('conflicting-cookie')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|Favicons|android-chrome|apple-touch-icon|site.webmanifest|browserconfig.xml|sw.js|sw-force-update.js).*)',
  ],
}