"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Heart,
	Home,
	User,
	LogOut,
} from "lucide-react"
import { useAuth } from "@/hooks/auth/use-auth"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
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
					<Link href="/">
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								pathname === "/" && "bg-gray-100",
							)}
						>
							<Home className="h-5 w-5" />
						</Button>
					</Link>

					{user ? (
						<>
							<Link href="/favorites">
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										pathname === "/favorites" &&
											"bg-gray-100",
									)}
								>
									<Heart className="h-5 w-5" />
								</Button>
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className={cn(
											pathname ===
												"/auth/profile" &&
												"bg-gray-100",
										)}
									>
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<Link href="/auth/profile">
										<DropdownMenuItem>
											Profile
										</DropdownMenuItem>
									</Link>
									<DropdownMenuItem
										onClick={signOut}
									>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<div className="flex gap-2">
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
