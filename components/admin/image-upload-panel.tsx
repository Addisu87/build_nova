"use client"

import { useStorageImages } from "@/hooks/properties/use-property-images"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

export function ImageUploadPanel() {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [folderPath, setFolderPath] = useState("properties/default")
	const { uploadMultipleImages, isUploading } = useStorageImages()

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setSelectedFiles(Array.from(e.target.files))
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
		} catch (error) {
			console.error("Upload error:", error)
		}
	}

	return (
		<div className="p-4 space-y-4 border rounded-lg">
			<h2 className="text-lg font-semibold">Image Upload</h2>

			<div className="space-y-2">
				<label className="text-sm font-medium">Folder Path</label>
				<Input
					type="text"
					value={folderPath}
					onChange={(e) => setFolderPath(e.target.value)}
					placeholder="Enter folder path (e.g., properties/luxury)"
				/>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Select Images</label>
				<Input
					type="file"
					multiple
					accept="image/*"
					onChange={handleFileSelect}
					className="cursor-pointer"
				/>
			</div>

			{selectedFiles.length > 0 && (
				<div className="text-sm text-gray-600">
					Selected {selectedFiles.length} files
				</div>
			)}

			<Button
				onClick={handleUpload}
				disabled={isUploading || selectedFiles.length === 0}
				className="w-full"
			>
				{isUploading ? "Uploading..." : "Upload Images"}
			</Button>
		</div>
	)
}
