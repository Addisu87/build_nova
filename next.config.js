/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sinvgquzrvfrusjtwzdf.supabase.co",
				pathname: "/**",
				port: "",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.cloudinary.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.githubusercontent.com",
				pathname: "/**",
			},
		],
		unoptimized: true, // This allows using local images in public folder
	},
}

module.exports = nextConfig
