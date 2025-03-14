"use client"

import { Input } from "@/components/ui"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SearchBar() {
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
			className="relative w-full max-w-md"
		>
			<Input
				type="text"
				placeholder="Search properties..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="pl-10 pr-4"
			/>
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
		</form>
	)
}
