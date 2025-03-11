import {
	useState,
	useCallback,
	useEffect,
} from "react"

interface TransitionState {
	isTransitioning: boolean
	progress: number
	direction: "forward" | "backward" | null
	startTime?: number
	endTime?: number
}

interface TransitionConfig {
	duration?: number
	easing?:
		| "linear"
		| "ease-in"
		| "ease-out"
		| "ease-in-out"
	updateInterval?: number
	threshold?: number
}

const DEFAULT_CONFIG: TransitionConfig = {
	duration: 300, // Transition duration in ms
	easing: "ease-in-out",
	updateInterval: 16, // ~60fps
	threshold: 0.5, // Threshold for completing transition
}

const EASING_FUNCTIONS = {
	linear: (t: number) => t,
	"ease-in": (t: number) => t * t,
	"ease-out": (t: number) => t * (2 - t),
	"ease-in-out": (t: number) =>
		t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
}

export function useTransition(
	config: Partial<TransitionConfig> = {},
) {
	const [state, setState] =
		useState<TransitionState>({
			isTransitioning: false,
			progress: 0,
			direction: null,
		})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}

	const startTransition = useCallback(
		(direction: "forward" | "backward") => {
			setState({
				isTransitioning: true,
				progress: 0,
				direction,
				startTime: Date.now(),
			})
		},
		[],
	)

	const stopTransition = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isTransitioning: false,
			progress: 1,
			endTime: Date.now(),
		}))
	}, [])

	const updateProgress = useCallback(
		(progress: number) => {
			setState((prevState) => ({
				...prevState,
				progress: Math.min(
					1,
					Math.max(0, progress),
				),
			}))
		},
		[],
	)

	// Transition animation
	useEffect(() => {
		if (
			!state.isTransitioning ||
			!state.startTime
		) {
			return
		}

		const easing =
			EASING_FUNCTIONS[finalConfig.easing]
		let animationFrame: number

		const animate = () => {
			const now = Date.now()
			const elapsed = now - state.startTime!
			const progress = Math.min(
				1,
				elapsed / finalConfig.duration,
			)

			const easedProgress = easing(progress)
			updateProgress(easedProgress)

			if (progress < 1) {
				animationFrame =
					requestAnimationFrame(animate)
			} else {
				stopTransition()
			}
		}

		animationFrame =
			requestAnimationFrame(animate)
		return () =>
			cancelAnimationFrame(animationFrame)
	}, [
		state.isTransitioning,
		state.startTime,
		finalConfig,
		updateProgress,
		stopTransition,
	])

	const getDuration = useCallback(() => {
		if (!state.startTime || !state.endTime) {
			return 0
		}
		return state.endTime - state.startTime
	}, [state.startTime, state.endTime])

	const isComplete = useCallback(() => {
		return state.progress >= finalConfig.threshold
	}, [state.progress, finalConfig.threshold])

	const reset = useCallback(() => {
		setState({
			isTransitioning: false,
			progress: 0,
			direction: null,
		})
	}, [])

	const getTransitionStyle = useCallback(() => {
		const transform =
			state.direction === "forward"
				? `translateX(${state.progress * 100}%)`
				: `translateX(${-state.progress * 100}%)`

		return {
			transform,
			transition: `transform ${finalConfig.duration}ms ${finalConfig.easing}`,
		}
	}, [
		state.direction,
		state.progress,
		finalConfig,
	])

	return {
		...state,
		startTransition,
		stopTransition,
		updateProgress,
		getDuration,
		isComplete,
		reset,
		getTransitionStyle,
	}
}
