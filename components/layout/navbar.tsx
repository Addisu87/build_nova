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
	KeyRound,
	Lock,
	LogOut,
	Mail,
	Search as SearchIcon,
	User,
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

							{/* Favorites */}
							{user && (
								<Link href="/favorites">
									<Button variant="ghost" size="icon">
										<Heart className="h-5 w-5" />
									</Button>
								</Link>
							)}

							{/* Auth Dropdown - Simplified */}

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="hover:bg-accent rounded-full p-0">
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
								<DropdownMenuContent align="end" className="w-64 mt-2">
									{user ? (
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
											<DropdownMenuGroup>
												<Link href="/auth/profile">
													<DropdownMenuItem>
														<User className="mr-2 h-4 w-4" />
														Profile
													</DropdownMenuItem>
												</Link>
												<Link href="/favorites">
													<DropdownMenuItem>
														<Heart className="mr-2 h-4 w-4" />
														Saved Properties
													</DropdownMenuItem>
												</Link>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => signOut()}>
												<LogOut className="mr-2 h-4 w-4" />
												Sign Out
											</DropdownMenuItem>
										</>
									) : (
										<>
											<DropdownMenuGroup>
												<Link href="?auth=login" shallow>
													<DropdownMenuItem className="font-medium">
														<KeyRound className="mr-2 h-4 w-4" />
														Create account
													</DropdownMenuItem>
												</Link>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<DropdownMenuGroup>
												<Link href="?auth=verify-email" shallow>
													<DropdownMenuItem>
														<Mail className="mr-2 h-4 w-4" />
														Verify email
													</DropdownMenuItem>
												</Link>
												<Link href="?auth=reset-password" shallow>
													<DropdownMenuItem>
														<Lock className="mr-2 h-4 w-4" />
														Reset password
													</DropdownMenuItem>
												</Link>
											</DropdownMenuGroup>
											<DropdownMenuSeparator />
											<Link href="/help/auth">
												<DropdownMenuItem>
													<HelpCircle className="mr-2 h-4 w-4" />
													Help with sign in
												</DropdownMenuItem>
											</Link>
										</>
									)}
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
