import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui"

interface NotFoundProps {
	title?: string
	description?: string
	buttonText?: string
	buttonHref?: string
}

export function NotFound({
	title = "Not Found",
	description = "Sorry, we couldn't find what you're looking for.",
	buttonText = "Back to Home",
	buttonHref = "/",
}: NotFoundProps) {
	return (
		<div className="container mx-auto py-16 text-center">
			<h1 className="text-4xl font-bold mb-4">{title}</h1>
			<p className="text-gray-600 mb-8">{description}</p>
			<Link href={buttonHref}>
				<Button>
					<Home className="mr-2 h-4 w-4" />
					{buttonText}
				</Button>
			</Link>
		</div>
	)
}
