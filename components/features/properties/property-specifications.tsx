"use client"

import { Card } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Property } from "@/types"

interface PropertySpecificationsProps {
	property: Property
}

export function PropertySpecifications({
	property,
}: PropertySpecificationsProps) {
	const specifications = [
		{
			label: "Property Type",
			value: property.property_type,
		},
		{
			label: "Year Built",
			value: property.year_built,
		},
		{
			label: "Square Footage",
			value: `${property.square_feet?.toLocaleString()} sqft`,
		},
		{
			label: "Lot Size",
			value: property.lot_size
				? `${property.lot_size.toLocaleString()} sqft`
				: "N/A",
		},
		{
			label: "Bedrooms",
			value: property.bedrooms,
		},
		{
			label: "Bathrooms",
			value: property.bathrooms,
		},
		{
			label: "Parking Spaces",
			value: property.parking_spaces || "N/A",
		},

		{ label: "Status", value: property.status },
	]

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-semibold mb-6">
				Property Specifications
			</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Feature</TableHead>
						<TableHead>Specification</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{specifications.map((spec) => (
						<TableRow key={spec.label}>
							<TableCell className="font-medium">
								{spec.label}
							</TableCell>
							<TableCell className="capitalize">
								{spec.value}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	)
}
