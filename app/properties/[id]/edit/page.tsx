"use client"

import { PropertyForm } from "@/components/features/properties/property-form"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useProperty } from "@/hooks/queries/use-query-hooks"
import { updateProperty } from "@/lib/supabase/db"
import { Property } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface EditPropertyPageProps {
	params: {
		id: string
	}
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
	const { user, isLoading: isAuthLoading } = useAuth()
	const router = useRouter()
	const { data: property, isLoading } = useProperty(params.id)
	const [isSaving, setIsSaving] = useState(false)

	if (isAuthLoading || isLoading) {
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
					<p>Please sign in to edit properties</p>
				</div>
			</main>
		)
	}

	if (!property) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p>Property not found</p>
				</div>
			</main>
		)
	}

	const canEditProperty = property.user_id === user.id
	const isAdmin = user.user_metadata?.role === "admin"

	if (!canEditProperty && !isAdmin) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="text-center">
					<p>You don't have permission to edit this property</p>
				</div>
			</main>
		)
	}

	const handleSubmit = async (data: Partial<Property>) => {
		setIsSaving(true)
		try {
			const propertyData = {
				...data,
				images: data.images && Array.isArray(data.images) ? data.images : [],
				updated_at: new Date().toISOString(),
			}

			await updateProperty(user.id, params.id, propertyData, isAdmin)
			router.push(`/properties/${params.id}`)
			toast.success("Property updated successfully")
		} catch (error) {
			console.error("Error updating property:", error)
			toast.error("Failed to update property")
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Edit Property</h1>
			<PropertyForm 
				initialData={property} 
				onSubmit={handleSubmit} 
				isLoading={isSaving} 
			/>
		</main>
	)
}
