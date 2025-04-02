"use client"

import {
	Button,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@/components/ui"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { PropertyFormData, propertySchema } from "@/lib/properties/property-schemas"
import { PROPERTY_TYPES, PropertyType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface PropertyFormProps {
	initialData?: Partial<PropertyFormData>
	onSubmit: (data: PropertyFormData) => void
	isLoading?: boolean
}

export function PropertyForm({
	initialData = {},
	onSubmit,
	isLoading = false,
}: PropertyFormProps) {
	const [uploadedImages, setUploadedImages] = useState<
		Array<{ url: string; path: string }>
	>(initialData.images?.map((url, index) => ({ url, path: `initial/${index}` })) || [])

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<PropertyFormData>({
		resolver: zodResolver(propertySchema),
		defaultValues: {
			title: "",
			description: "",
			price: 0,
			bedrooms: 0,
			bathrooms: 0,
			square_feet: 0,
			property_type: "HOUSE",
			year_built: new Date().getFullYear(),
			address: "",
			city: "",
			state: "",
			zip_code: "",
			latitude: 0,
			longitude: 0,
			images: [],
			features: [],
			status: "for-sale",
			amenities: [],
			lot_size: 0,
			parking_spaces: 0,
			heating_type: "",
			cooling_type: "",
			hoa_fees: 0,
			property_tax: 0,
			mls_number: "",
			listing_date: "",
			days_on_market: 0,
			school_district: "",
			walk_score: 0,
			transit_score: 0,
			bike_score: 0,
			price_per_square_foot: 0,
			estimate: 0,
			rent_estimate: 0,
			last_sold_price: 0,
			...initialData,
		},
	})

	const {
		handleImageUpload,
		deleteMultipleImages,
		isLoading: isUploadingImages,
	} = usePropertyImages()

	const handleFiles = async (files: File[]) => {
		const propertyType = watch("property_type")?.toLowerCase() || "default"
		const propertyId = initialData.id || "new"
		const folderPath = `properties/${propertyType}/${propertyId}`

		await handleImageUpload(files, {
			maxFiles: 10,
			currentImages: uploadedImages,
			folderPath,
			onSuccess: (results) => {
				setUploadedImages((prev) => [...prev, ...results])
				setValue("images", [...(watch("images") || []), ...results.map((r) => r.url)])
			},
		})
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleFiles,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		disabled: isLoading || isUploadingImages,
	})

	const removeImage = async (index: number) => {
		try {
			const imageToRemove = uploadedImages[index]
			if (imageToRemove?.path && !imageToRemove.path.startsWith("initial/")) {
				await deleteMultipleImages([imageToRemove.path])
			}

			const newUploadedImages = uploadedImages.filter((_, i) => i !== index)
			setUploadedImages(newUploadedImages)
			setValue(
				"images",
				newUploadedImages.map((img) => img.url),
			)
		} catch (error) {
			console.error("Failed to remove image:", error)
			// Error toast is handled in the hook
		}
	}

	const propertyTypeValue = watch("property_type")?.toLowerCase()

	const onSubmitForm = (data: PropertyFormData) => {
		onSubmit(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<label className="text-sm font-medium">Title</label>
					<Input {...register("title")} className="mt-1" />
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Price</label>
					<Input
						type="number"
						{...register("price", { valueAsNumber: true })}
						className="mt-1"
					/>
					{errors.price && (
						<p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Property Type</label>
					<Select
						value={propertyTypeValue}
						onValueChange={(value) =>
							setValue("property_type", value.toUpperCase() as PropertyType)
						}
					>
						<SelectTrigger className="mt-1">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(PROPERTY_TYPES).map((type) => (
								<SelectItem key={type} value={type.toLowerCase()}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.property_type && (
						<p className="text-red-500 text-sm mt-1">{errors.property_type.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Year Built</label>
					<Input
						type="number"
						{...register("year_built", { valueAsNumber: true })} // Corrected field name
						className="mt-1"
					/>
					{errors.year_built && (
						<p className="text-red-500 text-sm mt-1">{errors.year_built.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Bedrooms</label>
					<Input
						type="number"
						{...register("bedrooms", { valueAsNumber: true })}
						className="mt-1"
					/>
					{errors.bedrooms && (
						<p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Bathrooms</label>
					<Input
						type="number"
						{...register("bathrooms", { valueAsNumber: true })}
						className="mt-1"
					/>
					{errors.bathrooms && (
						<p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Square Feet</label>
					<Input
						type="number"
						{...register("square_feet", { valueAsNumber: true })} // Corrected field name
						className="mt-1"
					/>
					{errors.square_feet && (
						<p className="text-red-500 text-sm mt-1">{errors.square_feet.message}</p>
					)}
				</div>
			</div>

			{/* Image upload section */}
			<div className="space-y-4">
				<label className="text-sm font-medium">Property Images</label>
				<div
					{...getRootProps()}
					className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
						isDragActive
							? "border-primary bg-primary/5"
							: "border-muted hover:border-primary/50"
					}`}
				>
					<input {...getInputProps()} />
					<div className="text-center">
						{isDragActive ? (
							<p>Drop the files here ...</p>
						) : (
							<p>Drag and drop images here, or click to select files</p>
						)}
						<p className="text-sm text-muted-foreground mt-1">
							Maximum 10 files. Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
							per file.
						</p>
					</div>
				</div>

				{/* Image previews */}
				{uploadedImages.length > 0 && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{uploadedImages.map((image, index) => (
							<div
								key={image.url}
								className="relative group aspect-square rounded-lg overflow-hidden"
							>
								<Image
									src={image.url}
									alt={`Property image ${index + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, 25vw"
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									disabled={isLoading || isUploadingImages}
									className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<div>
				<label className="text-sm font-medium">Description</label>
				<Textarea {...register("description")} className="mt-1" rows={4} />
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isLoading || isUploadingImages}
				className="w-full"
			>
				{isLoading || isUploadingImages ? "Saving..." : "Save Property"}
			</Button>
		</form>
	)
}
