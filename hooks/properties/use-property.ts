// This file has been deprecated in favor of using the useProperty hook from use-query-hooks.ts
// which provides better integration with React Query's caching system.

import {
	useDeleteProperty,
	useProperty as usePropertyQuery,
	useUpdateProperty,
} from "@/hooks/queries/use-query-hooks"
import { Property } from "@/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

/**
 * @deprecated Use useProperty from use-query-hooks.ts directly
 */
export function useProperty(id: string) {
	const router = useRouter()
	const {
		data: property,
		isLoading,
		error,
	} = usePropertyQuery(id)
	const updatePropertyMutation =
		useUpdateProperty()
	const deletePropertyMutation =
		useDeleteProperty()

	const handleUpdate = async (
		updates: Partial<Property>,
	) => {
		try {
			await updatePropertyMutation.mutateAsync({
				id,
				updates,
			})
			toast.success(
				"Property updated successfully",
			)
			router.refresh()
		} catch (err) {
			toast.error("Failed to update property")
			throw err
		}
	}

	const handleDelete = async () => {
		try {
			await deletePropertyMutation.mutateAsync(id)
			toast.success(
				"Property deleted successfully",
			)
			router.push("/properties")
		} catch (err) {
			toast.error("Failed to delete property")
			throw err
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
