"use client"

import { ImageUploadPanel } from "@/components/features/properties/image-upload-panel"
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
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
// Remove this import
// import { useAdminStatus } from "@/hooks/auth/use-admin-status"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import {
	PropertyFormData,
	propertySchema,
} from "@/lib/properties/property-schemas"
import {
	PROPERTY_TYPES,
	PropertyType,
} from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

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
	const [uploadedImages, setUploadedImages] =
		useState<ImageUploadResult[]>(() =>
			initialData.images
				? initialData.images.map(
						(url: string, index: number) => ({
							url,
							path: `initial/${index}`,
						}),
				  )
				: [],
		)
	const [filesToDelete, setFilesToDelete] =
		useState<string[]>([])
	const { user } = useAuth()
	const { isAdmin } = useAdminStatus(user)

	if (!user) {
		return (
			<div className="p-4 border rounded-lg text-center">
				<p>Please sign in to manage properties</p>
			</div>
		)
	}

	// Only check permissions if we're editing an existing property
	if (
		"id" in initialData &&
		"user_id" in initialData
	) {
		const canEditProperty =
			user?.user_metadata?.role === "admin" ||
			initialData.user_id === user?.id

		if (!canEditProperty) {
			return (
				<div className="p-4 border rounded-lg text-center">
					<p>
						You don't have permission to edit this
						property
					</p>
				</div>
			)
		}
	}

	const { deleteImage } = usePropertyImages()

	const form = useForm<PropertyFormData>({
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
			images: initialData.images || [],
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

	// Initialize form with initialData only once
	useEffect(() => {
		if (Object.keys(initialData).length > 0) {
			form.reset(initialData)
		}
	}, [initialData, form])

	if (isLoading) {
		return (
			<div className="p-4 border rounded-lg text-center">
				<LoadingState type="property" />
			</div>
		)
	}

	const handleImageUploadComplete = (
		results: ImageUploadResult[],
	) => {
		if (!results || results.length === 0) return

		const newImages = [
			...uploadedImages,
			...results,
		]
		setUploadedImages(newImages)

		// Update the form with the new image URLs
		const imageUrls = newImages
			.map((img) => img.url)
			.filter(Boolean)
		form.setValue("images", imageUrls, {
			shouldValidate: true,
			shouldDirty: true,
		})
	}

	const handleRemoveImage = async (index: number) => {
	  const imageToRemove = uploadedImages[index]
	  if (!imageToRemove) return
	
	  // Check permissions
	  if (user?.user_metadata?.role !== "admin" && 
	      initialData.user_id !== user?.id) {
	    toast.error("You don't have permission to delete images")
	    return
	  }
	
	  try {
	    if (imageToRemove.path && !imageToRemove.path.startsWith("initial/")) {
	      setFilesToDelete((prev) => [...prev, imageToRemove.path])
	    }
	
	    const newImages = uploadedImages.filter((_, i) => i !== index)
	    setUploadedImages(newImages)
	    form.setValue(
	      "images",
	      newImages.map((img) => img.url),
	    )
	  } catch (error) {
	    toast.error("Failed to remove image")
	  }
	}

	const propertyTypeValue =
		form.watch("property_type")?.toLowerCase() ||
		"default"
	const propertyId =
		(initialData as any)?.id || uuidv4()
	// Ensure clean folder path
	const folderPath =
		`properties/${propertyTypeValue}/${propertyId}`.replace(
			/\/+/g,
			"/",
		)

	console.log(
		"Property form upload path:",
		folderPath,
	)

	const handleFormSubmit = async (data: PropertyFormData) => {
	  try {
	    // Check permissions before allowing delete
	    if (filesToDelete.length > 0 && 
	        user?.user_metadata?.role !== "admin" && 
	        initialData.user_id !== user?.id) {
	      throw new Error("You don't have permission to modify this property")
	    }
	
	    if (filesToDelete.length > 0) {
	      await deleteImage(filesToDelete)
	      setFilesToDelete([])
	    }

			const formData = {
				...data,
				images: uploadedImages
					.map((img) => img.url)
					.filter(Boolean),
				property_type: data.property_type,
				status: data.status,
				year_built:
					data.year_built ||
					new Date().getFullYear(),
				price: Number(data.price),
				bedrooms: Number(data.bedrooms),
				bathrooms: Number(data.bathrooms),
				square_feet: Number(data.square_feet),
				listing_date: data.listing_date || null,
				user_id: user.id,
				updated_at: new Date().toISOString(),
			}

			await onSubmit(formData)
		} catch (error) {
			console.error("Submit error:", error)
			toast.error(error.message || "Failed to save property")
		}
	}

	return (
		<form
			onSubmit={form.handleSubmit(
				handleFormSubmit,
			)}
			className="space-y-6"
		>
			<div className="grid gap-6 md:grid-cols-2">
				{/* Title */}
				<div>
					<label className="text-sm font-medium">
						Title*
					</label>
					<Input
						{...form.register("title")}
						className="mt-1"
						placeholder="Beautiful family home"
					/>
					{form.formState.errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.title
									.message
							}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className="text-sm font-medium">
						Price*
					</label>
					<Input
						type="number"
						{...form.register("price", {
							valueAsNumber: true,
						})}
						className="mt-1"
						placeholder="500000"
					/>
					{form.formState.errors.price && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.price
									.message
							}
						</p>
					)}
				</div>

				{/* Property Type */}
				<div>
					<label className="text-sm font-medium">
						Property Type*
					</label>
					<Select
						value={propertyTypeValue}
						onValueChange={(value) =>
							form.setValue(
								"property_type",
								value.toUpperCase() as PropertyType,
							)
						}
					>
						<SelectTrigger className="mt-1">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(PROPERTY_TYPES).map(
								(type) => (
									<SelectItem
										key={type}
										value={type.toLowerCase()}
									>
										{type.charAt(0) +
											type.slice(1).toLowerCase()}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
					{form.formState.errors
						.property_type && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors
									.property_type.message
							}
						</p>
					)}
				</div>

				{/* Year Built */}
				<div>
					<label className="text-sm font-medium">
						Year Built
					</label>
					<Input
						type="number"
						{...form.register("year_built", {
							valueAsNumber: true,
							min: 1800,
							max: new Date().getFullYear(),
						})}
						className="mt-1"
						placeholder="2020"
					/>
					{form.formState.errors.year_built && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.year_built
									.message
							}
						</p>
					)}
				</div>

				{/* Bedrooms */}
				<div>
					<label className="text-sm font-medium">
						Bedrooms*
					</label>
					<Input
						type="number"
						{...form.register("bedrooms", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="3"
					/>
					{form.formState.errors.bedrooms && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.bedrooms
									.message
							}
						</p>
					)}
				</div>

				{/* Bathrooms */}
				<div>
					<label className="text-sm font-medium">
						Bathrooms*
					</label>
					<Input
						type="number"
						{...form.register("bathrooms", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="2"
					/>
					{form.formState.errors.bathrooms && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.bathrooms
									.message
							}
						</p>
					)}
				</div>

				{/* Square Feet */}
				<div>
					<label className="text-sm font-medium">
						Square Feet*
					</label>
					<Input
						type="number"
						{...form.register("square_feet", {
							valueAsNumber: true,
							min: 0,
						})}
						className="mt-1"
						placeholder="1500"
					/>
					{form.formState.errors.square_feet && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.square_feet
									.message
							}
						</p>
					)}
				</div>

				{/* Address */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">
						Address*
					</label>
					<Input
						{...form.register("address")}
						className="mt-1"
						placeholder="123 Main St"
					/>
					{form.formState.errors.address && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.address
									.message
							}
						</p>
					)}
				</div>

				{/* City */}
				<div>
					<label className="text-sm font-medium">
						City*
					</label>
					<Input
						{...form.register("city")}
						className="mt-1"
						placeholder="Anytown"
					/>
					{form.formState.errors.city && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.city.message}
						</p>
					)}
				</div>

				{/* State */}
				<div>
					<label className="text-sm font-medium">
						State*
					</label>
					<Input
						{...form.register("state")}
						className="mt-1"
						placeholder="CA"
						maxLength={2}
					/>
					{form.formState.errors.state && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.state
									.message
							}
						</p>
					)}
				</div>

				{/* ZIP Code */}
				<div>
					<label className="text-sm font-medium">
						ZIP Code*
					</label>
					<Input
						{...form.register("zip_code")}
						className="mt-1"
						placeholder="90210"
					/>
					{form.formState.errors.zip_code && (
						<p className="text-red-500 text-sm mt-1">
							{
								form.formState.errors.zip_code
									.message
							}
						</p>
					)}
				</div>
			</div>

			{/* Image Upload Section */}
			<div className="space-y-4">
				<label className="text-sm font-medium">
					Property Images ({uploadedImages.length}
					/10)
				</label>

				<ImageUploadPanel
					folderPath={folderPath}
					onUploadComplete={
						handleImageUploadComplete
					}
					maxFiles={10 - uploadedImages.length}
				/>

				{/* Image Previews */}
				{uploadedImages.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{uploadedImages.map(
							(image, index) => (
								<div
									key={image.path}
									className="relative group aspect-square rounded-lg overflow-hidden border"
								>
									<Image
										src={image.url}
										alt={`Property image ${
											index + 1
										}`}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
									/>
									<button
										type="button"
										onClick={() =>
											handleRemoveImage(index)
										}
										disabled={isLoading}
										className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
										aria-label="Remove image"
									>
										×
									</button>
								</div>
							),
						)}
					</div>
				)}
			</div>

			{/* Description */}
			<div>
				<label className="text-sm font-medium">
					Description*
				</label>
				<Textarea
					{...form.register("description")}
					className="mt-1"
					rows={4}
					placeholder="Describe the property features, neighborhood, and unique selling points..."
				/>
				{form.formState.errors.description && (
					<p className="text-red-500 text-sm mt-1">
						{
							form.formState.errors.description
								.message
						}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isLoading}
				className="w-full"
				size="lg"
			>
				{isLoading
					? "Saving..."
					: "Save Property"}
			</Button>
		</form>
	)
}
