import { NextResponse } from 'next/server'
import { ROLES } from './lib/constant'

function parseUserCookie(cookieValue) {
  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch {
    return null
  }
}

const PROTECTED_ROUTES = {
  '/admin': [ROLES.admin],
  '/owner': [ROLES.facility_owner],
  '/my-bookings': [ROLES.player, ROLES.facility_owner, ROLES.admin],
  '/profile': [ROLES.player, ROLES.facility_owner, ROLES.admin],
}

function getAllowedRoles(pathname) {
  for (const base in PROTECTED_ROUTES) {
    if (pathname === base || pathname.startsWith(base + '/')) {
      return PROTECTED_ROUTES[base]
    }
  }
  return null
}

function getRedirectForRole(role) {
  const roleToPath = { [ROLES.admin]: '/admin', [ROLES.facility_owner]: '/owner' }
  return roleToPath[role] || '/'
}

function hasRoleAccess(userRole, allowedRoles) {
  if (!allowedRoles || !userRole) return false
  
  // Handle both array and string cases
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole)
  }
  
  return allowedRoles === userRole
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from guest-only routes
  const isGuestOnly = pathname === '/auth/login' || pathname === '/auth/signup' 
  const userCookieValue = request.cookies.get('quickcourt_user')?.value
  const userFromCookie = userCookieValue ? parseUserCookie(userCookieValue) : null

  if (isGuestOnly && userFromCookie) {
    const redirectUrl = new URL(getRedirectForRole(userFromCookie.role), request.url)
    return NextResponse.redirect(redirectUrl)
  }

  const allowedRoles = getAllowedRoles(pathname)
  if (!allowedRoles) return NextResponse.next()

  const userCookie = request.cookies.get('quickcourt_user')?.value
  const user = userCookie ? parseUserCookie(userCookie) : null

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!hasRoleAccess(user.role, allowedRoles)) {
    const redirectUrl = new URL(getRedirectForRole(user.role), request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*', '/my-bookings/:path*', '/profile/:path*', '/auth/login', '/auth/signup'],
}
