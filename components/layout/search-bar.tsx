"use client"

import { Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface SearchBarProps {
	variant?: "default" | "hero"
	className?: string
}

export function SearchBar({
	variant = "default",
	className,
}: SearchBarProps) {
	const router = useRouter()
	const [query, setQuery] = useState("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim()) {
			router.push(
				`/search?q=${encodeURIComponent(
					query.trim(),
				)}`,
			)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={cn("relative w-full", className)}
		>
			<div className="relative">
				<Input
					type="text"
					placeholder="Search properties..."
					value={query}
					onChange={(e) =>
						setQuery(e.target.value)
					}
					className={cn(
						"w-full pl-12 pr-4 text-base",
						variant === "hero" &&
							"h-14 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-full shadow-lg focus:ring-2 focus:ring-primary/50 text-lg",
					)}
				/>
				<Search
					className={cn(
						"absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5",
						variant === "hero"
							? "text-gray-500"
							: "text-muted-foreground",
					)}
				/>
			</div>
		</form>
	)
}
