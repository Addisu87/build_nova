import { useState, useCallback } from "react"

interface FormatConfig {
	format: (value: any) => string
	parse: (formattedValue: string) => any
	placeholder?: string
	onFormatChange?: (
		value: any,
		formattedValue: string,
	) => void
}

interface FormatState {
	value: any
	formattedValue: string
	cursorPosition: number
	isFocused: boolean
}

export function useFieldFormat(
	config: FormatConfig,
) {
	const [state, setState] = useState<FormatState>(
		{
			value: null,
			formattedValue: "",
			cursorPosition: 0,
			isFocused: false,
		},
	)

	const handleChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const { value, selectionStart } =
				event.target
			const parsedValue = config.parse(value)
			const formattedValue =
				config.format(parsedValue)

			setState((prevState) => ({
				...prevState,
				value: parsedValue,
				formattedValue,
				cursorPosition: selectionStart || 0,
			}))

			config.onFormatChange?.(
				parsedValue,
				formattedValue,
			)
		},
		[config],
	)

	const handleFocus = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: true,
		}))
	}, [])

	const handleBlur = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isFocused: false,
		}))
	}, [])

	const setValue = useCallback(
		(value: any) => {
			const formattedValue = config.format(value)

			setState((prevState) => ({
				...prevState,
				value,
				formattedValue,
			}))

			config.onFormatChange?.(
				value,
				formattedValue,
			)
		},
		[config],
	)

	const getValue = useCallback(() => {
		return state.value
	}, [state.value])

	const getFormattedValue = useCallback(() => {
		return state.formattedValue
	}, [state.formattedValue])

	const getCursorPosition = useCallback(() => {
		return state.cursorPosition
	}, [state.cursorPosition])

	const isFocused = useCallback(() => {
		return state.isFocused
	}, [state.isFocused])

	const reset = useCallback(() => {
		setState({
			value: null,
			formattedValue: "",
			cursorPosition: 0,
			isFocused: false,
		})
	}, [])

	const getInputProps = useCallback(() => {
		return {
			value: state.formattedValue,
			onChange: handleChange,
			onFocus: handleFocus,
			onBlur: handleBlur,
			placeholder: config.placeholder,
		}
	}, [
		state.formattedValue,
		handleChange,
		handleFocus,
		handleBlur,
		config,
	])

	return {
		value: state.value,
		formattedValue: state.formattedValue,
		cursorPosition: state.cursorPosition,
		isFocused: state.isFocused,
		handleChange,
		handleFocus,
		handleBlur,
		setValue,
		getValue,
		getFormattedValue,
		getCursorPosition,
		isFocused,
		reset,
		getInputProps,
	}
}
