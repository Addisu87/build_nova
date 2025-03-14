import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define routes that don't require authentication
const publicRoutes = [
	"/", // Home page
	"/properties", // Property listings
	"/search", // Search page
	"/auth/login",
	"/auth/signup",
	"/auth/reset-password",
]

// Define protected routes that require authentication
const protectedRoutes = [
	"/favorites",
	"/auth/profile",
	"/properties/create", // If you have property creation
	"/properties/edit", // If you have property editing
]

// Define admin routes that require admin role
const adminRoutes = ["/admin"]

export async function middleware(
	req: NextRequest,
) {
	const res = NextResponse.next()
	const supabase = createMiddlewareClient({
		req,
		res,
	})
	const {
		data: { session },
	} = await supabase.auth.getSession()

	const path = req.nextUrl.pathname

	// Allow public routes without authentication
	if (
		publicRoutes.some((route) =>
			path.startsWith(route),
		)
	) {
		return res
	}

	// Check if the current path is a protected route
	const isProtectedRoute = protectedRoutes.some(
		(route) => path.startsWith(route),
	)

	// Check if the current path is an admin route
	const isAdminRoute = adminRoutes.some((route) =>
		path.startsWith(route),
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
