import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

interface LoadingStateProps {
	type?:
		| "default"
		| "profile"
		| "property"
		| "properties"
		| "hero"
		| "map"
		| "imageUpload"
	className?: string
	height?: string
}

export function LoadingState({
	type = "default",
	className,
	height = "h-[300px]",
}: LoadingStateProps) {
	// Helper function for repeated patterns
	const createImageGrid = (count: number, aspectRatio = "aspect-video") => (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton key={i} className={cn(aspectRatio, "rounded-lg")} />
			))}
		</div>
	)

	if (type === "imageUpload") {
		return (
			<div className="space-y-8">
				{/* Header skeleton */}
				<div className="flex items-center justify-between">
					<Skeleton className="h-9 w-48" /> {/* Admin Dashboard text */}
					<Skeleton className="h-5 w-64" /> {/* Logged in as text */}
				</div>

				<div className="grid gap-6">
					<div className="p-6 border rounded-lg space-y-6">
						{/* Section title */}
						<Skeleton className="h-7 w-40" /> {/* Image Management text */}
						{/* Property type selector */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-24" /> {/* Label */}
							<Skeleton className="h-10 w-full rounded-md" /> {/* Select input */}
						</div>
						{/* Upload section */}
						<div className="p-4 space-y-4 border rounded-lg">
							{/* Upload path text */}
							<Skeleton className="h-5 w-48" />

							{/* File input */}
							<div className="space-y-2">
								<Skeleton className="h-5 w-24" /> {/* Label */}
								<Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
								<Skeleton className="h-4 w-96" /> {/* Helper text */}
							</div>

							{/* Preview grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} className="aspect-square rounded-lg" />
								))}
							</div>

							{/* Upload button */}
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (type === "map") {
		return (
			<div className="w-full rounded-lg overflow-hidden">
				<Skeleton className={className || "h-[600px] w-full"} />
			</div>
		)
	}

	if (type === "hero") {
		return (
			<div className="relative w-full">
				<div className="h-[600px] bg-gray-200 dark:bg-gray-800 w-full animate-pulse">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50" />
				</div>
				<div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-700/20" />
				<div className="absolute inset-0 container mx-auto px-4">
					<div className="h-full flex flex-col justify-center max-w-2xl">
						<div className="mb-8 space-y-4">
							<Skeleton className="h-14 md:h-16 lg:h-20 w-3/4" />
							<Skeleton className="h-6 md:h-8 w-full" />
							<Skeleton className="h-6 md:h-8 w-2/3" />
						</div>
						<div className="w-full max-w-xl">
							<Skeleton className="h-14 w-full rounded-xl" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (type === "property") {
		return (
			<div className="space-y-8">
				{/* Image Gallery Loading State */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[600px]">
					{/* Main large image skeleton */}
					<div className="md:col-span-2 relative h-full">
						<Skeleton className="h-full w-full rounded-lg" />
					</div>

					{/* Thumbnails grid */}
					<div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={i} className="h-[295px] rounded-lg" />
						))}
					</div>
				</div>

				{/* Content grid */}
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main content - 2 columns */}
					<div className="lg:col-span-2 space-y-8">
						<div className="space-y-4">
							<Skeleton className="h-10 w-3/4" />
							<Skeleton className="h-6 w-1/3" />
						</div>

						<div className="space-y-3">
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-full" />
							<Skeleton className="h-5 w-2/3" />
						</div>

						{/* Specifications */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-6 w-24" />
								</div>
							))}
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<div className="rounded-xl border p-6 space-y-4">
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-32 w-full" />
						</div>
						<div className="rounded-xl border p-6 space-y-4">
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-[200px] w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (type === "properties") {
		return (
			<div className="container mx-auto">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
						>
							<Skeleton className="aspect-[16/10] w-full" />
							<div className="p-6 space-y-4">
								<div className="space-y-2">
									<Skeleton className="h-7 w-full" />
									<Skeleton className="h-6 w-2/3" />
								</div>
								<div className="flex gap-4">
									{Array.from({ length: 3 }).map((_, j) => (
										<Skeleton key={j} className="h-5 w-20" />
									))}
								</div>
								<div className="pt-2 flex justify-between items-center">
									<Skeleton className="h-8 w-36" />
									<Skeleton className="h-10 w-10 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		)
	}

	if (type === "profile") {
		return (
			<div className="space-y-8">
				<div className="space-y-4">
					<Skeleton className="h-20 w-20 rounded-full" />
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="space-y-4">
					<Skeleton className="h-10 w-full max-w-md" />
					<Skeleton className="h-10 w-full max-w-md" />
					<Skeleton className="h-32 w-full max-w-md" />
				</div>
			</div>
		)
	}

	// Default loading state
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-2/3" />
		</div>
	)
}
