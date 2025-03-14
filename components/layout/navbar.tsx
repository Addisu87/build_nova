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
	Home,
	User,
	LogOut,
	Settings,
	Search,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
	const pathname = usePathname()
	const { user, signOut } = useAuth()

	return (
		<nav className="border-b bg-white">
			<div className="container mx-auto flex h-16 items-center px-4">
				<Link
					href="/"
					className="mr-6 flex items-center space-x-2"
				>
					<span className="text-xl font-bold">
						Nova
					</span>
				</Link>

				<div className="flex flex-1 items-center space-x-4">
					<Link
						href="/properties"
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							pathname === "/properties"
								? "text-primary"
								: "text-gray-600",
						)}
					>
						Properties
					</Link>
					<Link
						href="/search"
						className={cn(
							"text-sm font-medium transition-colors hover:text-primary",
							pathname === "/search"
								? "text-primary"
								: "text-gray-600",
						)}
					>
						Search
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					{user ? (
						<>
							<Link href="/favorites">
								<Button
									variant="ghost"
									size="icon"
								>
									<Heart className="h-5 w-5" />
								</Button>
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="relative h-8 w-8 rounded-full"
									>
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={
													user.user_metadata
														?.avatar_url
												}
												alt={user.email}
											/>
											<AvatarFallback>
												{user.email
													?.charAt(0)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<Link href="/auth/profile">
										<DropdownMenuItem>
											<User className="mr-2 h-4 w-4" />
											Profile
										</DropdownMenuItem>
									</Link>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => signOut()}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<div className="flex items-center space-x-2">
							<Link href="/auth/login">
								<Button variant="ghost">
									Sign In
								</Button>
							</Link>
							<Link href="/auth/signup">
								<Button>Sign Up</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	)
}
