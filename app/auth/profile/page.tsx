"use client"

import { PropertiesGrid, PropertyCard } from "@/components/features/properties"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useFavorites } from "@/hooks/favorites/use-favorites"
import { removeFavorite } from "@/lib/supabase/db"
import { useProtectedRoute } from "@/hooks/auth/use-protected-route"
import { Building2, Mail, MapPin, User } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
	const { user } = useAuth()
	const { isLoading } = useProtectedRoute()
	const { data: favorites, isLoading: favoritesLoading } = useFavorites()

	// Function to get user's first name initial
	const getInitial = () => {
		if (user?.user_metadata?.full_name) {
			return user.user_metadata.full_name.charAt(0).toUpperCase()
		}
		if (user?.email) {
			return user.email.charAt(0).toUpperCase()
		}
		return "U"
	}

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
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Profile Header */}
				<div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
					<div className="relative w-24 h-24">
						<Avatar className="w-full h-full border-4 border-white shadow-lg">
							<AvatarImage
								src={user.user_metadata?.avatar_url}
								alt={user.user_metadata?.full_name || user.email}
							/>
							<AvatarFallback className="bg-primary text-primary-foreground text-2xl">
								{getInitial()}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="space-y-2">
						<h1 className="text-4xl font-bold">
							{user.user_metadata?.full_name || "Your Profile"}
						</h1>
						<p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
							<Mail className="w-4 h-4" />
							{user.email}
						</p>
						{user.user_metadata?.location && (
							<p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
								<MapPin className="w-4 h-4" />
								{user.user_metadata.location}
							</p>
						)}
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{/* Profile Details Card */}
					<Card className="md:col-span-1">
						<div className="p-6 space-y-6">
							<div>
								<h2 className="text-xl font-semibold flex items-center gap-2">
									<User className="w-5 h-5" />
									Account Details
								</h2>
								<Separator className="my-4" />
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input id="email" type="email" value={user.email} disabled />
									</div>
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											type="text"
											value={user.user_metadata?.full_name || ""}
											disabled
										/>
									</div>
								</div>
							</div>
							<Button className="w-full" variant="outline" asChild>
								<Link href="/auth/settings">Edit Profile</Link>
							</Button>
						</div>
					</Card>

					{/* Favorites Section */}
					<div className="md:col-span-2 space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold flex items-center gap-2">
								<Building2 className="w-5 h-5" />
								Your Favorites
							</h2>
							<Button variant="outline" asChild>
								<Link href="/properties">Browse More</Link>
							</Button>
						</div>
						<Separator />

						{favorites?.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
								<Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
									No Favorites Yet
								</h3>
								<p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
									Start adding properties to your favorites to see them here.
								</p>
								<Button asChild>
									<Link href="/properties">Browse Properties</Link>
								</Button>
							</div>
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
			</div>
		</main>
	)
}
