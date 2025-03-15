"use client"

import { Progress } from "@/components/ui/progress"

export function ClimateRisks() {
	return (
		<section className="bg-white rounded-lg shadow-sm p-6">
			<h2 className="text-2xl font-semibold mb-6">
				Climate Risks
			</h2>
			<div className="space-y-4">
				{[
					{ risk: "Flood", level: 65 },
					{ risk: "Fire", level: 25 },
					{ risk: "Storm", level: 45 },
				].map((risk, index) => (
					<div key={index} className="space-y-2">
						<div className="flex justify-between">
							<span>{risk.risk} Risk</span>
							<span className="font-medium">
								{risk.level}%
							</span>
						</div>
						<Progress value={risk.level} />
					</div>
				))}
			</div>
		</section>
	)
}
