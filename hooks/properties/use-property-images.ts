import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
interface ImageUploadResult {
	url: string
	path: string
}

export function usePropertyImages() {
	const [isLoading, setIsLoading] =
		useState(false)
	const [error, setError] =
		useState<Error | null>(null)
	const { user } = useAuth()

	const validateFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			throw new Error(
				"Only image files are allowed (JPEG, PNG, WebP, GIF)",
			)
		}

		const maxSize = 10 * 1024 * 1024 // 10MB
		if (file.size > maxSize) {
			throw new Error(
				"File size must be less than 10MB",
			)
		}

		// Check for common image MIME types
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif",
		]
		if (!allowedTypes.includes(file.type)) {
			throw new Error(
				`Unsupported file type: ${file.type}`,
			)
		}
	}

	const checkAdminAccess = async () => {
		if (!user)
			throw new Error("Authentication required")

		const {
			data: { user: userData },
			error: roleError,
		} = await supabase.auth.getUser()
		if (
			roleError ||
			userData?.user_metadata?.role !== "admin"
		) {
			throw new Error("Admin access required")
		}
	}

	const compressImage = async (
		file: File,
	): Promise<File> => {
		const options = {
			maxSizeMB: 1, // Compress to maximum 1MB
			maxWidthOrHeight: 1920, // Resize to maximum 1920px width/height
			useWebWorker: true,
			fileType: file.type,
		}

		try {
			return await imageCompression(file, options)
		} catch (err) {
			console.warn(
				"Image compression failed, using original file:",
				err,
			)
			return file
		}
	}

	const uploadImage = async (
		file: File,
		folderPath: string,
		options?: {
			contentType?: string
			cacheControl?: string
			upsert?: boolean
			skipCompression?: boolean
		},
	): Promise<ImageUploadResult> => {
		try {
			setIsLoading(true)
			setError(null)

			// First verify the user session is valid
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession()
			if (sessionError || !session) {
				throw new Error(
					"Authentication required - please sign in",
				)
			}

			validateFile(file)

			const fileToUpload =
				options?.skipCompression
					? file
					: await compressImage(file)

			const cleanFolderPath = folderPath.replace(
				/^\/+|\/+$/g,
				"",
			)
			const fileExt =
				fileToUpload.name
					.split(".")
					.pop()
					?.toLowerCase() || "jpg"
			const fileName = `${uuidv4()}.${fileExt}`
			const filePath = `${cleanFolderPath}/${fileName}`

			// Add authorization header explicitly
			const { data, error: uploadError } =
				await supabase.storage
					.from("images")
					.upload(filePath, fileToUpload, {
						cacheControl:
							options?.cacheControl || "3600",
						upsert: options?.upsert || false,
						contentType:
							options?.contentType ||
							fileToUpload.type,
						duplex: "half",
						// Add authorization explicitly
						headers: {
							Authorization: `Bearer ${session.access_token}`,
							apikey:
								process.env
									.NEXT_PUBLIC_SUPABASE_ANON_KEY,
						},
					})

			if (uploadError) {
				console.error("Detailed upload error:", {
					message: uploadError.message,
				})
				throw uploadError
			}

			// Verify the file exists after upload
			const { error: verifyError } =
				await supabase.storage
					.from("images")
					.download(filePath)

			if (verifyError) {
				throw new Error(
					`Upload verification failed: ${verifyError.message}`,
				)
			}

			const {
				data: { publicUrl },
			} = supabase.storage
				.from("images")
				.getPublicUrl(filePath, {
					download: false,
					transform: {
						width: 1920,
						height: 1080,
						quality: 80,
					},
				})

			if (!publicUrl) {
				throw new Error(
					"Failed to generate public URL for uploaded image",
				)
			}

			const timestamp = new Date().getTime()
			const finalUrl = `${publicUrl}?t=${timestamp}`

			toast.success("Image uploaded successfully")
			return {
				url: finalUrl,
				path: filePath,
			}
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error("Failed to upload image")
			setError(error)
			toast.error(
				`Upload failed: ${error.message}`,
			)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const listImages = async (
		folderPath: string,
	): Promise<
		Array<{ url: string; path: string }>
	> => {
		try {
			setIsLoading(true)
			setError(null)

			const cleanFolderPath = folderPath.replace(
				/^\/+|\/+$/g,
				"",
			)

			const { data, error: listError } =
				await supabase.storage
					.from("images")
					.list(cleanFolderPath, {
						sortBy: {
							column: "created_at",
							order: "desc",
						},
					})

			if (listError) throw listError
			if (!data?.length) return []

			const images = await Promise.all(
				data
					.filter((file) => file.name)
					.map(async (file) => {
						const path = `${cleanFolderPath}/${file.name}`
						const {
							data: { publicUrl },
						} = supabase.storage
							.from("images")
							.getPublicUrl(path, {
								download: false,
								transform: {
									width: 1920,
									height: 1080,
									quality: 80,
								},
							})

						if (!publicUrl) {
							throw new Error(
								`Failed to generate URL for image: ${path}`,
							)
						}

						const timestamp = new Date().getTime()
						return {
							url: `${publicUrl}?t=${timestamp}`,
							path: path,
						}
					}),
			)

			return images
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error("Failed to list images")
			setError(error)
			throw error
		} finally {
			setIsLoading(false)
		}
	}

	const deleteImage = async (
		paths: string[],
	): Promise<void> => {
		try {
			setIsLoading(true)
			setError(null)

			await checkAdminAccess()
			if (!paths.length) return

			// Clean the paths
			const cleanPaths = paths.map((path) =>
				path.replace(/^\/+|\/+$/g, ""),
			)

			const { error } = await supabase.storage
				.from("images")
				.remove(cleanPaths)

			if (error) throw error

			toast.success(
				`Deleted ${paths.length} image${
					paths.length > 1 ? "s" : ""
				}`,
			)
		} catch (err) {
			const error =
				err instanceof Error
					? err
					: new Error("Failed to delete image")
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
