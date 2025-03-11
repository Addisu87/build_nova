export default function PropertyDetailsLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="animate-pulse">
				<div className="h-8 w-1/2 bg-gray-200 rounded"></div>

				<div className="mt-8 grid gap-8 lg:grid-cols-2">
					<div>
						<div className="aspect-video bg-gray-200 rounded-lg"></div>
						<div className="mt-8 space-y-4">
							<div className="h-6 w-1/4 bg-gray-200 rounded"></div>
							<div className="space-y-2">
								<div className="h-4 w-full bg-gray-200 rounded"></div>
								<div className="h-4 w-3/4 bg-gray-200 rounded"></div>
								<div className="h-4 w-5/6 bg-gray-200 rounded"></div>
							</div>
						</div>
					</div>

					<div className="space-y-8">
						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
							<div className="grid grid-cols-2 gap-4">
								{Array.from({ length: 6 }).map(
									(_, i) => (
										<div key={i}>
											<div className="h-4 w-1/2 bg-gray-200 rounded"></div>
											<div className="mt-1 h-5 w-3/4 bg-gray-200 rounded"></div>
										</div>
									),
								)}
							</div>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm">
							<div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
							<div className="h-[300px] bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
