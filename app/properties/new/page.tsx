"use client"

import { PropertyForm } from "@/components/features/properties/property-form"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"

export default function NewPropertyPage() {
	const { isLoading } = useAuth()

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
				<h1 className="text-4xl font-bold">Add New Property</h1>
				<PropertyForm />
			</div>
		</main>
	)
}
