import {
	useState,
	useCallback,
	useEffect,
	useRef,
} from "react"

interface AutocompleteConfig<T> {
	options: T[]
	getOptionLabel: (option: T) => string
	getOptionValue: (option: T) => string
	filterOptions?: (
		options: T[],
		inputValue: string,
	) => T[]
	minInputLength?: number
	maxSuggestions?: number
	debounceTime?: number
	onSelect?: (option: T) => void
	onChange?: (inputValue: string) => void
}

interface AutocompleteState<T> {
	inputValue: string
	selectedOption: T | null
	suggestions: T[]
	isOpen: boolean
	highlightedIndex: number
	isLoading: boolean
}

const DEFAULT_CONFIG: Partial<
	AutocompleteConfig<any>
> = {
	minInputLength: 2,
	maxSuggestions: 10,
	debounceTime: 300,
}

export function useFieldAutocomplete<T>(
	config: AutocompleteConfig<T>,
) {
	const [state, setState] = useState<
		AutocompleteState<T>
	>({
		inputValue: "",
		selectedOption: null,
		suggestions: [],
		isOpen: false,
		highlightedIndex: -1,
		isLoading: false,
	})
	const finalConfig = {
		...DEFAULT_CONFIG,
		...config,
	}
	const timeoutRef = useRef<NodeJS.Timeout>()

	const filterOptions = useCallback(
		(inputValue: string) => {
			if (
				!inputValue ||
				inputValue.length <
					finalConfig.minInputLength!
			) {
				return []
			}

			const filtered = finalConfig.filterOptions
				? finalConfig.filterOptions(
						finalConfig.options,
						inputValue,
				  )
				: finalConfig.options.filter((option) =>
						finalConfig
							.getOptionLabel(option)
							.toLowerCase()
							.includes(inputValue.toLowerCase()),
				  )

			return filtered.slice(
				0,
				finalConfig.maxSuggestions!,
			)
		},
		[finalConfig],
	)

	const handleInputChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const inputValue = event.target.value

			setState((prevState) => ({
				...prevState,
				inputValue,
				selectedOption: null,
				isOpen: true,
				highlightedIndex: -1,
			}))

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				setState((prevState) => ({
					...prevState,
					suggestions: filterOptions(inputValue),
					isLoading: false,
				}))
			}, finalConfig.debounceTime)

			finalConfig.onChange?.(inputValue)
		},
		[finalConfig, filterOptions],
	)

	const handleOptionSelect = useCallback(
		(option: T) => {
			setState((prevState) => ({
				...prevState,
				inputValue:
					finalConfig.getOptionLabel(option),
				selectedOption: option,
				isOpen: false,
				suggestions: [],
			}))

			finalConfig.onSelect?.(option)
		},
		[finalConfig],
	)

	const handleKeyDown = useCallback(
		(
			event: React.KeyboardEvent<HTMLInputElement>,
		) => {
			const { key } = event

			switch (key) {
				case "ArrowDown":
					event.preventDefault()
					setState((prevState) => ({
						...prevState,
						isOpen: true,
						highlightedIndex: Math.min(
							prevState.highlightedIndex + 1,
							prevState.suggestions.length - 1,
						),
					}))
					break

				case "ArrowUp":
					event.preventDefault()
					setState((prevState) => ({
						...prevState,
						isOpen: true,
						highlightedIndex: Math.max(
							prevState.highlightedIndex - 1,
							0,
						),
					}))
					break

				case "Enter":
					event.preventDefault()
					if (
						state.highlightedIndex >= 0 &&
						state.suggestions[
							state.highlightedIndex
						]
					) {
						handleOptionSelect(
							state.suggestions[
								state.highlightedIndex
							],
						)
					}
					break

				case "Escape":
					event.preventDefault()
					setState((prevState) => ({
						...prevState,
						isOpen: false,
						suggestions: [],
					}))
					break
			}
		},
		[state, handleOptionSelect],
	)

	const handleBlur = useCallback(() => {
		setTimeout(() => {
			setState((prevState) => ({
				...prevState,
				isOpen: false,
			}))
		}, 200)
	}, [])

	const handleFocus = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isOpen: true,
		}))
	}, [])

	const reset = useCallback(() => {
		setState({
			inputValue: "",
			selectedOption: null,
			suggestions: [],
			isOpen: false,
			highlightedIndex: -1,
			isLoading: false,
		})
	}, [])

	const getInputProps = useCallback(() => {
		return {
			value: state.inputValue,
			onChange: handleInputChange,
			onKeyDown: handleKeyDown,
			onFocus: handleFocus,
			onBlur: handleBlur,
			"aria-expanded": state.isOpen,
			"aria-controls": "autocomplete-suggestions",
			"aria-activedescendant":
				state.highlightedIndex >= 0
					? `suggestion-${state.highlightedIndex}`
					: undefined,
		}
	}, [
		state,
		handleInputChange,
		handleKeyDown,
		handleFocus,
		handleBlur,
	])

	const getSuggestionProps = useCallback(
		(index: number) => {
			return {
				id: `suggestion-${index}`,
				role: "option",
				"aria-selected":
					index === state.highlightedIndex,
				onClick: () =>
					handleOptionSelect(
						state.suggestions[index],
					),
				onMouseEnter: () =>
					setState((prevState) => ({
						...prevState,
						highlightedIndex: index,
					})),
			}
		},
		[state, handleOptionSelect],
	)

	return {
		inputValue: state.inputValue,
		selectedOption: state.selectedOption,
		suggestions: state.suggestions,
		isOpen: state.isOpen,
		highlightedIndex: state.highlightedIndex,
		isLoading: state.isLoading,
		handleInputChange,
		handleOptionSelect,
		handleKeyDown,
		handleFocus,
		handleBlur,
		reset,
		getInputProps,
		getSuggestionProps,
	}
}
