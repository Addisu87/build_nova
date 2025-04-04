"use client"

import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"
import { convertBlobUrlToFile } from "@/lib/utils"

interface PropertyImageUploadProps {
	onUploadComplete: (urls: string[]) => void
	maxFiles?: number
	folder?: string
	className?: string
}

export function PropertyImageUpload({
	onUploadComplete,
	maxFiles = 10,
	folder = "properties",
	className,
}: PropertyImageUploadProps) {
	const [imageUrls, setImageUrls] = useState<string[]>([])
	const imageInputRef = useRef<HTMLInputElement>(null)
	const [isPending, startTransition] = useTransition()
	const { uploadImage } = usePropertyImages()

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return

		const selectedFiles = Array.from(e.target.files)
		const totalFiles = imageUrls.length + selectedFiles.length

		if (totalFiles > maxFiles) {
			toast.error(`You can only upload up to ${maxFiles} images`)
			return
		}

		// Create preview URLs
		const newImageUrls = selectedFiles.map((file) => URL.createObjectURL(file))

		setImageUrls((prev) => [...prev, ...newImageUrls])
	}

	const removeImage = (index: number) => {
		// Revoke the object URL to avoid memory leaks
		URL.revokeObjectURL(imageUrls[index])

		setImageUrls((prev) => prev.filter((_, i) => i !== index))
	}

	const handleUploadImages = () => {
		if (imageUrls.length === 0) {
			toast.error("Please select at least one image to upload")
			return
		}

		startTransition(async () => {
			try {
				const uploadedUrls: string[] = []

				for (const url of imageUrls) {
					const imageFile = await convertBlobUrlToFile(url)
					const result = await uploadImage({
						file: imageFile,
						folder,
						maxSizeMB: 1, // Compress to 1MB max
					})

					if (result.error) {
						console.error(result.error)
						continue
					}

					uploadedUrls.push(result.url)
				}

				toast.success(`Successfully uploaded ${uploadedUrls.length} images`)
				onUploadComplete(uploadedUrls)

				// Clear the image previews after successful upload
				imageUrls.forEach((url) => URL.revokeObjectURL(url))
				setImageUrls([])
			} catch (error) {
				toast.error("Failed to upload images. Please try again.")
			}
		})
	}

	return (
		<div className={`space-y-4 ${className}`}>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{imageUrls.map((url, index) => (
					<div
						key={index}
						className="relative aspect-square rounded-md overflow-hidden border"
					>
						<Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
						<button
							type="button"
							onClick={() => removeImage(index)}
							className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
							disabled={isPending}
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				))}

				{imageUrls.length < maxFiles && (
					<label className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-gray-50 transition-colors">
						<Upload className="h-8 w-8 text-gray-400 mb-2" />
						<span className="text-sm text-gray-500">Upload Image</span>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={handleImageChange}
							className="hidden"
							disabled={isPending}
							ref={imageInputRef}
						/>
					</label>
				)}
			</div>

			{imageUrls.length > 0 && (
				<Button onClick={handleUploadImages} disabled={isPending} className="w-full">
					{isPending
						? "Uploading..."
						: `Upload ${imageUrls.length} Image${imageUrls.length > 1 ? "s" : ""}`}
				</Button>
			)}
		</div>
	)
}
