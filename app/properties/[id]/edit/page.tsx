"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PropertyForm } from "@/components/features/properties"
import { mockProperties } from "@/components/features/properties/mock-data"
import { Property } from "@/components/features/properties/types"

interface EditPropertyPageProps {
	params: {
		id: string
	}
}

export default function EditPropertyPage({
	params,
}: EditPropertyPageProps) {
	const router = useRouter()
	const [property, setProperty] =
		useState<Property | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		// Simulating API call to fetch property
		const fetchProperty = async () => {
			try {
				const found = mockProperties.find(
					(p) => p.id === params.id,
				)
				if (!found) {
					router.push("/404")
					return
				}
				setProperty(found)
			} catch (error) {
				console.error(
					"Error fetching property:",
					error,
				)
				router.push("/404")
			} finally {
				setIsLoading(false)
			}
		}

		fetchProperty()
	}, [params.id, router])

	const handleSubmit = async (
		data: Partial<Property>,
	) => {
		setIsSaving(true)
		try {
			// Simulating API call to update property
			await new Promise((resolve) =>
				setTimeout(resolve, 1000),
			)
			router.push(`/properties/${params.id}`)
		} catch (error) {
			console.error(
				"Error updating property:",
				error,
			)
		} finally {
			setIsSaving(false)
		}
	}

	if (isLoading || !property) {
		return (
			<main className="container mx-auto px-4 py-8">
				<div className="animate-pulse">
					<div className="h-8 w-1/4 bg-gray-200 rounded"></div>
					<div className="mt-8 space-y-6">
						<div className="h-10 w-full bg-gray-200 rounded"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
						<div className="h-32 w-full bg-gray-200 rounded"></div>
					</div>
				</div>
			</main>
		)
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="mb-8 text-2xl font-bold">
				Edit Property
			</h1>
			<PropertyForm
				initialData={property}
				onSubmit={handleSubmit}
				isLoading={isSaving}
			/>
		</main>
	)
}
