import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = [
	"/auth/login",
	"/auth/signup",
	"/auth/reset-password",
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

	// Check if the current path is a public route
	const isPublicRoute = publicRoutes.some(
		(route) =>
			req.nextUrl.pathname.startsWith(route),
	)

	// Check if the current path is an admin route
	const isAdminRoute = adminRoutes.some((route) =>
		req.nextUrl.pathname.startsWith(route),
	)

	// If user is not signed in and the current path is not a public route,
	// redirect the user to /auth/login
	if (!session && !isPublicRoute) {
		const redirectUrl = new URL(
			"/auth/login",
			req.url,
		)
		redirectUrl.searchParams.set(
			"redirectedFrom",
			req.nextUrl.pathname,
		)
		return NextResponse.redirect(redirectUrl)
	}

	// If user is signed in and the current path is a public route,
	// redirect the user to /
	if (session && isPublicRoute) {
		return NextResponse.redirect(
			new URL("/", req.url),
		)
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
		 */
		"/((?!_next/static|_next/image|favicon.ico|public).*)",
	],
}
