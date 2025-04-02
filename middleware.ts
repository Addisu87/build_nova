import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

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
	protected: ["/favorites", "/auth/profile", "/properties/create", "/properties/edit"],
	admin: ["/auth/admin"], // Make sure this is correct
} as const

export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	const supabase = createMiddlewareClient({ req, res })
	const { data: { session } } = await supabase.auth.getSession()

	const path = req.nextUrl.pathname

	// If trying to access admin route without auth, redirect to login
	if (path.startsWith("/auth/admin") && !session) {
		return NextResponse.redirect(
			new URL(`/auth/login?returnTo=${encodeURIComponent("/auth/admin")}`, req.url)
		)
	}

	// If user is not an admin and trying to access admin routes,
	// redirect to home page
	if (path.startsWith("/auth/admin") && session) {
		const { data: { user } } = await supabase.auth.getUser()
		const isAdmin = user?.user_metadata?.role === "admin"
		
		if (!isAdmin) {
			return NextResponse.redirect(new URL("/", req.url))
		}
	}

	return res
}

// Update the matcher configuration to explicitly include admin routes
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
		"/auth/admin"
	],
}
