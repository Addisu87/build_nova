"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
	Button,
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui"
import {
	Heart,
	User,
	LogOut,
	Building,
	Search as SearchIcon,
	UserPlus,
	KeyRound,
	Mail,
	Lock,
	HelpCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
	const pathname = usePathname()
	const { user, signOut } = useAuth()

	// Function to get user's first name initial
	const getInitial = () => {
		if (user?.user_metadata?.full_name) {
			return user.user_metadata.full_name
				.charAt(0)
				.toUpperCase()
		}
		if (user?.email) {
			return user.email.charAt(0).toUpperCase()
		}
		return "U"
	}

	return (
		<nav className="sticky top-0 z-50 border-b bg-white">
			<div className="container mx-auto flex h-16 items-center px-4">
				{/* Logo */}
				<Link
					href="/"
					className="mr-8 flex items-center space-x-2"
				>
					<span className="text-xl font-bold text-primary">
						Nova
					</span>
				</Link>

				{/* Main Navigation */}
				<div className="hidden flex-1 items-center space-x-8 md:flex">
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary">
							<span>Buy</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Link href="/properties">
								<DropdownMenuItem>
									<Building className="mr-2 h-4 w-4" />
									Browse Properties
								</DropdownMenuItem>
							</Link>
							<Link href="/search">
								<DropdownMenuItem>
									<SearchIcon className="mr-2 h-4 w-4" />
									Search Properties
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>

					<Link
						href="/properties/rent"
						className="text-sm font-medium text-gray-700 hover:text-primary"
					>
						Rent
					</Link>
					<Link
						href="/agents"
						className="text-sm font-medium text-gray-700 hover:text-primary"
					>
						Agents
					</Link>
				</div>

				{/* Right Side Navigation */}
				<div className="flex items-center space-x-4">
					{/* Search Button (Mobile) */}
					<Link
						href="/search"
						className="md:hidden"
					>
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
							<Button
								variant="ghost"
								className="hover:bg-accent rounded-full p-0"
							>
								<Avatar className="h-8 w-8">
									{user ? (
										<>
											<AvatarImage
												src={
													user.user_metadata
														?.avatar_url
												}
												alt={
													user.user_metadata
														?.full_name ||
													user.email
												}
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
						<DropdownMenuContent
							align="end"
							className="w-64 mt-2"
						>
							{user ? (
								<>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium">
												{user.user_metadata
													?.full_name ||
													user.email}
											</p>
											<p className="text-xs text-gray-500">
												{user.email}
											</p>
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
									<DropdownMenuItem
										onClick={() => signOut()}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</>
							) : (
								<>
									<DropdownMenuGroup>
										<Link href="/auth/login">
											<DropdownMenuItem className="font-medium">
												<KeyRound className="mr-2 h-4 w-4" />
												Sign in
											</DropdownMenuItem>
										</Link>
										<Link href="/auth/signup">
											<DropdownMenuItem>
												<UserPlus className="mr-2 h-4 w-4" />
												Create account
											</DropdownMenuItem>
										</Link>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<Link href="/auth/verify-email">
											<DropdownMenuItem>
												<Mail className="mr-2 h-4 w-4" />
												Verify email
											</DropdownMenuItem>
										</Link>
										<Link href="/auth/reset-password">
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
	)
}
