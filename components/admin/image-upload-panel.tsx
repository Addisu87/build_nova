"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { ImageUploadResult } from "@/lib/supabase/images"
import { useState } from "react"
import { toast } from "sonner"

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
	const { handleImageUpload, isLoading } = usePropertyImages()

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files)
			setSelectedFiles(files)
		}
	}

	const handleUpload = async () => {
		await handleImageUpload(selectedFiles, {
			maxFiles,
			currentImages: [],
			folderPath,
			onSuccess: (results) => {
				onUploadComplete?.(results)
				setSelectedFiles([])
			}
		})
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
					Selected {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}
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
