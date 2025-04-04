"use client"

import { Button } from "@/components/ui/button"
import { deleteImage, uploadImage } from "@/hooks/properties/use-image-storage"
import { convertBlobUrlToFile } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface ImageUploadProps {
	folderPath: string
	onUploadComplete?: (results: Array<{ url: string; path: string }>) => void
	onDelete?: (path: string) => void
	existingImages?: Array<{ url: string; path: string }>
	maxFiles?: number
	disabled?: boolean
}

export function ImageUpload({
	folderPath,
	onUploadComplete,
	onDelete,
	existingImages = [],
	maxFiles = 10,
	disabled = false,
}: ImageUploadProps) {
	const [previews, setPreviews] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
		maxFiles: maxFiles - existingImages.length,
		disabled: disabled || isLoading || existingImages.length >= maxFiles,
		onDrop: (acceptedFiles) => {
			if (acceptedFiles.length + existingImages.length > maxFiles) {
				toast.error(`You can only upload up to ${maxFiles} images`)
				return
			}
			const blobUrls = acceptedFiles.map((file) => URL.createObjectURL(file))
			setPreviews((prev) => [...prev, ...blobUrls])
		},
	})

	const handleUpload = async () => {
		setIsLoading(true)
		try {
			const results = await Promise.all(
				previews.map(async (blobUrl) => {
					const file = await convertBlobUrlToFile(blobUrl)
					return uploadImage(file, folderPath, {
						maxSizeMB: 1,
						skipCompression: false,
					})
				}),
			)

			previews.forEach((url) => URL.revokeObjectURL(url))
			onUploadComplete?.(results)
			setPreviews([])
			toast.success("Images uploaded successfully")
		} catch (error) {
			toast.error("Upload failed")
			console.error("Upload failed:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (path: string) => {
		setIsLoading(true)
		try {
			await deleteImage(path)
			onDelete?.(path)
			toast.success("Image deleted successfully")
		} catch (error) {
			toast.error("Delete failed")
			console.error("Delete failed:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const removePreview = (index: number) => {
		URL.revokeObjectURL(previews[index])
		setPreviews((prev) => prev.filter((_, i) => i !== index))
	}

	return (
		<div className="space-y-6">
			<div
				{...getRootProps()}
				className={`
					relative border-2 border-dashed rounded-lg p-8
					transition-colors duration-200 ease-in-out
					${
						isDragActive
							? "border-primary bg-primary/5"
							: disabled
							? "border-gray-200 bg-gray-50 cursor-not-allowed"
							: "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
					}
				`}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center justify-center gap-3">
					<div
						className={`
						p-3 rounded-full 
						${isDragActive ? "bg-primary/10" : "bg-gray-100"}
					`}
					>
						<Upload
							className={`w-6 h-6 ${isDragActive ? "text-primary" : "text-gray-400"}`}
						/>
					</div>
					<div className="text-center space-y-1">
						<p className="text-sm font-medium">
							{isDragActive
								? "Drop images here"
								: disabled
								? "Upload limit reached"
								: "Drag & drop images here"}
						</p>
						<p className="text-xs text-gray-500">
							{disabled
								? `Maximum ${maxFiles} images allowed`
								: `Upload up to ${maxFiles - existingImages.length} images`}
						</p>
					</div>
				</div>
			</div>

			{(previews.length > 0 || existingImages.length > 0) && (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-medium">
							Images ({existingImages.length + previews.length}/{maxFiles})
						</h3>
						{previews.length > 0 && (
							<Button onClick={handleUpload} disabled={isLoading} size="sm">
								{isLoading ? "Uploading..." : "Upload Images"}
							</Button>
						)}
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{existingImages.map((image, i) => (
							<div
								key={`existing-${i}`}
								className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border"
							>
								<Image
									src={image.url}
									alt={`Image ${i}`}
									fill
									className="object-cover"
								/>
								<button
									onClick={() => handleDelete(image.path)}
									className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
									disabled={isLoading}
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
						{previews.map((blobUrl, i) => (
							<div
								key={`preview-${i}`}
								className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border"
							>
								<Image
									src={blobUrl}
									alt={`Preview ${i}`}
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
								<button
									onClick={() => removePreview(i)}
									className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
