"use client"

import { PropertyListing } from "@/components/features/properties/property-listing"
import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertyFilters } from "@/components/features/properties/property-filters"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"

export default function NewConstructionPage() {
	const { properties, updateFilters } = usePropertyManager({
		listingType: "buy",
		filters: {
			isNewConstruction: true,
		},
	})

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8">New Construction Homes</h1>

				<div className="flex flex-col lg:flex-row gap-8">
					<aside className="lg:w-1/4">
						<PropertyFilters />
					</aside>

					<div className="lg:w-3/4 space-y-8">
						<section className="h-[400px] rounded-lg overflow-hidden">
							<PropertyMap properties={properties || []} />
						</section>

						<section>
							<PropertyListing
								title="New Construction"
								initialProperties={properties || []}
							/>
						</section>
					</div>
				</div>
			</main>
		</div>
	)
}
