import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { toast } from "sonner"

interface ImageUploadResult {
	url: string
	path: string
}

interface UseStorageImagesHook {
	isUploading: boolean
	error: Error | null
	uploadImage: (file: File, propertyType?: string) => Promise<ImageUploadResult>
	deleteImage: (path: string) => Promise<void>
	uploadMultipleImages: (
		files: File[],
		propertyType?: string,
	) => Promise<ImageUploadResult[]>
	deleteMultipleImages: (paths: string[]) => Promise<void>
	uploadFromUrl: (url: string, propertyType?: string) => Promise<ImageUploadResult>
}

export function useStorageImages(): UseStorageImagesHook {
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const baseUrl =
		"https://sinvgquzrvfrusjtwzdf.supabase.co/storage/v1/object/public/images/properties/"

	const uploadImage = async (
		file: File,
		propertyType: string = "default", // Default folder if no property type is provided
	): Promise<ImageUploadResult> => {
		try {
			setIsUploading(true)
			setError(null)

			// Validate file type
			if (!file.type.startsWith("image/")) {
				throw new Error("File must be an image")
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				throw new Error("File size must be less than 5MB")
			}

			// Generate a unique file name using UUID
			const fileExt = file.name.split(".").pop() || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const folder = `properties/${propertyType.toLowerCase()}`
			const filePath = `${folder}/${fileName}`

			// Upload file to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					upsert: false,
					contentType: file.type,
				})

			if (uploadError) {
				throw uploadError
			}

			// Construct the hardcoded public URL
			const publicUrl = `${baseUrl}${propertyType.toLowerCase()}/${fileName}`

			return {
				url: publicUrl,
				path: filePath,
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to upload image"))
			toast.error("Failed to upload image")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const deleteImage = async (path: string): Promise<void> => {
		try {
			setIsUploading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage
				.from("images")
				.remove([path])

			if (deleteError) {
				throw deleteError
			}

			toast.success("Image deleted successfully")
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to delete image"))
			toast.error("Failed to delete image")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const uploadMultipleImages = async (
		files: File[],
		propertyType: string = "default",
	): Promise<ImageUploadResult[]> => {
		try {
			setIsUploading(true)
			setError(null)

			const uploadPromises = files.map((file) => uploadImage(file, propertyType))
			const results = await Promise.all(uploadPromises)

			return results
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to upload images"))
			toast.error("Failed to upload images")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const deleteMultipleImages = async (paths: string[]): Promise<void> => {
		try {
			setIsUploading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage.from("images").remove(paths)

			if (deleteError) {
				throw deleteError
			}

			toast.success("Images deleted successfully")
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to delete images"))
			toast.error("Failed to delete images")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const uploadFromUrl = async (
		url: string,
		propertyType: string = "default",
	): Promise<ImageUploadResult> => {
		try {
			setIsUploading(true)
			setError(null)

			// Fetch the image from the provided URL
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Failed to fetch image from ${url}`)
			}

			const blob = await response.blob()

			// Validate file type
			if (!blob.type.startsWith("image/")) {
				throw new Error("URL must point to an image")
			}

			// Validate file size (max 5MB)
			if (blob.size > 5 * 1024 * 1024) {
				throw new Error("Image size must be less than 5MB")
			}

			// Generate a unique file name
			const fileExt = url.split(".").pop()?.split("?")[0] || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const folder = `properties/${propertyType.toLowerCase()}`
			const filePath = `${folder}/${fileName}`

			// Upload to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, blob, {
					upsert: false,
					contentType: blob.type,
				})

			if (uploadError) {
				throw uploadError
			}

			// Construct the hardcoded public URL
			const publicUrl = `${baseUrl}${propertyType.toLowerCase()}/${fileName}`

			return {
				url: publicUrl,
				path: filePath,
			}
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to upload image from URL"),
			)
			toast.error("Failed to upload image from URL")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	return {
		isUploading,
		error,
		uploadImage,
		deleteImage,
		uploadMultipleImages,
		deleteMultipleImages,
		uploadFromUrl,
	}
}
