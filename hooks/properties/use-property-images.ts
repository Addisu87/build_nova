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
	handleImageUpload: (files: File[], options: ImageUploadOptions) => Promise<void>
}

interface ImageUploadOptions {
	maxFiles?: number
	currentImages: Array<{ url: string; path: string }>
	folderPath: string
	onSuccess: (results: ImageUploadResult[]) => void
	onError?: (error: Error) => void
}

export function usePropertyImages(): UsePropertyImagesHook {
	const [error, setError] = useState<Error | null>(null)
	const { user, isLoading } = useAuth()

	const handleError = (err: unknown, defaultMessage: string) => {
		const errorMessage = err instanceof Error ? err.message : defaultMessage
		setError(new Error(errorMessage))
		toast.error(errorMessage)
		throw new Error(errorMessage)
	}

	const validateAccess = (operation: string) => {
		const restrictedOperations = ["upload", "delete"]
		if (restrictedOperations.includes(operation) && !user) {
			throw new Error("Authentication required for this operation")
		}
	}

	const listImages = async (folderPath: string): Promise<ImageUploadResult[]> => {
		try {
			const { data, error: listError } = await supabase.storage
				.from("images")
				.list(folderPath, { limit: 100 }) // Added limit for safety

			if (listError) throw listError

			const images = (data || [])
				.filter((file) => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
				.map((file) => ({
					url: supabase.storage
						.from("images")
						.getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl,
					path: `${folderPath}/${file.name}`,
				}))

			return images
		} catch (err) {
			handleError(err, "Failed to list images")
			return []
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult> => {
		try {
			validateAccess("upload")

			if (!file.type.startsWith("image/")) {
				throw new Error("File must be an image")
			}

			const maxSize = 5 * 1024 * 1024 // 5MB
			if (file.size > maxSize) {
				throw new Error("File size must be less than 5MB")
			}

			const fileExt = file.name.split(".").pop() || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const filePath = `${folderPath}/${fileName}`

			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					upsert: false,
					contentType: file.type,
					cacheControl: "3600",
				})

			if (uploadError) throw uploadError

			const { data } = supabase.storage.from("images").getPublicUrl(filePath)

			return {
				url: data.publicUrl,
				path: filePath,
			}
		} catch (err) {
			handleError(err, "Failed to upload image")
			throw err // Re-throw to allow caller to handle
		}
	}

	const deleteImage = async (path: string): Promise<void> => {
		try {
			validateAccess("delete")

			const { error: deleteError } = await supabase.storage
				.from("images")
				.remove([path])

			if (deleteError) throw deleteError

			toast.success("Image deleted successfully")
		} catch (err) {
			handleError(err, "Failed to delete image")
		}
	}

	const uploadMultipleImages = async (
		files: File[],
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult[]> => {
		try {
			validateAccess("upload")

			const uploadPromises = files.map((file) => uploadImage(file, folderPath))
			const results = await Promise.all(uploadPromises)

			toast.success(`Uploaded ${results.length} image${results.length > 1 ? "s" : ""}`)
			return results
		} catch (err) {
			handleError(err, "Failed to upload images")
			throw err
		}
	}

	const deleteMultipleImages = async (paths: string[]): Promise<void> => {
		try {
			validateAccess("delete")

			const { error: deleteError } = await supabase.storage.from("images").remove(paths)

			if (deleteError) throw deleteError

			toast.success(`Deleted ${paths.length} image${paths.length > 1 ? "s" : ""}`)
		} catch (err) {
			handleError(err, "Failed to delete images")
		}
	}

	const handleImageUpload = async (files: File[], options: ImageUploadOptions) => {
		const {
			maxFiles = 10,
			currentImages,
			folderPath,
			onSuccess,
			onError
		} = options

		try {
			if (files.length + currentImages.length > maxFiles) {
				throw new Error(`Maximum ${maxFiles} files allowed`)
			}

			const results = await uploadMultipleImages(files, folderPath)
			onSuccess(results)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to upload images"
			console.error("Failed to upload images:", error)
			onError?.(new Error(errorMessage))
			throw error
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
		handleImageUpload
	}
}
