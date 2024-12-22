
// export { auth as middleware } from "@/auth"

import { auth } from "@/auth"
import { NextResponse } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  // Check if the requested path is a protected route
  const isProtectedRoute = !publicRoutes.includes(nextUrl.pathname) && 
    (nextUrl.pathname.startsWith('/dashboard') 
    // || 
    //  nextUrl.pathname.startsWith('/profile')
    );

  if (isProtectedRoute && !isLoggedIn) {
    // Redirect to login page with callback URL
    const redirectUrl = new URL('/login', nextUrl.origin)
    redirectUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow access to public routes and authenticated users
  return NextResponse.next()
})
