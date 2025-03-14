import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Twitter,
} from "lucide-react"
import Link from "next/link"

const Footer = () => {
	return (
		<footer className="bg-white border-t">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					{/* Brand and Description */}
					<div className="space-y-8 xl:col-span-1">
						<Link
							href="/"
							className="flex items-center space-x-2"
						>
							<span className="text-2xl font-bold text-primary">
								Nova
							</span>
						</Link>
						<p className="text-base text-gray-500">
							Making property search easier and
							more accessible for everyone.
						</p>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">
									Facebook
								</span>
								<Facebook className="h-6 w-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">
									Instagram
								</span>
								<Instagram className="h-6 w-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">
									Twitter
								</span>
								<Twitter className="h-6 w-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">
									GitHub
								</span>
								<Github className="h-6 w-6" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-500"
							>
								<span className="sr-only">
									LinkedIn
								</span>
								<Linkedin className="h-6 w-6" />
							</a>
						</div>
					</div>

					{/* Navigation */}
					<div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-gray-900">
									Solutions
								</h3>
								<ul className="mt-4 space-y-4">
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Buy
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Rent
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Sell
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Mortgage
										</Link>
									</li>
								</ul>
							</div>
							<div className="mt-12 md:mt-0">
								<h3 className="text-sm font-semibold text-gray-900">
									Support
								</h3>
								<ul className="mt-4 space-y-4">
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Help Center
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Contact Us
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Privacy
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Terms
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-gray-900">
									Company
								</h3>
								<ul className="mt-4 space-y-4">
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											About
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Blog
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Careers
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Press
										</Link>
									</li>
								</ul>
							</div>
							<div className="mt-12 md:mt-0">
								<h3 className="text-sm font-semibold text-gray-900">
									Legal
								</h3>
								<ul className="mt-4 space-y-4">
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Privacy Policy
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Terms of Service
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="text-base text-gray-500 hover:text-gray-900"
										>
											Cookie Policy
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 border-t border-gray-200 pt-8">
					<p className="text-base text-gray-400 xl:text-center">
						© {new Date().getFullYear()} Nova. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
