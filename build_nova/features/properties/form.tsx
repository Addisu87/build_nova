"use client"

import { useState } from "react"
import { Property, PropertyType } from "./types"
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

interface PropertyFormProps {
	initialData?: Partial<Property>
	onSubmit: (data: Partial<Property>) => void
	isLoading?: boolean
}

export function PropertyForm({
	initialData = {},
	onSubmit,
	isLoading = false,
}: PropertyFormProps) {
	const [formData, setFormData] = useState<
		Partial<Property>
	>({
		title: "",
		description: "",
		price: 0,
		bedrooms: 0,
		bathrooms: 0,
		squareFeet: 0,
		propertyType: PropertyType.HOUSE,
		yearBuilt: new Date().getFullYear(),
		...initialData,
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formData)
	}

	const handleChange = (
		field: keyof Property,
		value: string | number,
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6"
		>
			<div className="grid gap-6 md:grid-cols-2">
				<div>
					<label className="text-sm font-medium">
						Title
					</label>
					<Input
						required
						value={formData.title}
						onChange={(e) =>
							handleChange(
								"title",
								e.target.value,
							)
						}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">
						Price
					</label>
					<Input
						type="number"
						required
						value={formData.price}
						onChange={(e) =>
							handleChange(
								"price",
								Number(e.target.value),
							)
						}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">
						Property Type
					</label>
					<Select
						value={formData.propertyType?.toLowerCase()}
						onValueChange={(value) =>
							handleChange(
								"propertyType",
								value.toUpperCase(),
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
				</div>

				<div>
					<label className="text-sm font-medium">
						Year Built
					</label>
					<Input
						type="number"
						required
						value={formData.yearBuilt}
						onChange={(e) =>
							handleChange(
								"yearBuilt",
								Number(e.target.value),
							)
						}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">
						Bedrooms
					</label>
					<Input
						type="number"
						required
						value={formData.bedrooms}
						onChange={(e) =>
							handleChange(
								"bedrooms",
								Number(e.target.value),
							)
						}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">
						Bathrooms
					</label>
					<Input
						type="number"
						required
						value={formData.bathrooms}
						onChange={(e) =>
							handleChange(
								"bathrooms",
								Number(e.target.value),
							)
						}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="text-sm font-medium">
						Square Feet
					</label>
					<Input
						type="number"
						required
						value={formData.squareFeet}
						onChange={(e) =>
							handleChange(
								"squareFeet",
								Number(e.target.value),
							)
						}
						className="mt-1"
					/>
				</div>
			</div>

			<div>
				<label className="text-sm font-medium">
					Description
				</label>
				<Textarea
					required
					value={formData.description}
					onChange={(e) =>
						handleChange(
							"description",
							e.target.value,
						)
					}
					className="mt-1"
					rows={4}
				/>
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
