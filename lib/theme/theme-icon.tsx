"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="h-4 w-4 p-0">
					<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")} className="pl-2">
					<Sun className="h-4 w-4 mr-2" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")} className="pl-2">
					<Moon className="h-4 w-4 mr-2" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")} className="pl-2">
					<Laptop className="h-4 w-4 mr-2" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
