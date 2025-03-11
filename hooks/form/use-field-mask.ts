import { useState, useCallback } from "react"

interface MaskConfig {
	mask: string
	placeholder?: string
	guide?: boolean
	keepCharPositions?: boolean
	showMask?: boolean
	onMaskChange?: (
		value: string,
		maskedValue: string,
	) => void
}

interface MaskState {
	value: string
	maskedValue: string
	cursorPosition: number
	isFocused: boolean
}

export function useFieldMask(config: MaskConfig) {
	const [state, setState] = useState<MaskState>({
		value: "",
		maskedValue: "",
		cursorPosition: 0,
		isFocused: false,
	})

	const applyMask = useCallback(
		(value: string): string => {
			const {
				mask,
				guide = true,
				keepCharPositions = true,
			} = config
			let maskedValue = ""
			let valueIndex = 0

			for (let i = 0; i < mask.length; i++) {
				const maskChar = mask[i]
				const valueChar = value[valueIndex]

				if (maskChar === "#") {
					if (valueChar) {
						maskedValue += valueChar
						valueIndex++
					} else if (guide) {
						maskedValue += "_"
					}
				} else {
					maskedValue += maskChar
				}
			}

			return maskedValue
		},
		[config],
	)

	const removeMask = useCallback(
		(maskedValue: string): string => {
			const { mask } = config
			let value = ""

			for (
				let i = 0;
				i < maskedValue.length;
				i++
			) {
				if (mask[i] === "#") {
					value += maskedValue[i]
				}
			}

			return value
		},
		[config],
	)

	const handleChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const { value, selectionStart } =
				event.target
			const maskedValue = applyMask(value)
			const unmaskedValue =
				removeMask(maskedValue)

			setState((prevState) => ({
				...prevState,
				value: unmaskedValue,
				maskedValue,
				cursorPosition: selectionStart || 0,
			}))

			config.onMaskChange?.(
				unmaskedValue,
				maskedValue,
			)
		},
		[config, applyMask, removeMask],
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
		(value: string) => {
			const maskedValue = applyMask(value)
			const unmaskedValue =
				removeMask(maskedValue)

			setState((prevState) => ({
				...prevState,
				value: unmaskedValue,
				maskedValue,
			}))

			config.onMaskChange?.(
				unmaskedValue,
				maskedValue,
			)
		},
		[config, applyMask, removeMask],
	)

	const getValue = useCallback(() => {
		return state.value
	}, [state.value])

	const getMaskedValue = useCallback(() => {
		return state.maskedValue
	}, [state.maskedValue])

	const getCursorPosition = useCallback(() => {
		return state.cursorPosition
	}, [state.cursorPosition])

	const isFocused = useCallback(() => {
		return state.isFocused
	}, [state.isFocused])

	const reset = useCallback(() => {
		setState({
			value: "",
			maskedValue: "",
			cursorPosition: 0,
			isFocused: false,
		})
	}, [])

	const getInputProps = useCallback(() => {
		return {
			value: state.maskedValue,
			onChange: handleChange,
			onFocus: handleFocus,
			onBlur: handleBlur,
			placeholder: config.placeholder,
			"data-mask": config.mask,
		}
	}, [
		state.maskedValue,
		handleChange,
		handleFocus,
		handleBlur,
		config,
	])

	return {
		value: state.value,
		maskedValue: state.maskedValue,
		cursorPosition: state.cursorPosition,
		isFocused: state.isFocused,
		handleChange,
		handleFocus,
		handleBlur,
		setValue,
		getValue,
		getMaskedValue,
		getCursorPosition,
		isFocused,
		reset,
		getInputProps,
	}
}
