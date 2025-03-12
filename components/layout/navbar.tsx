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
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link
					href="/"
					className="text-2xl font-bold text-blue-600"
				>
					Nova
				</Link>

				<div className="flex items-center gap-4">
					{user ? (
						<>
							<Link href="/favorites">
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"transition-colors duration-200 hover:bg-gray-100/80",
										pathname === "/favorites" &&
											"bg-gray-100",
									)}
									aria-label="Favorites"
								>
									<Heart className="h-5 w-5" />
								</Button>
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										className="flex items-center justify-center rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:opacity-90"
										aria-label="User menu"
									>
										<Avatar>
											<AvatarImage
												src={
													user.user_metadata
														?.avatar_url || null
												}
												size="sm"
												alt={
													user.user_metadata
														?.full_name || "User"
												}
											/>
											<AvatarFallback>
												<div className="bg-blue-100 text-blue-600 flex items-center justify-center h-full w-full">
													{user.user_metadata
														?.full_name?.[0] ||
														"U"}
												</div>
											</AvatarFallback>
										</Avatar>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-56 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
								>
									<div className="px-2 py-2">
										<p className="text-sm font-medium">
											{user.user_metadata
												?.full_name || "User"}
										</p>
										<p className="text-xs text-gray-500 truncate mt-0.5">
											{user.email}
										</p>
									</div>
									<DropdownMenuSeparator />
									<Link href="/auth/profile">
										<DropdownMenuItem className="cursor-pointer transition-colors duration-150 hover:bg-gray-100/80">
											<User className="mr-2 h-4 w-4" />
											Profile
										</DropdownMenuItem>
									</Link>
									<DropdownMenuItem
										onClick={signOut}
										className="cursor-pointer transition-colors duration-150 hover:bg-gray-100/80"
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="transition-colors duration-200 hover:bg-gray-100/80"
									aria-label="Menu"
								>
									<User className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56 overflow-hidden animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
							>
								<Link href="/auth/login">
									<DropdownMenuItem className="cursor-pointer transition-colors duration-150 hover:bg-gray-100/80">
										<LogOut className="mr-2 h-4 w-4" />
										Sign In
									</DropdownMenuItem>
								</Link>
								<Link href="/auth/signup">
									<DropdownMenuItem className="cursor-pointer transition-colors duration-150 hover:bg-gray-100/80">
										<User className="mr-2 h-4 w-4" />
										Sign Up
									</DropdownMenuItem>
								</Link>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</nav>
	)
}
