import { Skeleton } from "./skeleton"

interface LoadingStateProps {
	type?:
		| "default"
		| "profile"
		| "property"
		| "properties"
		| "hero"
		| "map"
	className?: string
	height?: string
}

export function LoadingState({
	type = "default",
	className,
	height = "h-[300px]",
}: LoadingStateProps) {
	if (type === "map") {
		return (
			<div className="w-full rounded-lg overflow-hidden">
				<Skeleton
					className={
						className || "h-[600px] w-full"
					}
				/>
			</div>
		)
	}

	if (type === "hero") {
		return (
			<div className="relative animate-pulse">
				<div className="min-h-[50vh] md:min-h-[75vh] bg-gray-300 w-full"></div>
				<div className="absolute inset-0 bg-gradient-to-r from-gray-700/70 to-gray-500/20 pointer-events-none" />
				<div className="absolute inset-0 container mx-auto px-4">
					<div className="h-full flex flex-col justify-center max-w-2xl">
						<div className="mb-8 space-y-4">
							<div className="h-10 md:h-12 lg:h-14 bg-gray-400 rounded w-3/4"></div>
							<div className="h-8 md:h-10 lg:h-12 bg-gray-400 rounded w-1/2"></div>
							<div className="h-6 md:h-7 bg-gray-400 rounded w-full"></div>
						</div>
						<div className="w-full max-w-xl h-14 bg-gray-400 rounded-md"></div>
					</div>
				</div>
			</div>
		)
	}

	if (type === "profile") {
		return (
			<div className="space-y-8">
				<Skeleton className="h-8 w-48" />
				<div className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		)
	}

	if (type === "property") {
		return (
			<div className="space-y-8">
				<Skeleton className="h-[400px] w-full rounded-lg" />
				<div className="grid gap-8 md:grid-cols-3">
					<div className="md:col-span-2 space-y-8">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				</div>
			</div>
		)
	}

	if (type === "properties") {
		return (
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="rounded-lg overflow-hidden"
					>
						<Skeleton className="h-48 w-full" />
						<div className="p-4 space-y-3">
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="h-4 w-1/2" />
							<div className="flex gap-4">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-16" />
							</div>
							<div className="pt-4 flex justify-between items-center">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-8 w-8 rounded-full" />
							</div>
						</div>
					</div>
				))}
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
