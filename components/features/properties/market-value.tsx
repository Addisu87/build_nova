"use client"

import { Property } from "@/types/properties"
import { TrendingUp } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface MarketValueProps {
	property: Property
}

export function MarketValue({
	property,
}: MarketValueProps) {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-2xl font-semibold mb-6">
				Market Value & History
			</h2>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-medium">
							Estimated Market Value
						</h3>
						<p className="text-3xl font-bold text-blue-600">
							{formatPrice(property.price)}
						</p>
					</div>
					<TrendingUp className="h-8 w-8 text-blue-600" />
				</div>

				<div>
					<h3 className="text-lg font-medium mb-4">
						Price History
					</h3>
					<div className="space-y-3">
						{[
							{
								date: "01/2023",
								price: property.price * 0.95,
							},
							{
								date: "01/2022",
								price: property.price * 0.85,
							},
							{
								date: "01/2021",
								price: property.price * 0.75,
							},
						].map((history, index) => (
							<div
								key={index}
								className="flex justify-between items-center"
							>
								<span className="text-gray-600">
									{history.date}
								</span>
								<span className="font-medium">
									{formatPrice(history.price)}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
