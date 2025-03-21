/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.supabase.co',
				pathname: '/storage/v1/object/public/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '*.cloudinary.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '*.githubusercontent.com',
				pathname: '/**',
			}
		],
	},
}

module.exports = nextConfig
