import { NextResponse } from 'next/server'

function parseUserCookie(cookieValue) {
  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch {
    return null
  }
}

// Centralized route-to-roles map
const routeRoles = [
  { matcher: /^\/admin(\/.*)?$/, roles: ['admin'] },
  { matcher: /^\/owner(\/.*)?$/, roles: ['owner'] },
  { matcher: /^\/(my-bookings|profile|venues)(\/.*)?$/, roles: ['player', 'owner', 'admin'] },
]

function getAllowedRolesForPath(pathname) {
  for (const entry of routeRoles) {
    if (entry.matcher.test(pathname)) return entry.roles
  }
  return null // public route
}

function getRedirectForRole(role) {
  if (role === 'admin') return '/admin'
  if (role === 'owner') return '/owner'
  return '/'
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  const allowedRoles = getAllowedRolesForPath(pathname)
  if (!allowedRoles) {
    return NextResponse.next()
  }

  const userCookie = request.cookies.get('quickcourt_user')?.value
  const user = userCookie ? parseUserCookie(userCookie) : null

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectUrl = new URL(getRedirectForRole(user.role), request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/owner/:path*',
    '/my-bookings/:path*',
    '/profile/:path*',
    '/venues/:path*',
  ],
}
