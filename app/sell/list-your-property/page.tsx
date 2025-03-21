"use client"

import { PropertyForm } from "@/components/features/properties/property-form"
import { useAuth } from "@/contexts/auth-context"
import { LoadingState } from "@/components/ui/loading-state"

export default function ListYourPropertyPage() {
	const { user, isLoading } = useAuth()

	if (isLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<LoadingState type="property" />
			</main>
		)
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="space-y-8">
				<h1 className="text-4xl font-bold">List Your Property</h1>
				<PropertyForm />
			</div>
		</main>
	)
}
