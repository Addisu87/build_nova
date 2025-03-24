import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { toast } from "sonner"

interface ImageUploadResult {
	url: string
	path: string
}

interface UsePropertyImagesHook {
	isLoading: boolean
	error: Error | null
	uploadImage: (file: File, folderPath?: string) => Promise<ImageUploadResult>
	deleteImage: (path: string) => Promise<void>
	uploadMultipleImages: (
		files: File[],
		folderPath?: string,
	) => Promise<ImageUploadResult[]>
	deleteMultipleImages: (paths: string[]) => Promise<void>
	listImages: (folderPath: string) => Promise<ImageUploadResult[]>
}

export function usePropertyImages(): UsePropertyImagesHook {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const { user } = useAuth()

	const handleError = (err: unknown, defaultMessage: string) => {
		const errorMessage = err instanceof Error ? err.message : defaultMessage
		setError(new Error(errorMessage))
		toast.error(errorMessage)
		throw new Error(errorMessage)
	}

	const validateAccess = (operation: string) => {
		// Add specific operations that require authentication
		const restrictedOperations = ["upload", "delete"]
		if (restrictedOperations.includes(operation) && !user) {
			throw new Error("Authentication required for this operation")
		}
	}

	const listImages = async (folderPath: string): Promise<ImageUploadResult[]> => {
		try {
			setIsLoading(true)
			setError(null)

			const { data, error: listError } = await supabase.storage
				.from("images")
				.list(folderPath)

			if (listError) throw listError

			const images =
				data
					?.filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
					.map((file) => ({
						url: supabase.storage
							.from("images")
							.getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl,
						path: `${folderPath}/${file.name}`,
					})) || []

			return images
		} catch (err) {
			handleError(err, "Failed to list images")
			return []
		} finally {
			setIsLoading(false)
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult> => {
		try {
			validateAccess("upload")
			setIsLoading(true)
			setError(null)

			// Validate file
			if (!file.type.startsWith("image/")) {
				throw new Error("File must be an image")
			}

			const maxSize = 5 * 1024 * 1024 // 5MB
			if (file.size > maxSize) {
				throw new Error("File size must be less than 5MB")
			}

			// Generate unique filename
			const fileExt = file.name.split(".").pop() || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const filePath = `${folderPath}/${fileName}`

			// Upload file
			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					upsert: false,
					contentType: file.type,
				})

			if (uploadError) throw uploadError

			const { data } = supabase.storage.from("images").getPublicUrl(filePath)

			return {
				url: data.publicUrl,
				path: filePath,
			}
		} catch (err) {
			handleError(err, "Failed to upload image")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteImage = async (path: string): Promise<void> => {
		try {
			validateAccess("delete")
			setIsLoading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage
				.from("images")
				.remove([path])

			if (deleteError) throw deleteError

			toast.success("Image deleted successfully")
		} catch (err) {
			handleError(err, "Failed to delete image")
		} finally {
			setIsLoading(false)
		}
	}

	const uploadMultipleImages = async (
		files: File[],
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult[]> => {
		try {
			validateAccess("upload")
			setIsLoading(true)
			setError(null)

			const results = await Promise.all(
				files.map((file) => uploadImage(file, folderPath)),
			)

			return results
		} catch (err) {
			handleError(err, "Failed to upload images")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteMultipleImages = async (paths: string[]): Promise<void> => {
		try {
			validateAccess("delete")
			setIsLoading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage.from("images").remove(paths)

			if (deleteError) throw deleteError

			toast.success("Images deleted successfully")
		} catch (err) {
			handleError(err, "Failed to delete images")
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		uploadImage,
		deleteImage,
		uploadMultipleImages,
		deleteMultipleImages,
		listImages,
	}
}
