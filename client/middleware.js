import { NextResponse } from 'next/server'

export function middleware(request) {
  // Example: get user from cookies or session
  // const user = ...
  // Example: get allowedRoles for the route (to be implemented)
  // const allowedRoles = ...

  // Placeholder: always allow for now
  return NextResponse.next()
}

// Example matcher: protect all /admin, /owner, /my-bookings, /profile, /venues routes
export const config = {
  matcher: ['/admin/:path*', '/owner/:path*', '/my-bookings/:path*', '/profile/:path*', '/venues/:path*'],
}
