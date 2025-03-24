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
import { cn } from "@/lib/utils"
import {
	Heart,
	HelpCircle,
	Home,
	LogIn,
	LogOut,
	Search as SearchIcon,
	Settings,
	User,
	UserPlus,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function Navbar() {
	const pathname = usePathname()
	const router = useRouter()
	const { user, signOut } = useAuth()
	const [activeNav, setActiveNav] = useState<string | null>(null)

	// Function to get user's first name initial
	const getInitial = () => {
		if (user?.user_metadata?.full_name) {
			return user.user_metadata.full_name.charAt(0).toUpperCase()
		}
		if (user?.email) {
			return user.email.charAt(0).toUpperCase()
		}
		return "U"
	}

	const navItems = {
		buy: {
			title: "Buy",
			links: [
				"Browse all homes",
				"Browse homes nearby",
				"New Construction",
				"Open Houses",
				"Recently Sold",
				"New Listings",
			],
		},
		rent: {
			title: "Rent",
			links: [
				"All rental listings",
				"Apartments for rent",
				"Houses for rent",
				"Pet friendly rentals",
				"Student housing",
			],
		},
		sell: {
			title: "Sell",
			links: [
				"List your property",
				"Home valuation",
				"Agent finder",
				"Seller guide",
				"Marketing solutions",
			],
		},
	}

	const toggleNav = (nav: string) => {
		setActiveNav(activeNav === nav ? null : nav)
		// Prevent scrolling when modal is open
		if (activeNav === nav) {
			document.body.style.overflow = ""
		} else {
			document.body.style.overflow = "hidden"
		}
	}

	const userNavItems = user
		? [
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
				{
					label: "Sign Out",
					icon: <LogOut className="mr-2 h-4 w-4" />,
					onClick: () => signOut(),
				},
		  ]
		: [
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
				{
					label: "Help",
					icon: <HelpCircle className="mr-2 h-4 w-4" />,
					href: "/help/auth",
				},
		  ]

	return (
		<>
			<div className="sticky top-0 z-50 bg-white">
				<nav className="border-b">
					<div className="container mx-auto flex h-16 items-center px-4">
						{/* Logo */}
						<Link href="/" className="mr-8 flex items-center space-x-2">
							<span className="text-xl font-bold text-primary">Nova</span>
						</Link>

						{/* Main Navigation */}
						<div className="hidden flex-1 items-center space-x-8 md:flex">
							{Object.entries(navItems).map(([key, value]) => (
								<button
									key={key}
									onClick={() => toggleNav(key)}
									className={cn(
										"text-sm font-medium text-gray-700 hover:text-primary",
										activeNav === key && "text-primary",
									)}
								>
									{value.title}
								</button>
							))}
						</div>

						{/* Right Side Navigation */}
						<div className="flex items-center space-x-4">
							{/* Search Button (Mobile) */}
							<Link href="/search" className="md:hidden">
								<Button variant="ghost" size="icon">
									<SearchIcon className="h-5 w-5" />
								</Button>
							</Link>

							{/* User Navigation Dropdown */}
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
										{userNavItems.map((item, index) =>
											item.href ? (
												<Link
													key={item.label}
													href={item.href}
													{...(item.shallow ? { shallow: true } : {})}
												>
													<DropdownMenuItem
														className={cn(item.primary && "font-medium text-primary")}
													>
														{item.icon}
														{item.label}
													</DropdownMenuItem>
												</Link>
											) : (
												<DropdownMenuItem key={item.label} onClick={item.onClick}>
													{item.icon}
													{item.label}
												</DropdownMenuItem>
											),
										)}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</nav>
			</div>

			{/* Full-screen Modal Navigation */}
			{activeNav && (
				<div className="fixed inset-0 z-40">
					{/* Overlay */}
					<div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => toggleNav(activeNav)}
					/>

					{/* Content */}
					<div className="absolute top-16 inset-x-0 bg-white border-b shadow-lg">
						<div className="container mx-auto px-4 py-8">
							<div className="max-w-6xl">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-8">
									{navItems[activeNav as keyof typeof navItems].links.map((link) => (
										<Link
											key={link}
											href={`/${activeNav}/${link.toLowerCase().replace(/\s+/g, "-")}`}
											className="text-gray-600 hover:text-primary hover:underline transition-colors py-2"
											onClick={() => toggleNav(activeNav)}
										>
											{link}
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
