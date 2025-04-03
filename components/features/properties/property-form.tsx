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
import { useAuth } from "@/contexts/auth-context"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { PropertyFormData, propertySchema } from "@/lib/properties/property-schemas"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { PROPERTY_TYPES, PropertyType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface ImageUploadResult {
	url: string
	path: string
}

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
	const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([])
	const [filesToDelete, setFilesToDelete] = useState<string[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>([])

	const { user } = useAuth()
	const [isAdmin, setIsAdmin] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
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

	const { uploadImage, deleteImage, isLoading: isUploadingImages } = usePropertyImages()

	// Initialize form with initialData
	useEffect(() => {
		if (initialData.images && initialData.images.length > 0) {
			setUploadedImages(
				initialData.images.map((url: string, index: number) => ({
					url,
					path: `initial/${index}`, // Temporary path for initial images
				})),
			)
		}
		reset(initialData)
	}, [initialData, reset])

	// Clean up preview URLs
	useEffect(() => {
		return () => {
			previewUrls.forEach((url) => URL.revokeObjectURL(url))
		}
	}, [previewUrls])

	useEffect(() => {
		const checkAdminStatus = async () => {
			if (!user) return

			const { data } = await supabaseAdmin.auth.admin.getUserById(user.id)

			setIsAdmin(data?.user?.user_metadata?.role === "admin" || false)
		}

		checkAdminStatus()
	}, [user])

	if (!isAdmin) {
		return (
			<div className="p-4 border rounded-lg text-center">
				<p>You need admin privileges to manage property images</p>
			</div>
		)
	}

	const handleFileUpload = async (files: File[]) => {
		const propertyType = watch("property_type")?.toLowerCase() || "default"
		const propertyId = initialData.id || "new"
		const folderPath = `properties/${propertyType}/${propertyId}`

		try {
			// Create preview URLs
			const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
			setPreviewUrls((prev) => [...prev, ...newPreviewUrls])

			// Upload files
			const uploadPromises = files.map((file) => uploadImage(file, folderPath))
			const results = await Promise.all(uploadPromises)

			// Update state
			setUploadedImages((prev) => [...prev, ...results])
			setValue("images", [...(watch("images") || []), ...results.map((r) => r.url)])

			toast.success(`Uploaded ${results.length} image${results.length > 1 ? "s" : ""}`)
		} catch (error) {
			toast.error("Failed to upload some images")
		} finally {
			// Clean up preview URLs after upload
			setPreviewUrls([])
		}
	}

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = uploadedImages[index]
		if (!imageToRemove) return

		try {
			// If it's an existing image (not just uploaded), mark for deletion
			if (imageToRemove.path && !imageToRemove.path.startsWith("initial/")) {
				setFilesToDelete((prev) => [...prev, imageToRemove.path])
			}

			// Remove from UI immediately
			const newImages = [...uploadedImages]
			newImages.splice(index, 1)
			setUploadedImages(newImages)
			setValue(
				"images",
				newImages.map((img) => img.url),
			)
		} catch (error) {
			toast.error("Failed to remove image")
		}
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: handleFileUpload,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		maxSize: 5 * 1024 * 1024, // 5MB
		maxFiles: 10 - uploadedImages.length, // Dynamic max based on current count
		disabled: isLoading || isUploadingImages,
	})

	const onSubmitForm = async (data: PropertyFormData) => {
		try {
			// First delete any marked images
			if (filesToDelete.length > 0) {
				await deleteImage(filesToDelete)
			}

			// Then submit the form data
			onSubmit({
				...data,
				images: uploadedImages.map((img) => img.url),
			})
		} catch (error) {
			toast.error("Failed to save property")
		}
	}

	const propertyTypeValue = watch("property_type")?.toLowerCase()
	const allImages = [
		...uploadedImages,
		...previewUrls.map((url) => ({ url, path: "preview" })),
	]

	return (
		<form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				{/* Title */}
				<div>
					<label className="text-sm font-medium">Title*</label>
					<Input
						{...register("title")}
						className="mt-1"
						placeholder="Beautiful family home"
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className="text-sm font-medium">Price*</label>
					<Input
						type="number"
						{...register("price", { valueAsNumber: true })}
						className="mt-1"
						placeholder="500000"
					/>
					{errors.price && (
						<p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
					)}
				</div>

				{/* Property Type */}
				<div>
					<label className="text-sm font-medium">Property Type*</label>
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
									{type.charAt(0) + type.slice(1).toLowerCase()}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.property_type && (
						<p className="text-red-500 text-sm mt-1">{errors.property_type.message}</p>
					)}
				</div>

				{/* Year Built */}
				<div>
					<label className="text-sm font-medium">Year Built</label>
					<Input
						type="number"
						{...register("year_built", {
							valueAsNumber: true,
							min: 1800,
							max: new Date().getFullYear(),
						})}
						className="mt-1"
						placeholder="2020"
					/>
					{errors.year_built && (
						<p className="text-red-500 text-sm mt-1">{errors.year_built.message}</p>
					)}
				</div>

				{/* Bedrooms */}
				<div>
					<label className="text-sm font-medium">Bedrooms*</label>
					<Input
						type="number"
						{...register("bedrooms", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="3"
					/>
					{errors.bedrooms && (
						<p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
					)}
				</div>

				{/* Bathrooms */}
				<div>
					<label className="text-sm font-medium">Bathrooms*</label>
					<Input
						type="number"
						{...register("bathrooms", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="2"
					/>
					{errors.bathrooms && (
						<p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
					)}
				</div>

				{/* Square Feet */}
				<div>
					<label className="text-sm font-medium">Square Feet*</label>
					<Input
						type="number"
						{...register("square_feet", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="1500"
					/>
					{errors.square_feet && (
						<p className="text-red-500 text-sm mt-1">{errors.square_feet.message}</p>
					)}
				</div>

				{/* Address */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Address*</label>
					<Input {...register("address")} className="mt-1" placeholder="123 Main St" />
					{errors.address && (
						<p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
					)}
				</div>

				{/* City */}
				<div>
					<label className="text-sm font-medium">City*</label>
					<Input {...register("city")} className="mt-1" placeholder="Anytown" />
					{errors.city && (
						<p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
					)}
				</div>

				{/* State */}
				<div>
					<label className="text-sm font-medium">State*</label>
					<Input
						{...register("state")}
						className="mt-1"
						placeholder="CA"
						maxLength={2}
					/>
					{errors.state && (
						<p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
					)}
				</div>

				{/* ZIP Code */}
				<div>
					<label className="text-sm font-medium">ZIP Code*</label>
					<Input {...register("zip_code")} className="mt-1" placeholder="90210" />
					{errors.zip_code && (
						<p className="text-red-500 text-sm mt-1">{errors.zip_code.message}</p>
					)}
				</div>
			</div>

			{/* Image Upload Section */}
			<div className="space-y-4">
				<label className="text-sm font-medium">
					Property Images ({uploadedImages.length}/10)
				</label>

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
							<p className="text-primary">Drop images here</p>
						) : (
							<p>Drag and drop images here, or click to select files</p>
						)}
						<p className="text-sm text-muted-foreground mt-1">
							Supported formats: JPG, PNG, WebP. Max size: 5MB per file
						</p>
					</div>
				</div>

				{/* Image Previews */}
				{allImages.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{allImages.map((image, index) => (
							<div
								key={image.path === "preview" ? `preview-${index}` : image.path}
								className="relative group aspect-square rounded-lg overflow-hidden border"
							>
								<Image
									src={image.url}
									alt={`Property image ${index + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(index)}
									disabled={isLoading || isUploadingImages}
									className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
									aria-label="Remove image"
								>
									×
								</button>
								{image.path === "preview" && (
									<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
										<span className="animate-pulse text-white">Uploading...</span>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Description */}
			<div>
				<label className="text-sm font-medium">Description*</label>
				<Textarea
					{...register("description")}
					className="mt-1"
					rows={4}
					placeholder="Describe the property features, neighborhood, and unique selling points..."
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isLoading || isUploadingImages}
				className="w-full"
				size="lg"
			>
				{isLoading
					? "Saving..."
					: isUploadingImages
					? "Processing images..."
					: "Save Property"}
			</Button>
		</form>
	)
}
