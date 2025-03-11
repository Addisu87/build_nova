import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import {
	getProperty,
	updateProperty,
	deleteProperty,
} from "@/lib/supabase/db"

type Property =
	Database["public"]["Tables"]["properties"]["Row"]

export function useProperty(id: string) {
	const router = useRouter()
	const [property, setProperty] =
		useState<Property | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] =
		useState<Error | null>(null)

	useEffect(() => {
		async function fetchProperty() {
			try {
				setIsLoading(true)
				const data = await getProperty(id)
				setProperty(data)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error(
								"Failed to fetch property",
						  ),
				)
				toast.error(
					"Failed to load property details",
				)
			} finally {
				setIsLoading(false)
			}
		}

		if (id) {
			fetchProperty()
		}
	}, [id])

	const handleUpdate = async (
		updates: Partial<Property>,
	) => {
		try {
			setIsLoading(true)
			const updatedProperty =
				await updateProperty(id, updates)
			setProperty(updatedProperty)
			toast.success(
				"Property updated successfully",
			)
			router.refresh()
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to update property",
					  ),
			)
			toast.error("Failed to update property")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async () => {
		try {
			setIsLoading(true)
			await deleteProperty(id)
			toast.success(
				"Property deleted successfully",
			)
			router.push("/properties")
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to delete property",
					  ),
			)
			toast.error("Failed to delete property")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		property,
		isLoading,
		error,
		updateProperty: handleUpdate,
		deleteProperty: handleDelete,
	}
}
