"use client"

import { Button } from "@/components/ui/button"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import Image from "next/image"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface ImageUploadPanelProps {
	folderPath: string
	onUploadComplete?: (results: ImageUploadResult[]) => void
	maxFiles?: number
}

export function ImageUploadPanel({
	folderPath,
	onUploadComplete,
	maxFiles = 10,
}: ImageUploadPanelProps) {
	const [files, setFiles] = useState<File[]>([])
	const [previews, setPreviews] = useState<string[]>([])
	const { uploadImage, isLoading, error } = usePropertyImages()

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		maxFiles,
		onDrop: (acceptedFiles) => {
			setFiles(acceptedFiles)
			setPreviews(acceptedFiles.map((file) => URL.createObjectURL(file)))
		},
		disabled: isLoading,
	})

	const handleUpload = async () => {
		try {
			const results = await Promise.all(
				files.map((file) => uploadImage(file, folderPath)),
			)

			onUploadComplete?.(results)
			toast.success(`${results.length} images uploaded successfully`)

			// Cleanup
			setFiles([])
			previews.forEach((url) => URL.revokeObjectURL(url))
			setPreviews([])
		} catch (error) {
			console.error("Upload failed:", error)
		}
	}

	return (
		<div className="space-y-4">
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
					isDragActive ? "border-primary bg-primary/5" : "border-muted"
				}`}
			>
				<input {...getInputProps()} />
				<div className="text-center">
					<p>
						{isDragActive
							? "Drop files here..."
							: "Drag & drop images here, or click to select"}
					</p>
					<p className="text-sm text-muted-foreground mt-1">
						Max {maxFiles} files (JPG, PNG, WebP). Max size: 5MB
					</p>
				</div>
			</div>

			{previews.length > 0 && (
				<div className="grid grid-cols-3 gap-2">
					{previews.map((preview, index) => (
						<div key={index} className="relative aspect-square">
							<Image
								src={preview}
								alt={`Preview ${index + 1}`}
								fill
								className="object-cover rounded"
							/>
						</div>
					))}
				</div>
			)}

			{files.length > 0 && (
				<Button onClick={handleUpload} disabled={isLoading} className="w-full">
					{isLoading ? "Uploading..." : `Upload ${files.length} Image(s)`}
				</Button>
			)}
		</div>
	)
}
