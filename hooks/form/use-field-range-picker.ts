import { useState, useCallback } from "react"

interface RangePickerConfig {
	initialStart?: number
	initialEnd?: number
	min?: number
	max?: number
	step?: number
	format?: (value: number) => string
	parse?: (value: string) => number
	onRangeChange?: (
		start: number | null,
		end: number | null,
	) => void
	onValidationChange?: (isValid: boolean) => void
}

interface RangePickerState {
	start: number | null
	end: number | null
	startDisplay: string
	endDisplay: string
	isOpen: boolean
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<RangePickerConfig> =
	{
		step: 1,
		format: (value: number) => value.toString(),
		parse: (value: string) => Number(value),
	}

export function useFieldRangePicker(
	config: RangePickerConfig,
) {
	const [state, setState] =
		useState<RangePickerState>({
			start: config.initialStart || null,
			end: config.initialEnd || null,
			startDisplay: config.initialStart
				? config.format?.(config.initialStart) ||
				  config.initialStart.toString()
				: "",
			endDisplay: config.initialEnd
				? config.format?.(config.initialEnd) ||
				  config.initialEnd.toString()
				: "",
			isOpen: false,
			isValid: true,
			error: null,
		})

	const validateRange = useCallback(
		(
			start: number | null,
			end: number | null,
		): boolean => {
			if (start === null && end === null) {
				return true
			}

			const { min, max } = config

			if (start !== null) {
				if (min !== undefined && start < min) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error: "Start value is below minimum",
					}))
					return false
				}
				if (max !== undefined && start > max) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error: "Start value is above maximum",
					}))
					return false
				}
			}

			if (end !== null) {
				if (min !== undefined && end < min) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error: "End value is below minimum",
					}))
					return false
				}
				if (max !== undefined && end > max) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error: "End value is above maximum",
					}))
					return false
				}
			}

			if (
				start !== null &&
				end !== null &&
				start > end
			) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"Start value is greater than end value",
				}))
				return false
			}

			setState((prevState) => ({
				...prevState,
				isValid: true,
				error: null,
			}))

			return true
		},
		[config],
	)

	const handleStartChange = useCallback(
		(value: string) => {
			const parsedValue =
				config.parse?.(value) ?? Number(value)
			const start = isNaN(parsedValue)
				? null
				: parsedValue

			setState((prevState) => ({
				...prevState,
				start,
				startDisplay: value,
				isValid: validateRange(
					start,
					prevState.end,
				),
			}))
		},
		[config, validateRange],
	)

	const handleEndChange = useCallback(
		(value: string) => {
			const parsedValue =
				config.parse?.(value) ?? Number(value)
			const end = isNaN(parsedValue)
				? null
				: parsedValue

			setState((prevState) => ({
				...prevState,
				end,
				endDisplay: value,
				isValid: validateRange(
					prevState.start,
					end,
				),
			}))
		},
		[config, validateRange],
	)

	const handleRangeChange = useCallback(
		(
			start: number | null,
			end: number | null,
		) => {
			const isValid = validateRange(start, end)
			const startDisplay =
				start !== null
					? config.format?.(start) ||
					  start.toString()
					: ""
			const endDisplay =
				end !== null
					? config.format?.(end) || end.toString()
					: ""

			setState((prevState) => ({
				...prevState,
				start,
				end,
				startDisplay,
				endDisplay,
				isValid,
			}))

			config.onRangeChange?.(start, end)
			config.onValidationChange?.(isValid)
		},
		[config, validateRange],
	)

	const toggleRangePicker = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isOpen: !prevState.isOpen,
		}))
	}, [])

	const generateRangeOptions = useCallback(() => {
		const {
			min = 0,
			max = 100,
			step = 1,
		} = config
		const options: number[] = []

		for (
			let value = min;
			value <= max;
			value += step
		) {
			options.push(value)
		}

		return options
	}, [config])

	const reset = useCallback(() => {
		setState({
			start: config.initialStart || null,
			end: config.initialEnd || null,
			startDisplay: config.initialStart
				? config.format?.(config.initialStart) ||
				  config.initialStart.toString()
				: "",
			endDisplay: config.initialEnd
				? config.format?.(config.initialEnd) ||
				  config.initialEnd.toString()
				: "",
			isOpen: false,
			isValid: true,
			error: null,
		})
	}, [config])

	const getInputProps = useCallback(() => {
		return {
			start: {
				value: state.startDisplay,
				onChange: (
					event: React.ChangeEvent<HTMLInputElement>,
				) =>
					handleStartChange(event.target.value),
				"aria-label": "Start value",
				"aria-invalid": !state.isValid,
				"aria-describedby": state.error
					? "range-picker-error"
					: undefined,
			},
			end: {
				value: state.endDisplay,
				onChange: (
					event: React.ChangeEvent<HTMLInputElement>,
				) => handleEndChange(event.target.value),
				"aria-label": "End value",
				"aria-invalid": !state.isValid,
				"aria-describedby": state.error
					? "range-picker-error"
					: undefined,
			},
		}
	}, [state, handleStartChange, handleEndChange])

	const getRangePickerProps = useCallback(() => {
		return {
			start: state.start,
			end: state.end,
			options: generateRangeOptions(),
			onChange: handleRangeChange,
			isOpen: state.isOpen,
			onClose: () =>
				setState((prevState) => ({
					...prevState,
					isOpen: false,
				})),
		}
	}, [
		state,
		generateRangeOptions,
		handleRangeChange,
	])

	return {
		start: state.start,
		end: state.end,
		startDisplay: state.startDisplay,
		endDisplay: state.endDisplay,
		isOpen: state.isOpen,
		isValid: state.isValid,
		error: state.error,
		handleStartChange,
		handleEndChange,
		handleRangeChange,
		toggleRangePicker,
		reset,
		getInputProps,
		getRangePickerProps,
	}
}
