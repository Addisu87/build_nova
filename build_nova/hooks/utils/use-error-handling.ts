import {
	useState,
	useCallback,
	useEffect,
} from "react"
import { toast } from "react-hot-toast"

interface ErrorState {
	message: string
	code?: string
	details?: any
	timestamp: number
}

interface ErrorConfig {
	showToast?: boolean
	toastDuration?: number
	maxErrors?: number
	autoClear?: boolean
	autoClearDelay?: number
}

const DEFAULT_CONFIG: ErrorConfig = {
	showToast: true,
	toastDuration: 5000,
	maxErrors: 10,
	autoClear: true,
	autoClearDelay: 5 * 60 * 1000, // 5 minutes
}

export function useErrorHandling(
	config: Partial<ErrorConfig> = {},
) {
	const [errors, setErrors] = useState<
		ErrorState[]
	>([])
	const [isLoading, setIsLoading] =
		useState(false)
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}

	const handleError = useCallback(
		(
			error: Error | unknown,
			context?: string,
		) => {
			try {
				setIsLoading(true)
				const errorState: ErrorState = {
					message:
						error instanceof Error
							? error.message
							: "An unknown error occurred",
					code: (error as any)?.code,
					details: error,
					timestamp: Date.now(),
				}

				if (context) {
					errorState.message = `${context}: ${errorState.message}`
				}

				setErrors((prevErrors) => {
					const newErrors = [
						errorState,
						...prevErrors,
					].slice(0, finalConfig.maxErrors)
					return newErrors
				})

				if (finalConfig.showToast) {
					toast.error(errorState.message, {
						duration: finalConfig.toastDuration,
						position: "top-right",
					})
				}
			} catch (err) {
				console.error(
					"Failed to handle error:",
					err,
				)
			} finally {
				setIsLoading(false)
			}
		},
		[finalConfig],
	)

	const clearError = useCallback(
		(timestamp: number) => {
			setErrors((prevErrors) =>
				prevErrors.filter(
					(error) =>
						error.timestamp !== timestamp,
				),
			)
		},
		[],
	)

	const clearAllErrors = useCallback(() => {
		setErrors([])
	}, [])

	const clearExpiredErrors = useCallback(() => {
		const now = Date.now()
		setErrors((prevErrors) =>
			prevErrors.filter(
				(error) =>
					now - error.timestamp <
					finalConfig.autoClearDelay,
			),
		)
	}, [finalConfig.autoClearDelay])

	useEffect(() => {
		if (!finalConfig.autoClear) {
			return
		}

		const interval = setInterval(
			clearExpiredErrors,
			finalConfig.autoClearDelay,
		)
		return () => clearInterval(interval)
	}, [
		finalConfig.autoClear,
		finalConfig.autoClearDelay,
		clearExpiredErrors,
	])

	const getErrorsByCode = useCallback(
		(code: string) => {
			return errors.filter(
				(error) => error.code === code,
			)
		},
		[errors],
	)

	const getRecentErrors = useCallback(
		(limit: number = finalConfig.maxErrors) => {
			return errors.slice(0, limit)
		},
		[errors, finalConfig.maxErrors],
	)

	const getErrorCount = useCallback(() => {
		return errors.length
	}, [errors])

	const hasErrors = useCallback(() => {
		return errors.length > 0
	}, [errors])

	const getLatestError = useCallback(() => {
		return errors[0]
	}, [errors])

	return {
		errors,
		isLoading,
		handleError,
		clearError,
		clearAllErrors,
		getErrorsByCode,
		getRecentErrors,
		getErrorCount,
		hasErrors,
		getLatestError,
	}
}
