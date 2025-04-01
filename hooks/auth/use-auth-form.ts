import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ZodSchema } from "zod"

interface UseAuthFormOptions<T extends Record<string, any>> {
	schema: ZodSchema<T>
	onSubmit: (data: T) => Promise<void>
	onSuccess?: () => void
	onError?: (error: Error) => void
}

type FieldErrors<T> = {
	[K in keyof T]?: string
} & {
	form?: string
}

export function useAuthForm<T extends Record<string, any>>({
	schema,
	onSubmit,
	onSuccess,
	onError,
}: UseAuthFormOptions<T>) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

	const {
		register,
		handleSubmit: rhfHandleSubmit,
		formState: { errors: formErrors, isSubmitting },
	} = useForm<T>({
		resolver: zodResolver(schema),
		mode: "onChange",
	})

	const handleSubmit = rhfHandleSubmit(async (data) => {
		setServerErrors({})
		setIsLoading(true)

		try {
			await onSubmit(data)
			onSuccess?.()
		} catch (error) {
			if (error instanceof Error) {
				setServerErrors({ form: error.message })
				onError?.(error)

				toast.error(error.message)
			} else {
				const genericError = new Error("An unexpected error occurred")
				setServerErrors({ form: genericError.message })
				onError?.(genericError)

				toast.error("An error occurred. Please try again.")
			}
		} finally {
			setTimeout(() => {
				setIsLoading(false)
			}, 0)
		}
	})

	// Combine Zod validation errors with server-side errors
	const allErrors: FieldErrors<T> = {
		...Object.keys(formErrors).reduce(
			(acc, key) => ({
				...acc,
				[key]: formErrors[key]?.message || "",
			}),
			{} as FieldErrors<T>,
		),
		...serverErrors,
	}

	return {
		handleSubmit,
		register,
		isLoading: isLoading || isSubmitting,
		errors: allErrors,
		setErrors: setServerErrors,
	}
}
