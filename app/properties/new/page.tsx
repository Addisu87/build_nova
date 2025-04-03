"use client"

import { PropertyForm } from "@/components/features/properties/property-form"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useCreateProperty } from "@/hooks/queries/use-query-hooks"
import { PropertyFormData } from "@/lib/properties/property-schemas"
import { useRouter } from "next/navigation"

export default function NewPropertyPage() {
	const { user, isLoading: isAuthLoading } = useAuth()
	const router = useRouter()
	const { mutate: createProperty, isLoading: isCreating } = useCreateProperty()

	if (isAuthLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<LoadingState type="property" />
			</main>
		)
	}

	if (!user) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p>Please sign in to create properties</p>
				</div>
			</main>
		)
	}

	const handleSubmit = async (data: PropertyFormData) => {
		createProperty(
			{ ...data, user_id: user.id },
			{
				onSuccess: (newProperty) => {
					router.push(`/properties/${newProperty.id}`)
				},
			}
		)
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Create New Property</h1>
			<PropertyForm onSubmit={handleSubmit} isLoading={isCreating} />
		</main>
	)
}
