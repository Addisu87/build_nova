import {
	useState,
	useCallback,
	useEffect,
	useRef,
} from "react"

interface AccessibilityState {
	isExpanded: boolean
	isVisible: boolean
	isFocused: boolean
	isHovered: boolean
	isPressed: boolean
	isSelected: boolean
	isDisabled: boolean
	isReadOnly: boolean
	isRequired: boolean
	isInvalid: boolean
	hasError: boolean
	errorMessage?: string
}

interface AccessibilityConfig {
	role?: string
	label?: string
	description?: string
	expanded?: boolean
	visible?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	invalid?: boolean
	errorMessage?: string
	onFocus?: () => void
	onBlur?: () => void
	onClick?: () => void
	onKeyDown?: (event: KeyboardEvent) => void
}

const DEFAULT_CONFIG: AccessibilityConfig = {
	role: "button",
	expanded: false,
	visible: true,
	disabled: false,
	readOnly: false,
	required: false,
	invalid: false,
}

export function useAccessibility(
	config: AccessibilityConfig,
) {
	const [state, setState] =
		useState<AccessibilityState>({
			isExpanded: config.expanded || false,
			isVisible: config.visible || true,
			isFocused: false,
			isHovered: false,
			isPressed: false,
			isSelected: false,
			isDisabled: config.disabled || false,
			isReadOnly: config.readOnly || false,
			isRequired: config.required || false,
			isInvalid: config.invalid || false,
			hasError: !!config.errorMessage,
			errorMessage: config.errorMessage,
		})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}
	const elementRef = useRef<HTMLElement | null>(
		null,
	)

	const handleFocus = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: true,
		}))
		finalConfig.onFocus?.()
	}, [finalConfig])

	const handleBlur = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: false,
		}))
		finalConfig.onBlur?.()
	}, [finalConfig])

	const handleClick = useCallback(() => {
		if (state.isDisabled || state.isReadOnly) {
			return
		}
		finalConfig.onClick?.()
	}, [
		state.isDisabled,
		state.isReadOnly,
		finalConfig,
	])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (state.isDisabled || state.isReadOnly) {
				return
			}

			switch (event.key) {
				case "Enter":
				case " ":
					event.preventDefault()
					finalConfig.onClick?.()
					break

				case "Escape":
					event.preventDefault()
					if (state.isExpanded) {
						setState((prevState) => ({
							...prevState,
							isExpanded: false,
						}))
					}
					break

				default:
					finalConfig.onKeyDown?.(event)
			}
		},
		[state, finalConfig],
	)

	const handleMouseEnter = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isHovered: true,
		}))
	}, [])

	const handleMouseLeave = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isHovered: false,
		}))
	}, [])

	const handleMouseDown = useCallback(() => {
		if (state.isDisabled || state.isReadOnly) {
			return
		}
		setState((prevState) => ({
			...prevState,
			isPressed: true,
		}))
	}, [state.isDisabled, state.isReadOnly])

	const handleMouseUp = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isPressed: false,
		}))
	}, [])

	useEffect(() => {
		const element = elementRef.current
		if (!element) {
			return
		}

		// Set ARIA attributes
		element.setAttribute(
			"role",
			finalConfig.role || "button",
		)
		if (finalConfig.label) {
			element.setAttribute(
				"aria-label",
				finalConfig.label,
			)
		}
		if (finalConfig.description) {
			element.setAttribute(
				"aria-description",
				finalConfig.description,
			)
		}
		element.setAttribute(
			"aria-expanded",
			state.isExpanded.toString(),
		)
		element.setAttribute(
			"aria-disabled",
			state.isDisabled.toString(),
		)
		element.setAttribute(
			"aria-readonly",
			state.isReadOnly.toString(),
		)
		element.setAttribute(
			"aria-required",
			state.isRequired.toString(),
		)
		element.setAttribute(
			"aria-invalid",
			state.isInvalid.toString(),
		)
		if (state.errorMessage) {
			element.setAttribute(
				"aria-errormessage",
				state.errorMessage,
			)
		}

		// Add event listeners
		element.addEventListener("focus", handleFocus)
		element.addEventListener("blur", handleBlur)
		element.addEventListener("click", handleClick)
		element.addEventListener(
			"keydown",
			handleKeyDown,
		)
		element.addEventListener(
			"mouseenter",
			handleMouseEnter,
		)
		element.addEventListener(
			"mouseleave",
			handleMouseLeave,
		)
		element.addEventListener(
			"mousedown",
			handleMouseDown,
		)
		element.addEventListener(
			"mouseup",
			handleMouseUp,
		)

		return () => {
			// Remove event listeners
			element.removeEventListener(
				"focus",
				handleFocus,
			)
			element.removeEventListener(
				"blur",
				handleBlur,
			)
			element.removeEventListener(
				"click",
				handleClick,
			)
			element.removeEventListener(
				"keydown",
				handleKeyDown,
			)
			element.removeEventListener(
				"mouseenter",
				handleMouseEnter,
			)
			element.removeEventListener(
				"mouseleave",
				handleMouseLeave,
			)
			element.removeEventListener(
				"mousedown",
				handleMouseDown,
			)
			element.removeEventListener(
				"mouseup",
				handleMouseUp,
			)
		}
	}, [
		finalConfig,
		state,
		handleFocus,
		handleBlur,
		handleClick,
		handleKeyDown,
		handleMouseEnter,
		handleMouseLeave,
		handleMouseDown,
		handleMouseUp,
	])

	const setExpanded = useCallback(
		(expanded: boolean) => {
			setState((prevState) => ({
				...prevState,
				isExpanded: expanded,
			}))
		},
		[],
	)

	const setVisible = useCallback(
		(visible: boolean) => {
			setState((prevState) => ({
				...prevState,
				isVisible: visible,
			}))
		},
		[],
	)

	const setSelected = useCallback(
		(selected: boolean) => {
			setState((prevState) => ({
				...prevState,
				isSelected: selected,
			}))
		},
		[],
	)

	const setDisabled = useCallback(
		(disabled: boolean) => {
			setState((prevState) => ({
				...prevState,
				isDisabled: disabled,
			}))
		},
		[],
	)

	const setReadOnly = useCallback(
		(readOnly: boolean) => {
			setState((prevState) => ({
				...prevState,
				isReadOnly: readOnly,
			}))
		},
		[],
	)

	const setRequired = useCallback(
		(required: boolean) => {
			setState((prevState) => ({
				...prevState,
				isRequired: required,
			}))
		},
		[],
	)

	const setInvalid = useCallback(
		(invalid: boolean) => {
			setState((prevState) => ({
				...prevState,
				isInvalid: invalid,
			}))
		},
		[],
	)

	const setErrorMessage = useCallback(
		(message?: string) => {
			setState((prevState) => ({
				...prevState,
				hasError: !!message,
				errorMessage: message,
			}))
		},
		[],
	)

	return {
		...state,
		elementRef,
		setExpanded,
		setVisible,
		setSelected,
		setDisabled,
		setReadOnly,
		setRequired,
		setInvalid,
		setErrorMessage,
	}
}
