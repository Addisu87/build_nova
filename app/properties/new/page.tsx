"use client"

import { usePropertyForm } from "@/hooks/properties/use-property-form"
import { PropertyForm } from "@/components/properties/property-form"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function NewPropertyPage() {
	const { isLoading } = usePropertyForm()

	if (isLoading) {
		return (
			<main className="container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
					className="space-y-8"
				>
					<Skeleton className="h-8 w-48" />
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</motion.div>
			</main>
		)
	}

	return (
		<main className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="space-y-8"
			>
				<h1 className="text-4xl font-bold">
					Add New Property
				</h1>
				<PropertyForm />
			</motion.div>
		</main>
	)
}
