"use client"

import { useEffect } from "react"
import { useFavorites } from "@/hooks/favorites/use-favorites"
import { useAuth } from "@/contexts/auth-context"
import { PropertiesGrid } from "@/components/features/properties"
import { LoadingState } from "@/components/ui/loading-state"
import { Button } from "@/components/ui"
import Link from "next/link"

export default function FavoritesPage() {
	const { user } = useAuth()
	const { 
		favorites, 
		isLoading,
		migrateGuestFavorites 
	} = useFavorites()

	// Attempt to migrate guest favorites when user logs in
	useEffect(() => {
		if (user) {
			migrateGuestFavorites()
		}
	}, [user])

	if (isLoading) {
		return <LoadingState type="properties" />
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					{user ? 'Your Favorites' : 'Guest Favorites'}
				</h1>
				{!user && favorites.length > 0 && (
					<Button asChild variant="outline">
						<Link href="/login">
							Sign in to save your favorites
						</Link>
					</Button>
				)}
			</div>

			{favorites.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-600 mb-4">
						You haven't added any properties to your favorites yet.
					</p>
					<Button asChild variant="outline">
						<Link href="/properties">
							Browse Properties
						</Link>
					</Button>
				</div>
			) : (
				<PropertiesGrid properties={favorites} />
			)}
		</main>
	)
}
