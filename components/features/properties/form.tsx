"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Property,
	PropertyType,
} from "@/types/properties"
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
import {
	propertySchema,
	PropertyFormData,
} from "@/lib/properties/property-schemas"

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
			squareFootage: 0,
			propertyType: PropertyType.HOUSE,
			yearBuilt: new Date().getFullYear(),
			...initialData,
		},
	})

	const propertyTypeValue = watch("propertyType")

	const onSubmitForm = (
		data: PropertyFormData,
	) => {
		onSubmit(data)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmitForm)}
			className="space-y-6"
		>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<label className="text-sm font-medium">
						Title
					</label>
					<Input
						{...register("title")}
						className="mt-1"
					/>
					{errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{errors.title.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Price
					</label>
					<Input
						type="number"
						{...register("price", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.price && (
						<p className="text-red-500 text-sm mt-1">
							{errors.price.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Property Type
					</label>
					<Select
						value={propertyTypeValue?.toLowerCase()}
						onValueChange={(value) =>
							setValue(
								"propertyType",
								value.toUpperCase() as PropertyType,
							)
						}
					>
						<SelectTrigger className="mt-1">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							{Object.values(PropertyType).map(
								(type) => (
									<SelectItem
										key={type}
										value={type.toLowerCase()}
									>
										{type}
									</SelectItem>
								),
							)}
						</SelectContent>
					</Select>
					{errors.propertyType && (
						<p className="text-red-500 text-sm mt-1">
							{errors.propertyType.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Year Built
					</label>
					<Input
						type="number"
						{...register("yearBuilt", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.yearBuilt && (
						<p className="text-red-500 text-sm mt-1">
							{errors.yearBuilt.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Bedrooms
					</label>
					<Input
						type="number"
						{...register("bedrooms", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.bedrooms && (
						<p className="text-red-500 text-sm mt-1">
							{errors.bedrooms.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Bathrooms
					</label>
					<Input
						type="number"
						{...register("bathrooms", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.bathrooms && (
						<p className="text-red-500 text-sm mt-1">
							{errors.bathrooms.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">
						Square Feet
					</label>
					<Input
						type="number"
						{...register("squareFootage", {
							valueAsNumber: true,
						})}
						className="mt-1"
					/>
					{errors.squareFootage && (
						<p className="text-red-500 text-sm mt-1">
							{errors.squareFootage.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<label className="text-sm font-medium">
					Description
				</label>
				<Textarea
					{...register("description")}
					className="mt-1"
					rows={4}
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">
						{errors.description.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isLoading}
				className="w-full"
			>
				{isLoading
					? "Saving..."
					: "Save Property"}
			</Button>
		</form>
	)
}
