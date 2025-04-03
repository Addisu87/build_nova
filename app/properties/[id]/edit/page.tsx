"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PropertyForm } from "@/components/features/properties"
import { mockProperties } from "@/components/features/properties/mock-data"
import { Property } from "@/components/features/properties/types"
import { useAuth } from "@/contexts/auth-context"
import { useAdminStatus } from "@/hooks/auth/use-admin-status"
import { useProperty } from "@/hooks/use-property"
import { updateProperty } from "@/api/properties"
import { toast } from "react-toastify"
import { LoadingState } from "@/components/ui/loading-state"

interface EditPropertyPageProps {
	params: {
		id: string
	}
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
	const { user, isLoading: isAuthLoading } = useAuth()
	const { isAdmin } = useAdminStatus(user)
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

	const canEditProperty = isAdmin || property.user_id === user.id

	if (!canEditProperty) {
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
			await updateProperty(user.id, params.id, data, isAdmin)
			router.push(`/properties/${params.id}`)
		} catch (error) {
			console.error("Error updating property:", error)
			toast.error("Failed to update property")
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="space-y-8">
				<h1 className="text-4xl font-bold">Edit Property</h1>
				<PropertyForm
					initialData={property}
					onSubmit={handleSubmit}
					isLoading={isSaving}
				/>
			</div>
		</main>
	)
}
