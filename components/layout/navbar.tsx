"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { ModeToggle } from "@/lib/theme/theme-toggle"
import { cn } from "@/lib/utils"
import {
	Heart,
	HelpCircle,
	Home,
	LogIn,
	LogOut,
	Search,
	Settings,
	User,
	UserPlus,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useState, type FC } from "react"

type NavItem = {
	title: string
	links: Array<{
		label: string
		href: string
	}>
}

type UserNavItem = {
	label: string
	icon?: JSX.Element
	href?: string
	onClick?: () => void
	type?: "separator" | "theme"
	shallow?: boolean
	primary?: boolean
}

interface NavbarProps {
	className?: string
}

const navItems: Record<string, NavItem> = {
	buy: {
		title: "Buy",
		links: [
			{ label: "Browse all homes", href: "/buy/browse-all-homes" },
			{ label: "Browse homes nearby", href: "/buy/browse-homes-nearby" },
			{ label: "New Construction", href: "/buy/new-construction" },
			{ label: "Open Houses", href: "/buy/open-houses" },
			{ label: "Recently Sold", href: "/buy/recently-sold" },
			{ label: "New Listings", href: "/buy/new-listings" },
		],
	},
	rent: {
		title: "Rent",
		links: [
			{ label: "All rental listings", href: "/rent/all-rental-listings" },
			{ label: "Apartments for rent", href: "/rent/apartments" },
			{ label: "Houses for rent", href: "/rent/houses" },
			{ label: "Pet friendly rentals", href: "/rent/pet-friendly" },
			{ label: "Student housing", href: "/rent/student-housing" },
		],
	},
	sell: {
		title: "Sell",
		links: [
			{ label: "List your property", href: "/sell/list-property" },
			{ label: "Home valuation", href: "/sell/home-valuation" },
			{ label: "Agent finder", href: "/sell/agent-finder" },
			{ label: "Seller guide", href: "/sell/guide" },
			{ label: "Marketing solutions", href: "/sell/marketing" },
		],
	},
}

export const Navbar: FC<NavbarProps> = ({ className }) => {
	const pathname = usePathname()
	const router = useRouter()
	const { user, signOut } = useAuth()
	const [activeNav, setActiveNav] = useState<string | null>(null)

	const getInitial = useCallback(() => {
		if (!user) return "U"
		return (
			user.user_metadata?.full_name?.[0]?.toUpperCase() ||
			user.email?.[0]?.toUpperCase() ||
			"U"
		)
	}, [user])

	const toggleNav = useCallback((nav: string) => {
		setActiveNav((prev) => {
			const newState = prev === nav ? null : nav
			document.body.style.overflow = newState ? "hidden" : ""
			return newState
		})
	}, [])

	const getUserNavItems = useCallback((): UserNavItem[] => {
		if (user) {
			return [
				{
					label: "Profile",
					icon: <User className="mr-2 h-4 w-4" />,
					href: "/auth/profile",
				},
				{
					label: "Saved Properties",
					icon: <Heart className="mr-2 h-4 w-4" />,
					href: "/favorites",
				},
				{
					label: "My Listings",
					icon: <Home className="mr-2 h-4 w-4" />,
					href: "/properties/my-listings",
				},
				{
					label: "Settings",
					icon: <Settings className="mr-2 h-4 w-4" />,
					href: "/settings",
				},
				{ type: "separator" },
				{
					label: "Theme",
					type: "theme",
				},
				{ type: "separator" },
				{
					label: "Sign Out",
					icon: <LogOut className="mr-2 h-4 w-4" />,
					onClick: () => signOut(),
				},
			]
		}

		return [
			{
				label: "Sign In",
				icon: <LogIn className="mr-2 h-4 w-4" />,
				href: "?auth=login",
				shallow: true,
				primary: true,
			},
			{
				label: "Create Account",
				icon: <UserPlus className="mr-2 h-4 w-4" />,
				href: "?auth=signup",
				shallow: true,
			},
			{ type: "separator" },
			{
				label: "Theme",
				type: "theme",
			},
			{ type: "separator" },
			{
				label: "Help",
				icon: <HelpCircle className="mr-2 h-4 w-4" />,
				href: "/help/auth",
			},
		]
	}, [user, signOut])

	const renderNavItem = useCallback((item: UserNavItem) => {
		if (item.type === "separator") {
			return <DropdownMenuSeparator />
		}

		if (item.type === "theme") {
			return (
				<DropdownMenuItem className="pl-2">
					<div className="flex items-center w-full">
						<div className="mr-2">
							<ModeToggle />
						</div>
						{item.label}
					</div>
				</DropdownMenuItem>
			)
		}

		if (item.href) {
			return (
				<Link href={item.href} {...(item.shallow ? { shallow: true } : {})}>
					<DropdownMenuItem className={cn("pl-2", item.primary && "font-medium text-primary")}>
						{item.icon}
						{item.label}
					</DropdownMenuItem>
				</Link>
			)
		}

		return (
			<DropdownMenuItem className="pl-2" onClick={item.onClick}>
				{item.icon}
				{item.label}
			</DropdownMenuItem>
		)
	}, [])

	return (
		<>
			<div className={cn("sticky top-0 z-50 bg-background border-b", className)}>
				<nav>
					<div className="container mx-auto flex h-16 items-center px-4">
						<Link href="/" className="mr-8 flex items-center space-x-2">
							<span className="text-xl font-bold text-primary">Nova</span>
						</Link>

						<div className="hidden flex-1 items-center space-x-8 md:flex">
							{Object.entries(navItems).map(([key, { title }]) => (
								<button
									key={key}
									onClick={() => toggleNav(key)}
									className={cn(
										"text-sm font-medium transition-colors",
										"text-gray-700 hover:text-primary",
										activeNav === key && "text-primary",
									)}
								>
									{title}
								</button>
							))}
						</div>

						<div className="flex items-center space-x-4">
							<Link href="/search" className="md:hidden">
								<Button variant="ghost" size="icon">
									<Search className="h-5 w-5" />
								</Button>
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="hover:bg-accent rounded-full p-0"
										aria-label="User menu"
									>
										<Avatar className="h-8 w-8">
											{user ? (
												<>
													<AvatarImage
														src={user.user_metadata?.avatar_url}
														alt={user.user_metadata?.full_name || user.email}
													/>
													<AvatarFallback className="bg-primary text-primary-foreground">
														{getInitial()}
													</AvatarFallback>
												</>
											) : (
												<AvatarFallback className="bg-gray-200">
													<User className="h-4 w-4 text-gray-500" />
												</AvatarFallback>
											)}
										</Avatar>
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent align="end" className="w-56 mt-2">
									{user && (
										<>
											<DropdownMenuLabel className="font-normal">
												<div className="flex flex-col space-y-1">
													<p className="text-sm font-medium">
														{user.user_metadata?.full_name || user.email}
													</p>
													<p className="text-xs text-gray-500">{user.email}</p>
												</div>
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
										</>
									)}

									<DropdownMenuGroup>
										{getUserNavItems().map((item, index) => (
											<div key={item.label || `item-${index}`}>
												{renderNavItem(item)}
											</div>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</nav>
			</div>

			{activeNav && (
				<div className="fixed inset-0 z-40">
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => toggleNav(activeNav)}
					/>
					<div className="absolute top-16 inset-x-0 bg-background border-b shadow-lg">
						<div className="container mx-auto px-4 py-8">
							<div className="max-w-6xl">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-8">
									{navItems[activeNav].links.map(({ label, href }) => (
										<Link
											key={href}
											href={href}
											className={cn(
												"text-muted-foreground hover:text-primary hover:underline",
												"transition-colors py-2",
											)}
											onClick={() => toggleNav(activeNav)}
										>
											{label}
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
