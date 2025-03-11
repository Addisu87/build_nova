import {
	useState,
	useCallback,
	useEffect,
} from "react"

interface LoadingState {
	isLoading: boolean
	progress: number
	message?: string
	startTime?: number
	endTime?: number
}

interface LoadingConfig {
	minDuration?: number
	maxDuration?: number
	updateInterval?: number
	progressIncrement?: number
}

const DEFAULT_CONFIG: LoadingConfig = {
	minDuration: 500, // Minimum loading duration in ms
	maxDuration: 10000, // Maximum loading duration in ms
	updateInterval: 100, // Progress update interval in ms
	progressIncrement: 5, // Progress increment percentage
}

export function useLoadingState(
	config: Partial<LoadingConfig> = {},
) {
	const [state, setState] =
		useState<LoadingState>({
			isLoading: false,
			progress: 0,
		})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}

	const startLoading = useCallback(
		(message?: string) => {
			setState({
				isLoading: true,
				progress: 0,
				message,
				startTime: Date.now(),
			})
		},
		[],
	)

	const stopLoading = useCallback(
		(message?: string) => {
			setState((prevState) => {
				const endTime = Date.now()
				const duration =
					endTime -
					(prevState.startTime || endTime)

				// Ensure minimum duration
				if (duration < finalConfig.minDuration) {
					setTimeout(() => {
						setState({
							isLoading: false,
							progress: 100,
							message,
							endTime: Date.now(),
						})
					}, finalConfig.minDuration - duration)
					return prevState
				}

				return {
					isLoading: false,
					progress: 100,
					message,
					endTime,
				}
			})
		},
		[finalConfig.minDuration],
	)

	const updateProgress = useCallback(
		(progress: number) => {
			setState((prevState) => ({
				...prevState,
				progress: Math.min(
					100,
					Math.max(0, progress),
				),
			}))
		},
		[],
	)

	const updateMessage = useCallback(
		(message: string) => {
			setState((prevState) => ({
				...prevState,
				message,
			}))
		},
		[],
	)

	// Auto-progress increment
	useEffect(() => {
		if (
			!state.isLoading ||
			state.progress >= 90
		) {
			return
		}

		const interval = setInterval(() => {
			setState((prevState) => {
				const duration =
					Date.now() -
					(prevState.startTime || Date.now())

				// Stop if max duration reached
				if (duration >= finalConfig.maxDuration) {
					clearInterval(interval)
					return {
						...prevState,
						isLoading: false,
						progress: 100,
						endTime: Date.now(),
					}
				}

				// Increment progress
				return {
					...prevState,
					progress: Math.min(
						90,
						prevState.progress +
							finalConfig.progressIncrement,
					),
				}
			})
		}, finalConfig.updateInterval)

		return () => clearInterval(interval)
	}, [
		state.isLoading,
		state.progress,
		finalConfig,
	])

	const reset = useCallback(() => {
		setState({
			isLoading: false,
			progress: 0,
		})
	}, [])

	const getDuration = useCallback(() => {
		if (!state.startTime || !state.endTime) {
			return 0
		}
		return state.endTime - state.startTime
	}, [state.startTime, state.endTime])

	const isStalled = useCallback(() => {
		if (!state.isLoading || !state.startTime) {
			return false
		}
		return (
			Date.now() - state.startTime >
			finalConfig.maxDuration
		)
	}, [
		state.isLoading,
		state.startTime,
		finalConfig.maxDuration,
	])

	return {
		...state,
		startLoading,
		stopLoading,
		updateProgress,
		updateMessage,
		reset,
		getDuration,
		isStalled,
	}
}
