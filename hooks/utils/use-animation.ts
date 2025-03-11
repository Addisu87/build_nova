import {
	useState,
	useCallback,
	useEffect,
	useRef,
} from "react"

interface AnimationState {
	isAnimating: boolean
	progress: number
	startTime?: number
	endTime?: number
}

interface AnimationConfig {
	duration?: number
	easing?:
		| "linear"
		| "ease-in"
		| "ease-out"
		| "ease-in-out"
	updateInterval?: number
	loop?: boolean
	delay?: number
}

const DEFAULT_CONFIG: AnimationConfig = {
	duration: 1000, // Animation duration in ms
	easing: "ease-in-out",
	updateInterval: 16, // ~60fps
	loop: false,
	delay: 0,
}

const EASING_FUNCTIONS = {
	linear: (t: number) => t,
	"ease-in": (t: number) => t * t,
	"ease-out": (t: number) => t * (2 - t),
	"ease-in-out": (t: number) =>
		t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
}

export function useAnimation(
	config: Partial<AnimationConfig> = {},
) {
	const [state, setState] =
		useState<AnimationState>({
			isAnimating: false,
			progress: 0,
		})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}
	const animationFrameRef = useRef<number>()

	const startAnimation = useCallback(() => {
		setState({
			isAnimating: true,
			progress: 0,
			startTime: Date.now() + finalConfig.delay,
		})
	}, [finalConfig.delay])

	const stopAnimation = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isAnimating: false,
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

	// Animation loop
	useEffect(() => {
		if (!state.isAnimating || !state.startTime) {
			return
		}

		const easing =
			EASING_FUNCTIONS[finalConfig.easing]
		let startTime = state.startTime

		const animate = () => {
			const now = Date.now()
			const elapsed = now - startTime
			const progress = Math.min(
				1,
				elapsed / finalConfig.duration,
			)

			const easedProgress = easing(progress)
			updateProgress(easedProgress)

			if (progress < 1) {
				animationFrameRef.current =
					requestAnimationFrame(animate)
			} else if (finalConfig.loop) {
				startTime = now
				animationFrameRef.current =
					requestAnimationFrame(animate)
			} else {
				stopAnimation()
			}
		}

		animationFrameRef.current =
			requestAnimationFrame(animate)
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(
					animationFrameRef.current,
				)
			}
		}
	}, [
		state.isAnimating,
		state.startTime,
		finalConfig,
		updateProgress,
		stopAnimation,
	])

	const pauseAnimation = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isAnimating: false,
		}))
	}, [])

	const resumeAnimation = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isAnimating: true,
			startTime:
				Date.now() -
				prevState.progress * finalConfig.duration,
		}))
	}, [finalConfig.duration])

	const reset = useCallback(() => {
		setState({
			isAnimating: false,
			progress: 0,
		})
	}, [])

	const getDuration = useCallback(() => {
		if (!state.startTime || !state.endTime) {
			return 0
		}
		return state.endTime - state.startTime
	}, [state.startTime, state.endTime])

	const getAnimationStyle = useCallback(() => {
		return {
			transform: `scale(${state.progress})`,
			opacity: state.progress,
			transition: `transform ${finalConfig.duration}ms ${finalConfig.easing}, opacity ${finalConfig.duration}ms ${finalConfig.easing}`,
		}
	}, [state.progress, finalConfig])

	return {
		...state,
		startAnimation,
		stopAnimation,
		pauseAnimation,
		resumeAnimation,
		updateProgress,
		getDuration,
		reset,
		getAnimationStyle,
	}
}
