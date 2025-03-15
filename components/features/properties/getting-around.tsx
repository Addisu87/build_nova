"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GettingAround() {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-2xl font-semibold mb-6">
				Getting Around
			</h2>
			<div className="grid grid-cols-2 gap-4">
				{[
					{ name: "Public Transit", score: 85 },
					{ name: "Walking Score", score: 92 },
					{ name: "Biking Score", score: 78 },
					{ name: "Driving Score", score: 95 },
				].map((transport, index) => (
					<Card key={index} className="p-4">
						<h3 className="font-medium mb-2">
							{transport.name}
						</h3>
						<div className="flex items-center gap-2">
							<Progress
								value={transport.score}
								className="flex-1"
							/>
							<span className="font-medium">
								{transport.score}
							</span>
						</div>
					</Card>
				))}
			</div>
		</section>
	)
}
