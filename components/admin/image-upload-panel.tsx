"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingState } from "@/components/ui/loading-state"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { ImageUploadResult } from "@/lib/supabase/images"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"

interface ImageUploadPanelProps {
	folderPath: string
	onUploadComplete?: (results: ImageUploadResult[]) => void
	maxFiles?: number
	showPreview?: boolean
	allowDelete?: boolean
}

export function ImageUploadPanel({
	folderPath,
	onUploadComplete,
	maxFiles = 10,
	showPreview = true,
	allowDelete = false,
}: ImageUploadPanelProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const { uploadMultipleImages, deleteImage, listImages, isLoading } = usePropertyImages()
	const [previewUrls, setPreviewUrls] = useState<string[]>([])
	const [existingImages, setExistingImages] = useState<ImageUploadResult[]>([])
	const [uploadError, setUploadError] = useState<string | null>(null)

	useEffect(() => {
		if (showPreview) {
			loadExistingImages()
		}
	}, [folderPath])

	const loadExistingImages = async () => {
		try {
			const images = await listImages(folderPath)
			setExistingImages(images)
		} catch (error) {
			console.error("Failed to load images:", error)
			toast.error("Failed to load existing images")
		}
	}

	const onDrop = async (acceptedFiles: File[]) => {
		try {
			setUploadError(null)
			
			if (acceptedFiles.length > maxFiles) {
				toast.error(`Maximum ${maxFiles} files allowed`)
				return
			}

			// Validate file sizes
			const invalidFiles = acceptedFiles.filter(file => file.size > 5 * 1024 * 1024)
			if (invalidFiles.length > 0) {
				toast.error("Some files exceed the 5MB size limit")
				return
			}

			setSelectedFiles(acceptedFiles)
			const urls = acceptedFiles.map(file => URL.createObjectURL(file))
			setPreviewUrls(urls)
		} catch (error) {
			console.error("Drop error:", error)
			toast.error("Failed to process selected files")
		}
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		disabled: isLoading
	})

	const handleUpload = async () => {
		try {
			setUploadError(null)
			const results = await uploadMultipleImages(selectedFiles, folderPath)
			
			setSelectedFiles([])
			previewUrls.forEach(url => URL.revokeObjectURL(url))
			setPreviewUrls([])
			
			onUploadComplete?.(results)
			toast.success(`Successfully uploaded ${results.length} images`)
			
			if (showPreview) {
				await loadExistingImages()
			}
		} catch (error) {
			console.error('Upload error:', error)
			setUploadError(error instanceof Error ? error.message : 'Failed to upload images')
			toast.error(error instanceof Error ? error.message : 'Failed to upload images')
		}
	}

	const handleDelete = async (path: string) => {
		try {
			await deleteImage(path)
			await loadExistingImages()
			toast.success('Image deleted successfully')
		} catch (error) {
			console.error('Delete error:', error)
		}
	}

	if (isLoading) {
		return <LoadingState type="imageUpload" />
	}

	return (
		<div className="space-y-4">
			<div className="p-4 border rounded-lg">
				<div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
					isDragActive ? "border-primary bg-primary/5" : "border-muted"
				}`}>
					<input {...getInputProps()} />
					<div className="text-center">
						<p>{isDragActive ? "Drop files here..." : "Drag & drop files here, or click to select"}</p>
						<p className="text-sm text-muted-foreground mt-1">
							Maximum {maxFiles} files. Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
						</p>
					</div>
				</div>

				{selectedFiles.length > 0 && (
					<div className="mt-4">
						<Button onClick={handleUpload} disabled={isLoading}>
							Upload {selectedFiles.length} file(s)
						</Button>
					</div>
				)}
			</div>

			{showPreview && existingImages.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{existingImages.map((image, index) => (
						<div key={image.path} className="relative group">
							<Image
								src={image.url}
								alt={`Uploaded image ${index + 1}`}
								width={200}
								height={200}
								className="rounded-lg object-cover w-full h-48"
							/>
							{allowDelete && (
								<Button
									variant="destructive"
									size="sm"
									className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => handleDelete(image.path)}
								>
									Delete
								</Button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
