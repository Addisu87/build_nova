import {
	useState,
	useCallback,
	useEffect,
	useRef,
} from "react"

interface KeyboardNavigationState {
	currentIndex: number
	isNavigating: boolean
	totalItems: number
}

interface KeyboardNavigationConfig {
	initialIndex?: number
	totalItems: number
	loop?: boolean
	onSelect?: (index: number) => void
	onNavigate?: (index: number) => void
}

const DEFAULT_CONFIG: Partial<KeyboardNavigationConfig> =
	{
		initialIndex: 0,
		loop: false,
	}

export function useKeyboardNavigation(
	config: KeyboardNavigationConfig,
) {
	const [state, setState] =
		useState<KeyboardNavigationState>({
			currentIndex: config.initialIndex || 0,
			isNavigating: false,
			totalItems: config.totalItems,
		})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}
	const containerRef = useRef<HTMLElement | null>(
		null,
	)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const { key } = event
			let newIndex = state.currentIndex

			switch (key) {
				case "ArrowUp":
				case "ArrowLeft":
					event.preventDefault()
					newIndex = state.currentIndex - 1
					if (newIndex < 0) {
						newIndex = finalConfig.loop
							? state.totalItems - 1
							: 0
					}
					break

				case "ArrowDown":
				case "ArrowRight":
					event.preventDefault()
					newIndex = state.currentIndex + 1
					if (newIndex >= state.totalItems) {
						newIndex = finalConfig.loop
							? 0
							: state.totalItems - 1
					}
					break

				case "Home":
					event.preventDefault()
					newIndex = 0
					break

				case "End":
					event.preventDefault()
					newIndex = state.totalItems - 1
					break

				case "Enter":
				case " ":
					event.preventDefault()
					finalConfig.onSelect?.(
						state.currentIndex,
					)
					return

				default:
					return
			}

			setState((prevState) => ({
				...prevState,
				currentIndex: newIndex,
				isNavigating: true,
			}))

			finalConfig.onNavigate?.(newIndex)
		},
		[state, finalConfig],
	)

	useEffect(() => {
		const container = containerRef.current
		if (!container) {
			return
		}

		container.addEventListener(
			"keydown",
			handleKeyDown,
		)
		container.setAttribute("tabIndex", "0")
		container.setAttribute("role", "listbox")
		container.setAttribute(
			"aria-activedescendant",
			`item-${state.currentIndex}`,
		)

		return () => {
			container.removeEventListener(
				"keydown",
				handleKeyDown,
			)
			container.removeAttribute("tabIndex")
			container.removeAttribute("role")
			container.removeAttribute(
				"aria-activedescendant",
			)
		}
	}, [handleKeyDown, state.currentIndex])

	const setCurrentIndex = useCallback(
		(index: number) => {
			setState((prevState) => ({
				...prevState,
				currentIndex: Math.min(
					state.totalItems - 1,
					Math.max(0, index),
				),
			}))
		},
		[state.totalItems],
	)

	const focusItem = useCallback(
		(index: number) => {
			const container = containerRef.current
			if (!container) {
				return
			}

			const item = container.querySelector(
				`[data-index="${index}"]`,
			)
			if (item instanceof HTMLElement) {
				item.focus()
			}
		},
		[],
	)

	const reset = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			currentIndex: finalConfig.initialIndex || 0,
			isNavigating: false,
		}))
	}, [finalConfig.initialIndex])

	const getItemProps = useCallback(
		(index: number) => {
			return {
				"data-index": index,
				role: "option",
				"aria-selected":
					index === state.currentIndex,
				tabIndex:
					index === state.currentIndex ? 0 : -1,
			}
		},
		[state.currentIndex],
	)

	return {
		...state,
		containerRef,
		setCurrentIndex,
		focusItem,
		reset,
		getItemProps,
	}
}
