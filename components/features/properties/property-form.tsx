"use client"

import { ImageUpload } from "@/components/common/image-upload"
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
import { deleteImage } from "@/hooks/properties/use-image-storage"
import { PropertyFormData, propertySchema } from "@/lib/properties/property-schemas"
import { PROPERTY_TYPES, PropertyType } from "@/types"
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
	const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>(() =>
		initialData.images
			? initialData.images.map((url: string, index: number) => ({
					url,
					path: `initial/${index}`,
			  }))
			: [],
	)
	const [filesToDelete, setFilesToDelete] = useState<string[]>([])
	const { user } = useAuth()

	if (!user) {
		return (
			<div className="p-4 border rounded-lg text-center">
				<p>Please sign in to manage properties</p>
			</div>
		)
	}

	// Only check permissions if we're editing an existing property
	if ("id" in initialData && "user_id" in initialData) {
		const canEditProperty =
			user?.user_metadata?.role === "admin" || initialData.user_id === user?.id

		if (!canEditProperty) {
			return (
				<div className="p-4 border rounded-lg text-center">
					<p>You don't have permission to edit this property</p>
				</div>
			)
		}
	}

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

	const handleImageUploadComplete = (results: ImageUploadResult[]) => {
		if (!results || results.length === 0) return

		const newImages = [...uploadedImages, ...results]
		setUploadedImages(newImages)

		// Update the form with the new image URLs
		const imageUrls = newImages.map((img) => img.url).filter(Boolean)
		form.setValue("images", imageUrls, {
			shouldValidate: true,
			shouldDirty: true,
		})
	}

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = uploadedImages[index]
		if (!imageToRemove) return

		// Check permissions
		if (user?.user_metadata?.role !== "admin" && initialData.user_id !== user?.id) {
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

	const propertyTypeValue = form.watch("property_type")?.toLowerCase() || "default"
	const propertyId = (initialData as any)?.id || uuidv4()
	// Ensure clean folder path
	const folderPath = `properties/${propertyTypeValue}/${propertyId}`.replace(
		/\/+/g,
		"/",
	)

	console.log("Property form upload path:", folderPath)

	const handleFormSubmit = async (data: PropertyFormData) => {
		try {
			// Check permissions before allowing delete
			if (
				filesToDelete.length > 0 &&
				user?.user_metadata?.role !== "admin" &&
				initialData.user_id !== user?.id
			) {
				throw new Error("You don't have permission to modify this property")
			}

			if (filesToDelete.length > 0) {
				await deleteImage(filesToDelete)
				setFilesToDelete([])
			}

			const formData = {
				...data,
				images: uploadedImages.map((img) => img.url).filter(Boolean),
				property_type: data.property_type,
				status: data.status,
				year_built: data.year_built || new Date().getFullYear(),
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
		<form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				{/* Basic Information */}
				<div>
					<label className="text-sm font-medium">Title*</label>
					<Input
						{...form.register("title")}
						className="mt-1"
						placeholder="Luxurious Waterfront Villa with Ocean Views"
					/>
					{form.formState.errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.title.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Price*</label>
					<Input
						type="number"
						{...form.register("price", { valueAsNumber: true })}
						className="mt-1"
						placeholder="750000"
					/>
					{form.formState.errors.price && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.price.message}
						</p>
					)}
				</div>

				{/* Property Details */}
				<div>
					<label className="text-sm font-medium">Property Type*</label>
					<Select
						value={propertyTypeValue}
						onValueChange={(value) =>
							form.setValue("property_type", value.toUpperCase() as PropertyType)
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
					{form.formState.errors.property_type && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.property_type.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Year Built*</label>
					<Input
						type="number"
						{...form.register("year_built", { valueAsNumber: true })}
						className="mt-1"
						placeholder="2020"
					/>
					{form.formState.errors.year_built && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.year_built.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Bedrooms*</label>
					<Input
						type="number"
						{...form.register("bedrooms", { valueAsNumber: true })}
						className="mt-1"
						placeholder="4"
					/>
					{form.formState.errors.bedrooms && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.bedrooms.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Bathrooms*</label>
					<Input
						type="number"
						{...form.register("bathrooms", { valueAsNumber: true })}
						className="mt-1"
						placeholder="3.5"
					/>
					{form.formState.errors.bathrooms && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.bathrooms.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Square Feet*</label>
					<Input
						type="number"
						{...form.register("square_feet", { valueAsNumber: true })}
						className="mt-1"
						placeholder="2500"
					/>
					{form.formState.errors.square_feet && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.square_feet.message}
						</p>
					)}
				</div>

				{/* Location Information */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Address*</label>
					<Input
						{...form.register("address")}
						className="mt-1"
						placeholder="1234 Ocean View Boulevard"
					/>
					{form.formState.errors.address && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.address.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">City*</label>
					<Input
						{...form.register("city")}
						className="mt-1"
						placeholder="San Francisco"
					/>
					{form.formState.errors.city && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.city.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">State*</label>
					<Input
						{...form.register("state")}
						className="mt-1"
						placeholder="CA"
						maxLength={2}
					/>
					{form.formState.errors.state && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.state.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">ZIP Code*</label>
					<Input {...form.register("zip_code")} className="mt-1" placeholder="94123" />
					{form.formState.errors.zip_code && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.zip_code.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Latitude</label>
					<Input
						type="number"
						step="any"
						{...form.register("latitude", { valueAsNumber: true })}
						className="mt-1"
						placeholder="37.7749"
					/>
					{form.formState.errors.latitude && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.latitude.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Longitude</label>
					<Input
						type="number"
						step="any"
						{...form.register("longitude", { valueAsNumber: true })}
						className="mt-1"
						placeholder="-122.4194"
					/>
					{form.formState.errors.longitude && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.longitude.message}
						</p>
					)}
				</div>

				{/* Property Status */}
				<div>
					<label className="text-sm font-medium">Status</label>
					<Select
						value={form.watch("status")}
						onValueChange={(value) => form.setValue("status", value)}
					>
						<SelectTrigger className="mt-1">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="for-sale">For Sale</SelectItem>
							<SelectItem value="for-rent">For Rent</SelectItem>
							<SelectItem value="sold">Sold</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
						</SelectContent>
					</Select>
					{form.formState.errors.status && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.status.message}
						</p>
					)}
				</div>

				{/* Additional Property Details */}
				<div>
					<label className="text-sm font-medium">Lot Size (sq ft)</label>
					<Input
						type="number"
						{...form.register("lot_size", { valueAsNumber: true })}
						className="mt-1"
						placeholder="6000"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Parking Spaces</label>
					<Input
						type="number"
						{...form.register("parking_spaces", { valueAsNumber: true })}
						className="mt-1"
						placeholder="2"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Heating Type</label>
					<Input
						{...form.register("heating_type")}
						className="mt-1"
						placeholder="Forced Air, Radiant, Heat Pump"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Cooling Type</label>
					<Input
						{...form.register("cooling_type")}
						className="mt-1"
						placeholder="Central Air, Split System"
					/>
				</div>

				{/* Financial Details */}
				<div>
					<label className="text-sm font-medium">HOA Fees (monthly)</label>
					<Input
						type="number"
						{...form.register("hoa_fees", { valueAsNumber: true })}
						className="mt-1"
						placeholder="450"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Property Tax (annual)</label>
					<Input
						type="number"
						{...form.register("property_tax", { valueAsNumber: true })}
						className="mt-1"
						placeholder="8500"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Price per Square Foot</label>
					<Input
						type="number"
						{...form.register("price_per_square_foot", { valueAsNumber: true })}
						className="mt-1"
						placeholder="350"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Estimated Value</label>
					<Input
						type="number"
						{...form.register("estimate", { valueAsNumber: true })}
						className="mt-1"
						placeholder="785000"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Monthly Rent Estimate</label>
					<Input
						type="number"
						{...form.register("rent_estimate", { valueAsNumber: true })}
						className="mt-1"
						placeholder="3500"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Last Sold Price</label>
					<Input
						type="number"
						{...form.register("last_sold_price", { valueAsNumber: true })}
						className="mt-1"
						placeholder="680000"
					/>
				</div>

				{/* Listing Information */}
				<div>
					<label className="text-sm font-medium">MLS Number</label>
					<Input
						{...form.register("mls_number")}
						className="mt-1"
						placeholder="SF24A456789"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Listing Date</label>
					<Input type="date" {...form.register("listing_date")} className="mt-1" />
				</div>

				<div>
					<label className="text-sm font-medium">Days on Market</label>
					<Input
						type="number"
						{...form.register("days_on_market", { valueAsNumber: true })}
						className="mt-1"
						placeholder="14"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Last Sold Date</label>
					<Input type="date" {...form.register("last_sold_date")} className="mt-1" />
				</div>

				{/* Location Scores */}
				<div>
					<label className="text-sm font-medium">School District</label>
					<Input
						{...form.register("school_district")}
						className="mt-1"
						placeholder="San Francisco Unified School District"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Walk Score</label>
					<Input
						type="number"
						{...form.register("walk_score", { valueAsNumber: true })}
						className="mt-1"
						placeholder="85"
						min="0"
						max="100"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Transit Score</label>
					<Input
						type="number"
						{...form.register("transit_score", { valueAsNumber: true })}
						className="mt-1"
						placeholder="90"
						min="0"
						max="100"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">Bike Score</label>
					<Input
						type="number"
						{...form.register("bike_score", { valueAsNumber: true })}
						className="mt-1"
						placeholder="75"
						min="0"
						max="100"
					/>
				</div>

				{/* Features and Amenities */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Features</label>
					<Input
						{...form.register("features")}
						className="mt-1"
						placeholder="Hardwood floors, Granite countertops, Updated kitchen, Smart home features"
						onChange={(e) => {
							const features = e.target.value
								.split(",")
								.map((f) => f.trim())
								.filter(Boolean)
							form.setValue("features", features)
						}}
					/>
				</div>

				<div className="md:col-span-2">
					<label className="text-sm font-medium">Amenities</label>
					<Input
						{...form.register("amenities")}
						className="mt-1"
						placeholder="Swimming pool, Home theater, Wine cellar, Outdoor kitchen"
						onChange={(e) => {
							const amenities = e.target.value
								.split(",")
								.map((a) => a.trim())
								.filter(Boolean)
							form.setValue("amenities", amenities)
						}}
					/>
				</div>

				{/* Description */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Description*</label>
					<Textarea
						{...form.register("description")}
						className="mt-1"
						placeholder="Stunning waterfront property featuring panoramic ocean views. This luxurious home offers modern amenities, high-end finishes, and an ideal location..."
						rows={4}
					/>
					{form.formState.errors.description && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.description.message}
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

				<ImageUpload
					folderPath={folderPath}
					onUploadComplete={handleImageUploadComplete}
					maxFiles={10 - uploadedImages.length}
				/>

				{/* Image Previews */}
				{uploadedImages.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{uploadedImages.map((image, index) => (
							<div
								key={image.path}
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
									disabled={isLoading}
									className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                     opacity-0 group-hover:opacity-100 transition-opacity"
									aria-label="Remove image"
								>
									×
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			<Button type="submit" disabled={isLoading} className="w-full" size="lg">
				{isLoading ? "Saving..." : "Save Property"}
			</Button>
		</form>
	)
}
