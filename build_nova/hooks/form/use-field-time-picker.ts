import { useState, useCallback } from "react"

interface TimePickerConfig {
	initialTime?: Date
	minTime?: Date
	maxTime?: Date
	format?: string
	locale?: string
	interval?: number
	onTimeChange?: (time: Date | null) => void
	onValidationChange?: (isValid: boolean) => void
}

interface TimePickerState {
	time: Date | null
	displayValue: string
	isOpen: boolean
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<TimePickerConfig> =
	{
		format: "hh:mm a",
		locale: "en-US",
		interval: 30, // minutes
	}

export function useFieldTimePicker(
	config: TimePickerConfig,
) {
	const [state, setState] =
		useState<TimePickerState>({
			time: config.initialTime || null,
			displayValue: config.initialTime
				? formatTime(
						config.initialTime,
						config.format ||
							DEFAULT_CONFIG.format!,
						config.locale ||
							DEFAULT_CONFIG.locale!,
				  )
				: "",
			isOpen: false,
			isValid: true,
			error: null,
		})

	const formatTime = useCallback(
		(
			time: Date,
			format: string,
			locale: string,
		): string => {
			try {
				return new Intl.DateTimeFormat(locale, {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}).format(time)
			} catch (error) {
				console.error(
					"Failed to format time:",
					error,
				)
				return ""
			}
		},
		[],
	)

	const parseTime = useCallback(
		(value: string): Date | null => {
			try {
				const [time, period] = value.split(" ")
				const [hours, minutes] = time
					.split(":")
					.map(Number)
				const isPM = period.toLowerCase() === "pm"
				let adjustedHours = hours

				if (isPM && hours !== 12) {
					adjustedHours += 12
				} else if (!isPM && hours === 12) {
					adjustedHours = 0
				}

				const date = new Date()
				date.setHours(
					adjustedHours,
					minutes,
					0,
					0,
				)

				if (isNaN(date.getTime())) {
					return null
				}

				return date
			} catch (error) {
				console.error(
					"Failed to parse time:",
					error,
				)
				return null
			}
		},
		[],
	)

	const validateTime = useCallback(
		(time: Date | null): boolean => {
			if (!time) {
				return true
			}

			const { minTime, maxTime } = config

			if (minTime && time < minTime) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"Time is before minimum allowed time",
				}))
				return false
			}

			if (maxTime && time > maxTime) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"Time is after maximum allowed time",
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

	const handleTimeChange = useCallback(
		(time: Date | null) => {
			const isValid = validateTime(time)
			const displayValue = time
				? formatTime(
						time,
						config.format ||
							DEFAULT_CONFIG.format!,
						config.locale ||
							DEFAULT_CONFIG.locale!,
				  )
				: ""

			setState((prevState) => ({
				...prevState,
				time,
				displayValue,
				isValid,
			}))

			config.onTimeChange?.(time)
			config.onValidationChange?.(isValid)
		},
		[config, formatTime, validateTime],
	)

	const handleInputChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const value = event.target.value
			const time = parseTime(value)

			setState((prevState) => ({
				...prevState,
				displayValue: value,
				time: time,
				isValid: validateTime(time),
			}))
		},
		[parseTime, validateTime],
	)

	const handleTimeSelect = useCallback(
		(time: Date) => {
			handleTimeChange(time)
			setState((prevState) => ({
				...prevState,
				isOpen: false,
			}))
		},
		[handleTimeChange],
	)

	const toggleTimePicker = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isOpen: !prevState.isOpen,
		}))
	}, [])

	const generateTimeOptions = useCallback(() => {
		const options: Date[] = []
		const interval =
			config.interval || DEFAULT_CONFIG.interval!
		const minTime =
			config.minTime || new Date(0, 0, 0, 0, 0, 0)
		const maxTime =
			config.maxTime ||
			new Date(0, 0, 0, 23, 59, 59)

		let currentTime = new Date(minTime)
		while (currentTime <= maxTime) {
			options.push(new Date(currentTime))
			currentTime = new Date(
				currentTime.getTime() + interval * 60000,
			)
		}

		return options
	}, [config])

	const reset = useCallback(() => {
		setState({
			time: config.initialTime || null,
			displayValue: config.initialTime
				? formatTime(
						config.initialTime,
						config.format ||
							DEFAULT_CONFIG.format!,
						config.locale ||
							DEFAULT_CONFIG.locale!,
				  )
				: "",
			isOpen: false,
			isValid: true,
			error: null,
		})
	}, [config, formatTime])

	const getInputProps = useCallback(() => {
		return {
			value: state.displayValue,
			onChange: handleInputChange,
			onClick: toggleTimePicker,
			"aria-expanded": state.isOpen,
			"aria-controls": "time-picker-dropdown",
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "time-picker-error"
				: undefined,
		}
	}, [state, handleInputChange, toggleTimePicker])

	const getTimePickerProps = useCallback(() => {
		return {
			selectedTime: state.time,
			timeOptions: generateTimeOptions(),
			onSelect: handleTimeSelect,
			isOpen: state.isOpen,
			onClose: () =>
				setState((prevState) => ({
					...prevState,
					isOpen: false,
				})),
		}
	}, [
		state,
		generateTimeOptions,
		handleTimeSelect,
	])

	return {
		time: state.time,
		displayValue: state.displayValue,
		isOpen: state.isOpen,
		isValid: state.isValid,
		error: state.error,
		handleTimeChange,
		handleInputChange,
		handleTimeSelect,
		toggleTimePicker,
		reset,
		getInputProps,
		getTimePickerProps,
	}
}
