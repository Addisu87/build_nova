import { supabase } from "@/lib/supabase/client"
import imageCompression from "browser-image-compression"
import { v4 as uuidv4 } from "uuid"

interface ImageUploadProps {
	url: string
	path: string
}

export const uploadImage = async (
	file: File,
	folderPath: string,
	options?: {
		maxSizeMB?: number
		skipCompression?: boolean
	},
): Promise<ImageUploadProps> => {
	const fileToUpload = options?.skipCompression
		? file
		: await compressImage(file, options?.maxSizeMB || 1)

	const cleanPath = folderPath.replace(/^\/+|\/+$/g, "")
	const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
	const fileName = `${uuidv4()}.${fileExt}`
	const filePath = `${cleanPath}/${fileName}`

	const { data, error } = await supabase.storage
		.from("images")
		.upload(filePath, fileToUpload)

	if (error) throw error

	const {
		data: { publicUrl },
	} = supabase.storage.from("images").getPublicUrl(filePath)

	return { url: publicUrl, path: filePath }
}

export const deleteImage = async (path: string): Promise<void> => {
	const { error } = await supabase.storage.from("images").remove([path])

	if (error) throw error
}

export const listImages = async (folderPath: string): Promise<ImageUploadProps[]> => {
	const { data, error } = await supabase.storage.from("images").list(folderPath)

	if (error) throw error

	return data.map((file) => ({
		path: `${folderPath}/${file.name}`,
		url: supabase.storage.from("images").getPublicUrl(`${folderPath}/${file.name}`).data
			.publicUrl,
	}))
}

const compressImage = async (file: File, maxSizeMB: number): Promise<File> => {
	try {
		return await imageCompression(file, {
			maxSizeMB,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
			preserveExif: false,
		})
	} catch {
		return file // Fallback to original if compression fails
	}
}
