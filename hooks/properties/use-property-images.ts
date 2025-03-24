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
	uploadImage: (file: File, folderPath?: string) => Promise<ImageUploadResult>
	deleteImage: (path: string) => Promise<void>
	uploadMultipleImages: (
		files: File[],
		folderPath?: string,
	) => Promise<ImageUploadResult[]>
	deleteMultipleImages: (paths: string[]) => Promise<void>
}

export function useStorageImages(): UseStorageImagesHook {
	const [isUploading, setIsUploading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const uploadImage = async (
		file: File,
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult> => {
		try {
			setIsUploading(true)
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

			if (deleteError) throw deleteError

			toast.success("Image deleted successfully")
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete image"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
			throw err
		} finally {
			setIsUploading(false)
		}
	}

	const uploadMultipleImages = async (
		files: File[],
		folderPath: string = "properties/default",
	): Promise<ImageUploadResult[]> => {
		try {
			setIsUploading(true)
			setError(null)

			const results = await Promise.all(
				files.map((file) => uploadImage(file, folderPath)),
			)

			return results
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to upload images"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
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

			if (deleteError) throw deleteError

			toast.success("Images deleted successfully")
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to delete images"
			setError(new Error(errorMessage))
			toast.error(errorMessage)
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
