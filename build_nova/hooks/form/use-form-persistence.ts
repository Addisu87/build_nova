import {
	useState,
	useCallback,
	useEffect,
} from "react"

interface PersistenceConfig<T> {
	key: string
	initialValues: T
	storage?: Storage
	debounceTime?: number
	maxAge?: number
	transform?: {
		serialize?: (values: T) => string
		deserialize?: (data: string) => T
	}
}

const DEFAULT_CONFIG: Partial<
	PersistenceConfig<any>
> = {
	storage:
		typeof window !== "undefined"
			? localStorage
			: undefined,
	debounceTime: 500,
	maxAge: 24 * 60 * 60 * 1000, // 24 hours
}

export function useFormPersistence<
	T extends Record<string, any>,
>(config: PersistenceConfig<T>) {
	const [state, setState] = useState<T>(
		config.initialValues,
	)
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}
	const timeoutRef = useRef<NodeJS.Timeout>()

	// Load persisted state on mount
	useEffect(() => {
		if (!finalConfig.storage) {
			return
		}

		try {
			const persistedData =
				finalConfig.storage.getItem(
					finalConfig.key,
				)
			if (persistedData) {
				const { values, timestamp } = JSON.parse(
					persistedData,
				)

				// Check if data is expired
				if (
					finalConfig.maxAge &&
					Date.now() - timestamp >
						finalConfig.maxAge
				) {
					finalConfig.storage.removeItem(
						finalConfig.key,
					)
					return
				}

				const parsedValues = finalConfig.transform
					?.deserialize
					? finalConfig.transform.deserialize(
							values,
					  )
					: values

				setState(parsedValues)
			}
		} catch (error) {
			console.error(
				"Failed to load persisted form state:",
				error,
			)
		}
	}, [finalConfig])

	// Save state changes
	useEffect(() => {
		if (!finalConfig.storage) {
			return
		}

		const saveState = () => {
			try {
				const serializedValues = finalConfig
					.transform?.serialize
					? finalConfig.transform.serialize(state)
					: state

				const data = {
					values: serializedValues,
					timestamp: Date.now(),
				}

				finalConfig.storage.setItem(
					finalConfig.key,
					JSON.stringify(data),
				)
			} catch (error) {
				console.error(
					"Failed to save form state:",
					error,
				)
			}
		}

		// Debounce save operation
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(
			saveState,
			finalConfig.debounceTime,
		)

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [state, finalConfig])

	const updateState = useCallback(
		(updates: Partial<T>) => {
			setState((prevState) => ({
				...prevState,
				...updates,
			}))
		},
		[],
	)

	const resetState = useCallback(() => {
		setState(config.initialValues)
		if (finalConfig.storage) {
			finalConfig.storage.removeItem(
				finalConfig.key,
			)
		}
	}, [config.initialValues, finalConfig])

	const clearExpiredState = useCallback(() => {
		if (
			!finalConfig.storage ||
			!finalConfig.maxAge
		) {
			return
		}

		try {
			const persistedData =
				finalConfig.storage.getItem(
					finalConfig.key,
				)
			if (persistedData) {
				const { timestamp } = JSON.parse(
					persistedData,
				)
				if (
					Date.now() - timestamp >
					finalConfig.maxAge
				) {
					finalConfig.storage.removeItem(
						finalConfig.key,
					)
				}
			}
		} catch (error) {
			console.error(
				"Failed to clear expired form state:",
				error,
			)
		}
	}, [finalConfig])

	const getStateAge = useCallback(() => {
		if (!finalConfig.storage) {
			return 0
		}

		try {
			const persistedData =
				finalConfig.storage.getItem(
					finalConfig.key,
				)
			if (persistedData) {
				const { timestamp } = JSON.parse(
					persistedData,
				)
				return Date.now() - timestamp
			}
		} catch (error) {
			console.error(
				"Failed to get form state age:",
				error,
			)
		}

		return 0
	}, [finalConfig])

	const isStateExpired = useCallback(() => {
		if (!finalConfig.maxAge) {
			return false
		}
		return getStateAge() > finalConfig.maxAge
	}, [finalConfig.maxAge, getStateAge])

	return {
		state,
		updateState,
		resetState,
		clearExpiredState,
		getStateAge,
		isStateExpired,
	}
}
