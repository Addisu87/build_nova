"use client"

import { useAuth } from "@/contexts/auth-context"
import { usePropertyFavorites } from "@/hooks/favorites/use-property-favorites"
import { PropertyCard, PropertiesGrid } from "@/components/features/properties"
import { LoadingState } from "@/components/ui/loading-state"
import {
	Button,
	Skeleton,
	Input,
	Label,
	Avatar,
} from "@/components/ui"
import { motion } from "framer-motion"

export default function ProfilePage() {
	const { user, isLoading: authLoading } = useAuth()
	const { data: favorites, isLoading: favoritesLoading } = usePropertyFavorites()

	if (authLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<LoadingState type="profile" />
			</main>
		)
	}

	if (!user) {
		return (
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold">Please sign in to view your profile</h1>
			</main>
		)
	}

	if (favoritesLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="space-y-8">
					<Skeleton className="h-8 w-48" />
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</div>
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
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<Avatar 
							src={user.user_metadata?.avatar_url} 
							size="lg" 
							alt={user.user_metadata?.full_name || user.email}
						/>
						<h1 className="text-4xl font-bold">
							Profile
						</h1>
					</div>
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
					{favorites?.length === 0 ? (
						<p className="text-gray-600">
							You haven't added any properties to your favorites yet.
						</p>
					) : (
						<PropertiesGrid
							properties={favorites}
							customPropertyCard={(property) => (
								<PropertyCard
									key={property.id}
									property={property}
									isFavorite={true}
									onFavorite={(propertyId) => {
										const favoriteId = property.favoriteId;
										if (favoriteId) {
											removeFavorite(favoriteId);
										}
									}}
								/>
							)}
						/>
					)}
				</div>
				</div>
			</motion.div>
		</main>
	)
}
