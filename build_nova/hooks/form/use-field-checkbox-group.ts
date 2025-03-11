import { useState, useCallback } from "react"

interface CheckboxOption {
	value: string
	label: string
	disabled?: boolean
	checked?: boolean
}

interface CheckboxGroupConfig {
	options: CheckboxOption[]
	minSelected?: number
	maxSelected?: number
	required?: boolean
	onSelectionChange?: (
		selectedValues: string[],
	) => void
	onValidationChange?: (isValid: boolean) => void
}

interface CheckboxGroupState {
	selectedValues: string[]
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<CheckboxGroupConfig> =
	{
		required: false,
	}

export function useFieldCheckboxGroup(
	config: CheckboxGroupConfig,
) {
	const [state, setState] =
		useState<CheckboxGroupState>({
			selectedValues: config.options
				.filter((option) => option.checked)
				.map((option) => option.value),
			isValid: true,
			error: null,
		})

	const validateSelection = useCallback(
		(selectedValues: string[]): boolean => {
			const {
				required,
				minSelected,
				maxSelected,
			} = config

			if (
				required &&
				selectedValues.length === 0
			) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error:
						"At least one option must be selected",
				}))
				return false
			}

			if (
				minSelected &&
				selectedValues.length < minSelected
			) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `At least ${minSelected} option(s) must be selected`,
				}))
				return false
			}

			if (
				maxSelected &&
				selectedValues.length > maxSelected
			) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `No more than ${maxSelected} option(s) can be selected`,
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

	const handleOptionChange = useCallback(
		(value: string, checked: boolean) => {
			const newSelectedValues = checked
				? [...state.selectedValues, value]
				: state.selectedValues.filter(
						(v) => v !== value,
				  )

			const isValid = validateSelection(
				newSelectedValues,
			)

			setState((prevState) => ({
				...prevState,
				selectedValues: newSelectedValues,
				isValid,
			}))

			config.onSelectionChange?.(
				newSelectedValues,
			)
			config.onValidationChange?.(isValid)
		},
		[
			config,
			state.selectedValues,
			validateSelection,
		],
	)

	const handleSelectAll = useCallback(() => {
		const allValues = config.options
			.filter((option) => !option.disabled)
			.map((option) => option.value)

		const isValid = validateSelection(allValues)

		setState((prevState) => ({
			...prevState,
			selectedValues: allValues,
			isValid,
		}))

		config.onSelectionChange?.(allValues)
		config.onValidationChange?.(isValid)
	}, [config, validateSelection])

	const handleDeselectAll = useCallback(() => {
		const isValid = validateSelection([])

		setState((prevState) => ({
			...prevState,
			selectedValues: [],
			isValid,
		}))

		config.onSelectionChange?.([])
		config.onValidationChange?.(isValid)
	}, [config, validateSelection])

	const isOptionSelected = useCallback(
		(value: string) => {
			return state.selectedValues.includes(value)
		},
		[state.selectedValues],
	)

	const getSelectedCount = useCallback(() => {
		return state.selectedValues.length
	}, [state.selectedValues])

	const reset = useCallback(() => {
		const initialValues = config.options
			.filter((option) => option.checked)
			.map((option) => option.value)

		const isValid = validateSelection(
			initialValues,
		)

		setState({
			selectedValues: initialValues,
			isValid,
			error: null,
		})
	}, [config, validateSelection])

	const getGroupProps = useCallback(() => {
		return {
			role: "group",
			"aria-label": "Checkbox group",
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "checkbox-group-error"
				: undefined,
			"aria-required": config.required,
		}
	}, [state, config])

	const getOptionProps = useCallback(
		(option: CheckboxOption) => {
			return {
				type: "checkbox",
				value: option.value,
				checked: isOptionSelected(option.value),
				disabled: option.disabled,
				onChange: (
					event: React.ChangeEvent<HTMLInputElement>,
				) =>
					handleOptionChange(
						option.value,
						event.target.checked,
					),
				"aria-checked": isOptionSelected(
					option.value,
				),
				"aria-disabled": option.disabled,
			}
		},
		[isOptionSelected, handleOptionChange],
	)

	return {
		selectedValues: state.selectedValues,
		isValid: state.isValid,
		error: state.error,
		handleOptionChange,
		handleSelectAll,
		handleDeselectAll,
		isOptionSelected,
		getSelectedCount,
		reset,
		getGroupProps,
		getOptionProps,
	}
}
