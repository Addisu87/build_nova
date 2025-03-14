"use client"

import { PropertiesGrid } from "@/components/features/properties"
import { Hero } from "@/components/features/hero"

export default function HomePage() {
	return (
		<main className="container mx-auto px-4 py-8">
			<section className="mb-12">
				<Hero />
			</section>

			<section>
				<h2 className="mb-6 text-2xl font-semibold">
					Latest Properties
				</h2>
				<PropertiesGrid />
			</section>
		</main>
	)
}
