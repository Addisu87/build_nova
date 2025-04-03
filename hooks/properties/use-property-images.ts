import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid';

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

		const {
			data: { user: userData },
			error: roleError,
		} = await supabase.auth.getUser()
		if (roleError || userData?.user_metadata?.role !== "admin") {
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

			// Log user and admin status
			const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
			console.log('Current user:', userData)
			
			await checkAdminAccess()
			validateFile(file)

			const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, "")
			const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
			const fileName = `${uuidv4()}.${fileExt}`
			const filePath = `${cleanFolderPath}/${fileName}`

			console.log('Upload attempt:', {
				bucket: 'images',
				path: filePath,
				contentType: file.type,
				fileSize: file.size
			})

			const { data, error: uploadError } = await supabase.storage
				.from("images")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: false,
					contentType: file.type,
				})

			if (uploadError) {
				console.error('Upload error:', {
					message: uploadError.message,
					details: uploadError.details,
					hint: uploadError.hint
				})
				throw uploadError
			}

			console.log('Upload success:', data)

			const {
				data: { publicUrl },
			} = supabase.storage.from("images").getPublicUrl(filePath)

			console.log('Generated public URL:', publicUrl)

			return {
				url: publicUrl,
				path: filePath,
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to upload image")
			console.error('Upload failed:', {
				error: error.message,
				stack: error.stack
			})
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

			// Clean the folder path
			const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, "")

			const { data, error: listError } = await supabase.storage
				.from("images")
				.list(cleanFolderPath, {
					sortBy: { column: "created_at", order: "desc" },
				})

			if (listError) throw listError
			if (!data?.length) return []

			// Get public URLs for all images
			const images = await Promise.all(
				data
					.filter((file) => file.name) // Ensure file has a name
					.map(async (file) => {
						const path = `${cleanFolderPath}/${file.name}`
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

	const deleteImage = async (paths: string[]): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			await checkAdminAccess()
			if (!paths.length) return

			// Clean the paths
			const cleanPaths = paths.map((path) => path.replace(/^\/+|\/+$/g, ""))

			const { error } = await supabase.storage.from("images").remove(cleanPaths)

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

	return {
		uploadImage,
		deleteImage,
		listImages,
		isLoading,
		error,
	}
}
