import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import { convertBlobUrlToFile } from "@/lib/utils"
import imageCompression from "browser-image-compression"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
interface ImageUploadResult {
	url: string
	path: string
	imageUrl?: string
	error?: string
}

interface UploadOptions {
	file: File
	folder?: string
	skipCompression?: boolean
	maxSizeMB?: number
	contentType?: string
	cacheControl?: string
	upsert?: boolean
}

export function usePropertyImages() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const { user } = useAuth()

	const validateFile = (file: File) => {
		const allowedTypes = [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif",
			"image/avif",
		]

		if (!file.type.startsWith("image/")) {
			throw new Error(`File is not an image (${file.type})`)
		}

		if (!allowedTypes.includes(file.type)) {
			throw new Error(`Unsupported image type. Allowed: ${allowedTypes.join(", ")}`)
		}

		const maxSize = 10 * 1024 * 1024
		if (file.size > maxSize) {
			throw new Error(
				`Image too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size: 10MB`,
			)
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

	const compressImage = async (file: File, maxSizeMB: number = 1): Promise<File> => {
		const options = {
			maxSizeMB,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
			fileType: file.type,
			preserveExif: false, // Remove EXIF data for privacy
			initialQuality: 0.85, // Better quality balance
		}

		try {
			const compressedFile = await imageCompression(file, options)
			// Ensure minimum quality
			if (compressedFile.size > file.size * 0.9) {
				return file // Skip compression if savings are minimal
			}
			return compressedFile
		} catch (err) {
			console.warn("Image compression failed, using original:", err)
			return file
		}
	}

	// Simple upload function that matches the example code's interface
	const uploadImageSimple = useCallback(
		async ({
			file,
			folder = "properties",
			skipCompression = false,
			maxSizeMB = 1,
		}: UploadOptions): Promise<{ imageUrl: string; error: string }> => {
			try {
				setIsLoading(true)
				setError(null)

				validateFile(file)

				// Compress the image if needed
				let processedFile = file
				if (!skipCompression) {
					processedFile = await compressImage(file, maxSizeMB)
				}

				// Generate a unique filename
				const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
				const fileName = `${uuidv4()}.${fileExt}`
				const path = `${folder ? folder + "/" : ""}${fileName}`

				// Upload to Supabase
				const { data, error } = await supabase.storage
					.from("images")
					.upload(path, processedFile, {
						cacheControl: "3600",
						upsert: false,
					})

				if (error) {
					return { imageUrl: "", error: "Image upload failed: " + error.message }
				}

				// Get the public URL
				const {
					data: { publicUrl },
				} = supabase.storage.from("images").getPublicUrl(data.path)

				toast.success("Image uploaded successfully")
				return { imageUrl: publicUrl, error: "" }
			} catch (err) {
				const errorMsg =
					err instanceof Error ? err.message : "Unknown error during upload"
				toast.error(`Upload failed: ${errorMsg}`)
				return { imageUrl: "", error: errorMsg }
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	// Original more advanced upload function
	const uploadImage = async (
		fileOrOptions: File | UploadOptions,
		folderPath?: string,
		options?: {
			contentType?: string
			cacheControl?: string
			upsert?: boolean
			skipCompression?: boolean
			maxSizeMB?: number
		},
	): Promise<ImageUploadResult | { imageUrl: string; error: string }> => {
		try {
			setIsLoading(true)
			setError(null)

			// Handle the case where first parameter is an options object
			if (typeof fileOrOptions !== "File" && "file" in fileOrOptions) {
				const {
					file,
					folder = "properties",
					skipCompression = false,
					maxSizeMB = 1,
				} = fileOrOptions

				validateFile(file)

				// Compress the image if needed
				let processedFile = file
				if (!skipCompression) {
					processedFile = await compressImage(file, maxSizeMB)
				}

				// Generate a unique filename
				const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
				const fileName = `${uuidv4()}.${fileExt}`
				const path = `${folder ? folder + "/" : ""}${fileName}`

				// Upload to Supabase
				const { data, error } = await supabase.storage
					.from("images")
					.upload(path, processedFile, {
						cacheControl: "3600",
						upsert: false,
					})

				if (error) {
					return { imageUrl: "", error: "Image upload failed: " + error.message }
				}

				// Get the public URL
				const {
					data: { publicUrl },
				} = supabase.storage.from("images").getPublicUrl(data.path)

				toast.success("Image uploaded successfully")
				return { imageUrl: publicUrl, error: "" }
			}

			// Original implementation for the traditional pattern
			const file = fileOrOptions as File
			// Verify session
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession()
			if (sessionError || !session) {
				throw new Error("Authentication required - please sign in")
			}

			validateFile(file)
			const fileToUpload = options?.skipCompression
				? file
				: await compressImage(file, options?.maxSizeMB || 1)

			const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, "")
			const fileExt = fileToUpload.name.split(".").pop()?.toLowerCase() || "jpg"
			const fileName = `${uuidv4()}.${fileExt}`
			const filePath = `${cleanFolderPath}/${fileName}`

			// Add retry logic for upload
			const maxRetries = 3

			for (let attempt = 1; attempt <= maxRetries; attempt++) {
				try {
					const { data, error: uploadError } = await supabase.storage
						.from("images")
						.upload(filePath, fileToUpload, {
							cacheControl: options?.cacheControl || "3600",
							upsert: options?.upsert || false,
							contentType: options?.contentType || fileToUpload.type,
							duplex: "half",
						})

					if (uploadError) throw uploadError

					// Verify the file exists after upload
					const { error: verifyError } = await supabase.storage
						.from("images")
						.download(filePath)

					if (verifyError) {
						throw new Error(`Upload verification failed: ${verifyError.message}`)
					}

					const {
						data: { publicUrl },
					} = supabase.storage.from("images").getPublicUrl(filePath, {
						download: false,
						transform: {
							width: 1920,
							height: 1080,
							quality: 80,
						},
					})

					if (!publicUrl) {
						throw new Error("Failed to generate public URL for uploaded image")
					}

					const timestamp = new Date().getTime()
					const finalUrl = `${publicUrl}?t=${timestamp}`

					toast.success("Image uploaded successfully")
					return {
						url: finalUrl,
						path: filePath,
					}
				} catch (err) {
					if (attempt < maxRetries) {
						await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
						continue
					}
					throw err
				}
			}
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Upload failed")
			setError(error)
			toast.error(`Upload failed: ${error.message}`)
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

			const cleanFolderPath = folderPath.replace(/^\/+|\/+$/g, "")

			const { data, error: listError } = await supabase.storage
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
						} = supabase.storage.from("images").getPublicUrl(path, {
							download: false,
							transform: {
								width: 1920,
								height: 1080,
								quality: 80,
							},
						})

						if (!publicUrl) {
							throw new Error(`Failed to generate URL for image: ${path}`)
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

	// Function to upload multiple images from blob URLs
	const uploadMultipleImages = useCallback(
		async (imageUrls: string[], folder: string = "properties"): Promise<string[]> => {
			setIsLoading(true)
			setError(null)
			const uploadedUrls: string[] = []

			try {
				for (const url of imageUrls) {
					const imageFile = await convertBlobUrlToFile(url)
					const { imageUrl, error } = await uploadImageSimple({
						file: imageFile,
						folder,
					})

					if (error) {
						console.error(error)
						continue
					}

					uploadedUrls.push(imageUrl)
				}

				return uploadedUrls
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Failed to upload images"
				toast.error(errorMsg)
				throw error
			} finally {
				setIsLoading(false)
			}
		},
		[],
	)

	return {
		uploadImage,
		uploadMultipleImages,
		deleteImage,
		listImages,
		isLoading,
		error,
	}
}
