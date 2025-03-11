import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui"

export default function PropertyNotFound() {
	return (
		<div className="container mx-auto py-16 text-center">
			<h1 className="text-4xl font-bold mb-4">
				Property Not Found
			</h1>
			<p className="text-gray-600 mb-8">
				Sorry, we couldn't find the property
				you're looking for.
			</p>
			<Link href="/">
				<Button>
					<Home className="mr-2 h-4 w-4" />
					Back to Home
				</Button>
			</Link>
		</div>
	)
}
