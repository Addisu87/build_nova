import { useState } from "react"
import { toast } from "react-hot-toast"
import { supabase } from "@/lib/supabase/db"

interface ImageUploadResult {
	url: string
	path: string
}

export function usePropertyImages() {
	const [isUploading, setIsUploading] =
		useState(false)
	const [error, setError] =
		useState<Error | null>(null)

	const uploadImage = async (
		file: File,
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
				throw new Error(
					"File size must be less than 5MB",
				)
			}

			// Generate a unique file name
			const fileExt = file.name.split(".").pop()
			const fileName = `${Math.random()
				.toString(36)
				.substring(2)}.${fileExt}`
			const filePath = `property-images/${fileName}`

			// Upload file to Supabase Storage
			const { error: uploadError, data } =
				await supabase.storage
					.from("properties")
					.upload(filePath, file)

			if (uploadError) {
				throw uploadError
			}

			// Get the public URL
			const {
				data: { publicUrl },
			} = supabase.storage
				.from("properties")
				.getPublicUrl(filePath)

			return {
				url: publicUrl,
				path: filePath,
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to upload image"),
			)
			toast.error("Failed to upload image")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const deleteImage = async (
		path: string,
	): Promise<void> => {
		try {
			setIsUploading(true)
			setError(null)

			const { error: deleteError } =
				await supabase.storage
					.from("properties")
					.remove([path])

			if (deleteError) {
				throw deleteError
			}

			toast.success("Image deleted successfully")
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to delete image"),
			)
			toast.error("Failed to delete image")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const uploadMultipleImages = async (
		files: File[],
	): Promise<ImageUploadResult[]> => {
		try {
			setIsUploading(true)
			setError(null)

			const uploadPromises = files.map((file) =>
				uploadImage(file),
			)
			const results = await Promise.all(
				uploadPromises,
			)

			return results
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to upload images"),
			)
			toast.error("Failed to upload images")
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const deleteMultipleImages = async (
		paths: string[],
	): Promise<void> => {
		try {
			setIsUploading(true)
			setError(null)

			const { error: deleteError } =
				await supabase.storage
					.from("properties")
					.remove(paths)

			if (deleteError) {
				throw deleteError
			}

			toast.success("Images deleted successfully")
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to delete images"),
			)
			toast.error("Failed to delete images")
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
	}
}
