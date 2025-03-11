"use client"

import { useAuth } from "@/hooks/auth/use-auth"
import { usePropertyFavorites } from "@/hooks/favorites/use-property-favorites"
import { PropertyCard } from "@/components/properties/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function ProfilePage() {
	const { user } = useAuth()
	const { data: favorites, isLoading } =
		usePropertyFavorites()

	if (!user) {
		return (
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold">
					Please sign in to view your profile
				</h1>
			</main>
		)
	}

	if (isLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="space-y-8"
				>
					<Skeleton className="h-8 w-48" />
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</motion.div>
			</main>
		)
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="space-y-8"
			>
				<div className="space-y-4">
					<h1 className="text-4xl font-bold">
						Profile
					</h1>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={user.email}
								disabled
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								value={
									user.user_metadata?.full_name ||
									""
								}
								disabled
							/>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold">
						Your Favorites
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{favorites?.map((property) => (
							<PropertyCard
								key={property.id}
								property={property}
								isFavorite={true}
							/>
						))}
					</div>
				</div>
			</motion.div>
		</main>
	)
}
