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
import { PropertyFormData, propertySchema } from "@/lib/properties/property-schemas"
import { Property, PropertyType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { usePropertyImages } from "@/hooks/properties/use-property-images"
import { useFieldImageUpload } from "@/hooks/form/use-field-image-upload"

interface PropertyFormProps {
	initialData?: Partial<Property>
	onSubmit: (data: PropertyFormData) => void
	isLoading?: boolean
}

export function PropertyForm({
	initialData = {},
	onSubmit,
	isLoading = false,
}: PropertyFormProps) {
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

	const { uploadMultipleImages, deleteMultipleImages, isUploading: isUploadingImages } = usePropertyImages()
	const imageUpload = useFieldImageUpload({
		maxFiles: 10,
		accept: "image/*",
		maxSize: 5 * 1024 * 1024, // 5MB
		onUpload: async (files) => {
			try {
				const results = await uploadMultipleImages(files)
				setValue('images', [...watch('images'), ...results.map(r => r.url)])
			} catch (error) {
				console.error("Failed to upload images:", error)
			}
		}
	})

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
						{...register("price", {
							valueAsNumber: true,
						})}
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
							{Object.values(PropertyType).map((type) => (
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
						{...register("yearBuilt", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.yearBuilt && (
						<p className="text-red-500 text-sm mt-1">{errors.yearBuilt.message}</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">Bedrooms</label>
					<Input
						type="number"
						{...register("bedrooms", {
							valueAsNumber: true,
						})}
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
						{...register("bathrooms", {
							valueAsNumber: true,
						})}
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
						{...register("squareFootage", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.squareFootage && (
						<p className="text-red-500 text-sm mt-1">{errors.squareFootage.message}</p>
					)}
				</div>
			</div>

			{/* Image upload section */}
			<div className="space-y-4">
				<label className="text-sm font-medium">Property Images</label>
				<div {...imageUpload.getDropZoneProps()} className="border-2 border-dashed rounded-lg p-4">
					<input {...imageUpload.getInputProps()} />
					<div className="text-center">
						{imageUpload.isDragging ? (
							<p>Drop the files here ...</p>
						) : (
							<p>Drag 'n' drop images here, or click to select files</p>
						)}
					</div>
				</div>

				{/* Image previews */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{imageUpload.previews.map((preview, index) => (
						<div key={preview} className="relative aspect-square">
							<img
								src={preview}
								alt={`Preview ${index + 1}`}
								className="w-full h-full object-cover rounded-lg"
							/>
							<button
								type="button"
								onClick={() => imageUpload.removeFile(index)}
								className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
							>
								×
							</button>
						</div>
					))}
				</div>
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
