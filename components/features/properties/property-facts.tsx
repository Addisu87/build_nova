"use client"

import { Property } from "@/types";
import {
	Building2,
	Calendar,
	Car,
	Home,
	Ruler,
	Trees,
} from "lucide-react"

interface PropertyFactsProps {
	property: Property
}

export function PropertyFacts({
	property,
}: PropertyFactsProps) {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-2xl font-semibold mb-6">
				Facts & Features
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
				<DetailItem
					icon={Home}
					label="Type"
					value={property.property_type || "N/A"}
				/>
				<DetailItem
					icon={Calendar}
					label="Year Built"
					value={property.year_built || "N/A"}
				/>
				<DetailItem
					icon={Ruler}
					label="Lot Size"
					value={
						property.lot_size
							? `${property.lot_size.toLocaleString()} sqft`
							: "N/A"
					}
				/>
				<DetailItem
					icon={Car}
					label="Garage"
					value={
						property.garage
							? `${property.garage} cars`
							: "N/A"
					}
				/>
				<DetailItem
					icon={Building2}
					label="Stories"
					value={property.stories || "N/A"}
				/>
				<DetailItem
					icon={Trees}
					label="Outdoor Space"
					value={property.outdoorSpace || "N/A"}
				/>
			</div>
		</section>
	)
}

interface DetailItemProps {
	icon: any
	label: string
	value: string | number
}

function DetailItem({
	icon: Icon,
	label,
	value,
}: DetailItemProps) {
	return (
		<div className="flex items-center gap-3">
			<Icon className="h-5 w-5 text-blue-600" />
			<div>
				<p className="text-sm text-gray-500">
					{label}
				</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	)
}
