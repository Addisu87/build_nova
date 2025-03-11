import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/sonner"
import { ZodSchema } from "zod"

interface UseAuthFormOptions<T> {
	schema: ZodSchema<T>
	onSubmit: (data: T) => Promise<void>
	onSuccess?: () => void
	onError?: (error: Error) => void
}

export function useAuthForm<T>({
	schema,
	onSubmit,
	onSuccess,
	onError,
}: UseAuthFormOptions<T>) {
	const router = useRouter()
	const [isLoading, setIsLoading] =
		useState(false)
	const [errors, setErrors] = useState<
		Record<string, string>
	>({})

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault()
		setErrors({})
		setIsLoading(true)

		try {
			const formData = new FormData(
				e.currentTarget,
			)
			const data = Object.fromEntries(
				formData.entries(),
			)

			// Validate form data
			const validatedData = schema.parse(data)

			// Submit form
			await onSubmit(validatedData as T)

			// Handle success
			onSuccess?.()
		} catch (error) {
			if (error instanceof Error) {
				setErrors({ form: error.message })
				onError?.(error)
			} else if (error.errors) {
				// Handle Zod validation errors
				const zodErrors: Record<string, string> =
					{}
				error.errors.forEach((err: any) => {
					zodErrors[err.path[0]] = err.message
				})
				setErrors(zodErrors)
			} else {
				const genericError = new Error(
					"An unexpected error occurred",
				)
				setErrors({ form: genericError.message })
				onError?.(genericError)
			}

			// Show error toast
			toast({
				title: "Error",
				description:
					errors.form ||
					"An error occurred. Please try again.",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return {
		handleSubmit,
		isLoading,
		errors,
		setErrors,
	}
}
