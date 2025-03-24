"use client"

import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { ImageUploadResult } from "@/lib/supabase/images"

interface ImageUploadPanelProps {
	folderPath?: string
	onUploadComplete?: (results: ImageUploadResult[]) => void
	maxFiles?: number
}

export function ImageUploadPanel({
	folderPath = "properties/default",
	onUploadComplete,
	maxFiles = 10,
}: ImageUploadPanelProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const { uploadMultipleImages, isLoading } = usePropertyImages()

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files)
			if (files.length > maxFiles) {
				toast.error(`Maximum ${maxFiles} files allowed`)
				return
			}
			setSelectedFiles(files)
		}
	}

	const handleUpload = async () => {
		if (selectedFiles.length === 0) {
			toast.error("Please select files to upload")
			return
		}

		try {
			const results = await uploadMultipleImages(selectedFiles, folderPath)
			toast.success(`Successfully uploaded ${results.length} images`)
			setSelectedFiles([])
			onUploadComplete?.(results)
		} catch (error) {
			console.error("Upload error:", error)
		}
	}

	return (
		<div className="p-4 space-y-4 border rounded-lg">
			<h2 className="text-lg font-semibold">Image Upload</h2>

			<div className="space-y-2">
				<label className="text-sm font-medium">Select Images</label>
				<Input
					type="file"
					multiple
					accept="image/*"
					onChange={handleFileSelect}
					className="cursor-pointer"
					disabled={isLoading}
				/>
				<p className="text-xs text-gray-500">
					Maximum {maxFiles} files. Supported formats: JPG, PNG, GIF, WebP. Max size:
					5MB per file.
				</p>
			</div>

			{selectedFiles.length > 0 && (
				<div className="text-sm text-gray-600">
					Selected {selectedFiles.length} files
				</div>
			)}

			<Button
				onClick={handleUpload}
				disabled={isLoading || selectedFiles.length === 0}
				className="w-full"
			>
				{isLoading ? "Uploading..." : "Upload Images"}
			</Button>
		</div>
	)
}
