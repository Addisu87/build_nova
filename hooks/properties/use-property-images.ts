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
			throw new Error("Only image files are allowed")
		}

		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			throw new Error("File size must be less than 5MB")
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string,
	): Promise<ImageUploadResult> => {
		try {
			setIsLoading(true)
			setError(null)

			if (!user) throw new Error("Authentication required")

			validateFile(file)

			const fileExt = file.name.split(".").pop() || "jpg"
			const fileName = `${crypto.randomUUID()}.${fileExt}`
			const filePath = `${folderPath}/${fileName}`

			const { error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					contentType: file.type,
					cacheControl: "3600",
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

	const deleteImage = async (path: string): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			if (!user) throw new Error("Authentication required")

			const { error } = await supabase.storage.from("images").remove([path])

			if (error) throw error

			toast.success("Image deleted successfully")
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to delete image")
			setError(error)
			toast.error(error.message)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		error,
		uploadImage,
		deleteImage,
	}
}
