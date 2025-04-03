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
import { useAuth } from "@/contexts/auth-context"
import { useAdminStatus } from "@/hooks/auth/use-admin-status"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { PropertyFormData, propertySchema } from "@/lib/properties/property-schemas"
import { PROPERTY_TYPES, PropertyType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState } from "react"
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
	const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>(() => 
		initialData.images 
			? initialData.images.map((url: string, index: number) => ({
				url,
				path: `initial/${index}`,
			}))
			: []
	)
	const [filesToDelete, setFilesToDelete] = useState<string[]>([])
	const { user } = useAuth()
	const { isAdmin } = useAdminStatus(user)
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
		form.reset(initialData)
	}, []) // Empty dependency array - only run once on mount

	if (!isAdmin) {
		return (
			<div className="p-4 border rounded-lg text-center">
				<p>You need admin privileges to manage properties</p>
			</div>
		)
	}

	const handleImageUploadComplete = (results: ImageUploadResult[]) => {
		const newImages = [...uploadedImages, ...results]
		setUploadedImages(newImages)
		form.setValue("images", newImages.map(img => img.url))
	}

	const handleRemoveImage = async (index: number) => {
		const imageToRemove = uploadedImages[index]
		if (!imageToRemove) return

		try {
			if (imageToRemove.path && !imageToRemove.path.startsWith("initial/")) {
				setFilesToDelete(prev => [...prev, imageToRemove.path])
			}

			const newImages = uploadedImages.filter((_, i) => i !== index)
			setUploadedImages(newImages)
			form.setValue("images", newImages.map(img => img.url))
		} catch (error) {
			toast.error("Failed to remove image")
		}
	}

	const propertyTypeValue = form.watch("property_type")?.toLowerCase()
	const propertyId = initialData.id || "new"
	const folderPath = `properties/${propertyTypeValue}/${propertyId}`

	const onSubmitForm = async (data: PropertyFormData) => {
		try {
			if (filesToDelete.length > 0) {
				await deleteImage(filesToDelete)
				setFilesToDelete([])
			}

			await onSubmit({
				...data,
				images: uploadedImages.map(img => img.url),
			})
		} catch (error) {
			toast.error("Failed to save property")
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				{/* Title */}
				<div>
					<label className="text-sm font-medium">Title*</label>
					<Input
						{...form.register("title")}
						className="mt-1"
						placeholder="Beautiful family home"
					/>
					{form.formState.errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.title.message}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label className="text-sm font-medium">Price*</label>
					<Input
						type="number"
						{...form.register("price", { valueAsNumber: true })}
						className="mt-1"
						placeholder="500000"
					/>
					{form.formState.errors.price && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.price.message}
						</p>
					)}
				</div>

				{/* Property Type */}
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

				{/* Year Built */}
				<div>
					<label className="text-sm font-medium">Year Built</label>
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
							{form.formState.errors.year_built.message}
						</p>
					)}
				</div>

				{/* Bedrooms */}
				<div>
					<label className="text-sm font-medium">Bedrooms*</label>
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
							{form.formState.errors.bedrooms.message}
						</p>
					)}
				</div>

				{/* Bathrooms */}
				<div>
					<label className="text-sm font-medium">Bathrooms*</label>
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
							{form.formState.errors.bathrooms.message}
						</p>
					)}
				</div>

				{/* Square Feet */}
				<div>
					<label className="text-sm font-medium">Square Feet*</label>
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
							{form.formState.errors.square_feet.message}
						</p>
					)}
				</div>

				{/* Address */}
				<div className="md:col-span-2">
					<label className="text-sm font-medium">Address*</label>
					<Input
						{...form.register("address")}
						className="mt-1"
						placeholder="123 Main St"
					/>
					{form.formState.errors.address && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.address.message}
						</p>
					)}
				</div>

				{/* City */}
				<div>
					<label className="text-sm font-medium">City*</label>
					<Input {...form.register("city")} className="mt-1" placeholder="Anytown" />
					{form.formState.errors.city && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.city.message}
						</p>
					)}
				</div>

				{/* State */}
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

				{/* ZIP Code */}
				<div>
					<label className="text-sm font-medium">ZIP Code*</label>
					<Input {...form.register("zip_code")} className="mt-1" placeholder="90210" />
					{form.formState.errors.zip_code && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.zip_code.message}
						</p>
					)}
				</div>
			</div>

			{/* Image Upload Section */}
			<div className="space-y-4">
				<label className="text-sm font-medium">
					Property Images ({uploadedImages.length}/10)
				</label>

				<ImageUploadPanel
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

			{/* Description */}
			<div>
				<label className="text-sm font-medium">Description*</label>
				<Textarea
					{...form.register("description")}
					className="mt-1"
					rows={4}
					placeholder="Describe the property features, neighborhood, and unique selling points..."
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
				)}
			</div>

			<Button type="submit" disabled={isLoading} className="w-full" size="lg">
				{isLoading ? "Saving..." : "Save Property"}
			</Button>
		</form>
	)
}
