"use client"

import { PropertiesGrid, PropertyCard } from "@/components/features/properties"
import { Avatar, Input, Label } from "@/components/ui"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/favorites/use-favorites"
import { removeFavorite } from "@/lib/supabase/db"
import { useProtectedRoute } from "@/hooks/auth/use-protected-route"

export default function ProfilePage() {
	const { user } = useAuth()
	const { isLoading } = useProtectedRoute()
	const { data: favorites, isLoading: favoritesLoading } = useFavorites()

	if (isLoading || favoritesLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<LoadingState type="profile" />
			</main>
		)
	}

	if (!user) return null

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="space-y-8">
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<Avatar
							src={user.user_metadata?.avatar_url}
							size="lg"
							alt={user.user_metadata?.full_name || user.email}
						/>
						<h1 className="text-4xl font-bold">Profile</h1>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" value={user.email} disabled />
						</div>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								value={user.user_metadata?.full_name || ""}
								disabled
							/>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold">Your Favorites</h2>
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
										const favoriteId = property.favoriteId
										if (favoriteId) {
											removeFavorite(favoriteId)
										}
									}}
								/>
							)}
						/>
					)}
				</div>
			</div>
		</main>
	)
}
