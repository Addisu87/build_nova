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

export function PropertySpecifications({ property }: PropertySpecificationsProps) {
	const specifications = [
		{
			label: "Property Type",
			value: property.propertyType,
		},
		{
			label: "Year Built",
			value: property.yearBuilt,
		},
		{
			label: "Square Footage",
			value: `${property.area?.toLocaleString()} sqft`,
		},
		{
			label: "Lot Size",
			value: property.lotSize ? `${property.lotSize.toLocaleString()} sqft` : "N/A",
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
			value: property.parkingSpaces || "N/A",
		},
		{
			label: "Stories",
			value: property.stories || "N/A",
		},
		{
			label: "Outdoor Space",
			value: property.outdoorSpace || "N/A",
		},
		{ label: "Status", value: property.status },
	]

	return (
		<Card className="p-6">
			<h2 className="text-2xl font-semibold mb-6">Property Specifications</h2>
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
							<TableCell className="font-medium">{spec.label}</TableCell>
							<TableCell className="capitalize">{spec.value}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	)
}
