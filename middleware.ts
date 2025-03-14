import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Move these to a shared config file that can be imported by both middleware and auth context
export const AUTH_ROUTES = {
  public: [
    "/",
    "/properties",
    "/search",
    "/auth/login",
    "/auth/signup",
    "/auth/reset-password",
  ],
  protected: [
    "/favorites",
    "/auth/profile",
    "/properties/create",
    "/properties/edit",
  ],
  admin: ["/admin"]
} as const

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Allow public routes without authentication
  if (AUTH_ROUTES.public.some((route) => path.startsWith(route))) {
    return res
  }

  // Check if the current path is a protected route
  const isProtectedRoute = AUTH_ROUTES.protected.some(
    (route) => path.startsWith(route)
  )

  // Check if the current path is an admin route
  const isAdminRoute = AUTH_ROUTES.admin.some(
    (route) => path.startsWith(route)
  )

  // If user is not signed in and trying to access a protected route,
	// redirect to login
	if (!session && isProtectedRoute) {
		const redirectUrl = new URL(
			"/auth/login",
			req.url,
		)
		redirectUrl.searchParams.set(
			"redirectedFrom",
			path,
		)
		return NextResponse.redirect(redirectUrl)
	}

	// If user is not an admin and trying to access admin routes,
	// redirect to home page
	if (isAdminRoute && session) {
		const {
			data: { user },
		} = await supabase.auth.getUser()
		const isAdmin =
			user?.user_metadata?.role === "admin"
		if (!isAdmin) {
			return NextResponse.redirect(
				new URL("/", req.url),
			)
		}
	}

	return res
}

// Configure which routes to run middleware on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 * - api routes that should be public
		 */
		"/((?!_next/static|_next/image|favicon.ico|public|api/public).*)",
	],
}
