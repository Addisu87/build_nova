import { useState, useCallback } from "react"
import { toast } from "react-hot-toast"

interface SubmissionState<T> {
	isSubmitting: boolean
	isSuccess: boolean
	isError: boolean
	error: Error | null
	data: T | null
	timestamp: number | null
}

interface SubmissionConfig<T> {
	onSubmit: (values: any) => Promise<T>
	onSuccess?: (data: T) => void
	onError?: (error: Error) => void
	successMessage?: string
	errorMessage?: string
	validateBeforeSubmit?: (
		values: any,
	) => boolean | Promise<boolean>
}

export function useFormSubmission<T>(
	config: SubmissionConfig<T>,
) {
	const [state, setState] = useState<
		SubmissionState<T>
	>({
		isSubmitting: false,
		isSuccess: false,
		isError: false,
		error: null,
		data: null,
		timestamp: null,
	})

	const handleSubmit = useCallback(
		async (values: any) => {
			try {
				setState((prevState) => ({
					...prevState,
					isSubmitting: true,
					isSuccess: false,
					isError: false,
					error: null,
					data: null,
				}))

				// Validate before submission if configured
				if (config.validateBeforeSubmit) {
					const isValid =
						await config.validateBeforeSubmit(
							values,
						)
					if (!isValid) {
						throw new Error("Validation failed")
					}
				}

				// Submit the form
				const data = await config.onSubmit(values)

				setState((prevState) => ({
					...prevState,
					isSubmitting: false,
					isSuccess: true,
					isError: false,
					error: null,
					data,
					timestamp: Date.now(),
				}))

				// Show success message
				if (config.successMessage) {
					toast.success(config.successMessage)
				}

				// Call success callback
				config.onSuccess?.(data)
			} catch (error) {
				const err =
					error instanceof Error
						? error
						: new Error("Submission failed")

				setState((prevState) => ({
					...prevState,
					isSubmitting: false,
					isSuccess: false,
					isError: true,
					error: err,
					data: null,
					timestamp: Date.now(),
				}))

				// Show error message
				if (config.errorMessage) {
					toast.error(config.errorMessage)
				}

				// Call error callback
				config.onError?.(err)
			}
		},
		[config],
	)

	const reset = useCallback(() => {
		setState({
			isSubmitting: false,
			isSuccess: false,
			isError: false,
			error: null,
			data: null,
			timestamp: null,
		})
	}, [])

	const retry = useCallback(
		async (values: any) => {
			if (!state.error) {
				return
			}

			await handleSubmit(values)
		},
		[state.error, handleSubmit],
	)

	const getSubmissionDuration =
		useCallback(() => {
			if (!state.timestamp) {
				return 0
			}
			return Date.now() - state.timestamp
		}, [state.timestamp])

	const isStale = useCallback(
		(maxAge: number = 5 * 60 * 1000) => {
			if (!state.timestamp) {
				return true
			}
			return Date.now() - state.timestamp > maxAge
		},
		[state.timestamp],
	)

	return {
		...state,
		handleSubmit,
		reset,
		retry,
		getSubmissionDuration,
		isStale,
	}
}
