"use client"

import { PropertyListing } from "@/components/features/properties/property-listing"
import { PropertyMap } from "@/components/features/properties/property-map"
import { PropertyFilters } from "@/components/features/properties/property-filters"
import { usePropertyManager } from "@/hooks/properties/use-property-manager"
import { useSearchParams } from "next/navigation"

export default function BrowseAllHomesPage() {
	const searchParams = useSearchParams()
	const { properties, updateFilters } = usePropertyManager({
		listingType: "buy",
	})

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8">Homes For Sale</h1>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Filters */}
					<aside className="lg:w-1/4">
						<PropertyFilters />
					</aside>

					<div className="lg:w-3/4 space-y-8">
						{/* Map */}
						<section className="h-[400px] rounded-lg overflow-hidden">
							<PropertyMap properties={properties || []} />
						</section>

						{/* Listings */}
						<section>
							<PropertyListing
								title="Available Properties"
								initialProperties={properties || []}
							/>
						</section>
					</div>
				</div>
			</main>
		</div>
	)
}
