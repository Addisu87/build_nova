import { useState, useCallback } from "react"

interface DatePickerConfig {
	initialDate?: Date
	minDate?: Date
	maxDate?: Date
	format?: string
	locale?: string
	onDateChange?: (date: Date | null) => void
	onValidationChange?: (isValid: boolean) => void
}

interface DatePickerState {
	date: Date | null
	displayValue: string
	isOpen: boolean
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<DatePickerConfig> =
	{
		format: "MM/dd/yyyy",
		locale: "en-US",
	}

export function useFieldDatePicker(
	config: DatePickerConfig,
) {
	const [state, setState] =
		useState<DatePickerState>({
			date: config.initialDate || null,
			displayValue: config.initialDate
				? formatDate(
						config.initialDate,
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

	const formatDate = useCallback(
		(
			date: Date,
			format: string,
			locale: string,
		): string => {
			try {
				return new Intl.DateTimeFormat(locale, {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}).format(date)
			} catch (error) {
				console.error(
					"Failed to format date:",
					error,
				)
				return ""
			}
		},
		[],
	)

	const parseDate = useCallback(
		(value: string): Date | null => {
			try {
				const [month, day, year] = value
					.split("/")
					.map(Number)
				const date = new Date(
					year,
					month - 1,
					day,
				)

				if (isNaN(date.getTime())) {
					return null
				}

				return date
			} catch (error) {
				console.error(
					"Failed to parse date:",
					error,
				)
				return null
			}
		},
		[],
	)

	const validateDate = useCallback(
		(date: Date | null): boolean => {
			if (!date) {
				return true
			}

			const { minDate, maxDate } = config

			if (minDate && date < minDate) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"Date is before minimum allowed date",
				}))
				return false
			}

			if (maxDate && date > maxDate) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"Date is after maximum allowed date",
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

	const handleDateChange = useCallback(
		(date: Date | null) => {
			const isValid = validateDate(date)
			const displayValue = date
				? formatDate(
						date,
						config.format ||
							DEFAULT_CONFIG.format!,
						config.locale ||
							DEFAULT_CONFIG.locale!,
				  )
				: ""

			setState((prevState) => ({
				...prevState,
				date,
				displayValue,
				isValid,
			}))

			config.onDateChange?.(date)
			config.onValidationChange?.(isValid)
		},
		[config, formatDate, validateDate],
	)

	const handleInputChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const value = event.target.value
			const date = parseDate(value)

			setState((prevState) => ({
				...prevState,
				displayValue: value,
				date: date,
				isValid: validateDate(date),
			}))
		},
		[parseDate, validateDate],
	)

	const handleCalendarSelect = useCallback(
		(date: Date) => {
			handleDateChange(date)
			setState((prevState) => ({
				...prevState,
				isOpen: false,
			}))
		},
		[handleDateChange],
	)

	const toggleCalendar = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isOpen: !prevState.isOpen,
		}))
	}, [])

	const reset = useCallback(() => {
		setState({
			date: config.initialDate || null,
			displayValue: config.initialDate
				? formatDate(
						config.initialDate,
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
	}, [config, formatDate])

	const getInputProps = useCallback(() => {
		return {
			value: state.displayValue,
			onChange: handleInputChange,
			onClick: toggleCalendar,
			"aria-expanded": state.isOpen,
			"aria-controls": "date-picker-calendar",
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "date-picker-error"
				: undefined,
		}
	}, [state, handleInputChange, toggleCalendar])

	const getCalendarProps = useCallback(() => {
		return {
			selectedDate: state.date,
			minDate: config.minDate,
			maxDate: config.maxDate,
			onSelect: handleCalendarSelect,
			isOpen: state.isOpen,
			onClose: () =>
				setState((prevState) => ({
					...prevState,
					isOpen: false,
				})),
		}
	}, [state, config, handleCalendarSelect])

	return {
		date: state.date,
		displayValue: state.displayValue,
		isOpen: state.isOpen,
		isValid: state.isValid,
		error: state.error,
		handleDateChange,
		handleInputChange,
		handleCalendarSelect,
		toggleCalendar,
		reset,
		getInputProps,
		getCalendarProps,
	}
}
