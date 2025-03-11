import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
	cloud_name:
		process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File) {
	const formData = new FormData()
	formData.append("file", file)
	formData.append(
		"upload_preset",
		"nova_properties",
	)

	const response = await fetch(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
		{
			method: "POST",
			body: formData,
		},
	)

	if (!response.ok) {
		throw new Error("Failed to upload image")
	}

	const data = await response.json()
	return data.secure_url
}

export async function deleteImage(
	publicId: string,
) {
	try {
		await cloudinary.uploader.destroy(publicId)
	} catch (error) {
		console.error("Error deleting image:", error)
		throw error
	}
}

export function getImageUrl(
	publicId: string,
	options: {
		width?: number
		height?: number
		crop?: string
		quality?: number
	} = {},
) {
	const {
		width,
		height,
		crop = "fill",
		quality = "auto",
	} = options
	const transformations = [
		width && `w_${width}`,
		height && `h_${height}`,
		`c_${crop}`,
		`q_${quality}`,
	]
		.filter(Boolean)
		.join(",")

	return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}
