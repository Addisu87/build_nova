import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { toast } from "sonner"

interface ImageUploadResult {
	url: string
	path: string
}

export function usePropertyImages() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const { user } = useAuth()

	const validateFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			throw new Error("Only image files are allowed (JPEG, PNG, WebP)")
		}

		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			throw new Error("File size must be less than 5MB")
		}
	}

	const checkAdminAccess = async () => {
		if (!user) throw new Error("Authentication required")

		// Check if user has admin role
		const { data, error: roleError } = await supabase.auth.admin.getUserById(user.id)

		if (roleError || data?.user?.user_metadata?.role !== "admin") {
			throw new Error("Admin access required")
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string,
	): Promise<ImageUploadResult> => {
		try {
			setIsLoading(true)
			setError(null)

			await checkAdminAccess()
			validateFile(file)

			const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const filePath = `${folderPath}/${fileName}`

			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					contentType: file.type,
					cacheControl: "3600",
					upsert: false,
				})

			if (uploadError) throw uploadError

			const {
				data: { publicUrl },
			} = supabase.storage.from("images").getPublicUrl(filePath)

			return { url: publicUrl, path: filePath }
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to upload image")
			setError(error)
			toast.error(error.message)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const deleteImage = async (paths: string[]): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			await checkAdminAccess()
			if (!paths.length) return

			const { error } = await supabase.storage.from("images").remove(paths)

			if (error) throw error

			toast.success(`Deleted ${paths.length} image${paths.length > 1 ? "s" : ""}`)
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to delete image")
			setError(error)
			toast.error(error.message)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const listImages = async (
		folderPath: string,
	): Promise<Array<{ url: string; path: string }>> => {
		try {
			setIsLoading(true)
			setError(null)

			const { data, error: listError } = await supabase.storage
				.from("images")
				.list(folderPath)

			if (listError) throw listError

			if (!data?.length) return []

			// Get public URLs for all images
			const images = await Promise.all(
				data.map(async (file) => {
					const path = `${folderPath}/${file.name}`
					const {
						data: { publicUrl },
					} = supabase.storage.from("images").getPublicUrl(path)

					return {
						url: publicUrl,
						path: path,
					}
				}),
			)

			return images
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to list images")
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		uploadImage,
		deleteImage,
		listImages,
		isLoading,
		error,
	}
}
