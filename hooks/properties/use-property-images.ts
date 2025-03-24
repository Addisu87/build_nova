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
	uploadMultipleImages: (files: File[], folderPath?: string) => Promise<ImageUploadResult[]>
	deleteMultipleImages: (paths: string[]) => Promise<void>
	listImages: (folderPath: string) => Promise<ImageUploadResult[]>
}

export function usePropertyImages(): UsePropertyImagesHook {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const listImages = async (folderPath: string): Promise<ImageUploadResult[]> => {
		try {
			setIsLoading(true)
			setError(null)

			const { data, error: listError } = await supabase.storage
				.from("images")
				.list(folderPath)

			if (listError) throw listError

			const images = data
				.filter(file => file.name.match(/\.(jpg|jpeg|png|gif)$/i))
				.map(file => ({
					url: supabase.storage.from("images").getPublicUrl(`${folderPath}/${file.name}`).data.publicUrl,
					path: `${folderPath}/${file.name}`
				}))

			return images
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to list images"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string = "properties/default"
	): Promise<ImageUploadResult> => {
		try {
			setIsLoading(true)
			setError(null)

			if (!file.type.startsWith("image/")) {
				throw new Error("File must be an image")
			}

			if (file.size > 5 * 1024 * 1024) {
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
				})

			if (uploadError) throw uploadError

			const { data } = supabase.storage.from("images").getPublicUrl(filePath)

			return {
				url: data.publicUrl,
				path: filePath,
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteImage = async (path: string): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage
				.from("images")
				.remove([path])

			if (deleteError) throw deleteError

			toast.success("Image deleted successfully")
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete image"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const uploadMultipleImages = async (
		files: File[],
		folderPath: string = "properties/default"
	): Promise<ImageUploadResult[]> => {
		try {
			setIsLoading(true)
			setError(null)

			const results = await Promise.all(
				files.map((file) => uploadImage(file, folderPath))
			)

			return results
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to upload images"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteMultipleImages = async (paths: string[]): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			const { error: deleteError } = await supabase.storage
				.from("images")
				.remove(paths)

			if (deleteError) throw deleteError

			toast.success("Images deleted successfully")
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete images"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
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
		listImages
	}
}
