"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Property } from "@/types"

interface MonthlyPaymentProps {
	property: Property
}

export function MonthlyPayment({ property }: MonthlyPaymentProps) {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-2xl font-semibold mb-6">Monthly Payment</h2>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-lg">Estimated payment</h3>
					<p className="text-2xl font-bold text-blue-600">$4,250/mo</p>
				</div>

				<Tabs defaultValue="purchase" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="purchase" className="flex-1">
							Purchase
						</TabsTrigger>
						<TabsTrigger value="rent" className="flex-1">
							Rent
						</TabsTrigger>
					</TabsList>
					<TabsContent value="purchase">
						<div className="space-y-4 mt-4">
							<div className="flex justify-between">
								<span>Principal & Interest</span>
								<span>$3,250/mo</span>
							</div>
							<div className="flex justify-between">
								<span>Property Taxes</span>
								<span>$650/mo</span>
							</div>
							<div className="flex justify-between">
								<span>Home Insurance</span>
								<span>$350/mo</span>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				<Button className="w-full">Calculate with down payment</Button>
			</div>
		</section>
	)
}
