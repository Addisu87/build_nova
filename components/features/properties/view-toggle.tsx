"use client"

import { Grid2X2, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
	view: "grid" | "map"
	onChange: (view: "grid" | "map") => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
	return (
		<div className="flex items-center gap-1 rounded-md border p-1">
			<Button
				variant={view === "grid" ? "secondary" : "ghost"}
				size="sm"
				onClick={() => onChange("grid")}
			>
				<Grid2X2 className="mr-2 h-4 w-4" />
				Grid
			</Button>
			<Button
				variant={view === "map" ? "secondary" : "ghost"}
				size="sm"
				onClick={() => onChange("map")}
			>
				<Map className="mr-2 h-4 w-4" />
				Map
			</Button>
		</div>
	)
}
