import { useState, useCallback } from "react"

interface FieldGroupConfig<T> {
	name: string
	initialValues: T
	validateGroup?: (
		values: T,
	) => boolean | Promise<boolean>
	onUpdate?: (values: T) => void
	onValidate?: (isValid: boolean) => void
}

export function useFieldGroup<
	T extends Record<string, any>,
>(config: FieldGroupConfig<T>) {
	const [state, setState] = useState<{
		values: T
		errors: Partial<Record<keyof T, string>>
		touched: Partial<Record<keyof T, boolean>>
		isValid: boolean
		isDirty: boolean
	}>({
		values: config.initialValues,
		errors: {},
		touched: {},
		isValid: true,
		isDirty: false,
	})

	const updateField = useCallback(
		(field: keyof T, value: any) => {
			setState((prevState) => ({
				...prevState,
				values: {
					...prevState.values,
					[field]: value,
				},
				touched: {
					...prevState.touched,
					[field]: true,
				},
				isDirty: true,
			}))
		},
		[],
	)

	const updateFields = useCallback(
		(updates: Partial<T>) => {
			setState((prevState) => ({
				...prevState,
				values: {
					...prevState.values,
					...updates,
				},
				touched: Object.keys(updates).reduce(
					(acc, field) => ({
						...acc,
						[field]: true,
					}),
					prevState.touched,
				),
				isDirty: true,
			}))
		},
		[],
	)

	const setFieldError = useCallback(
		(field: keyof T, error: string) => {
			setState((prevState) => ({
				...prevState,
				errors: {
					...prevState.errors,
					[field]: error,
				},
				isValid: false,
			}))
		},
		[],
	)

	const clearFieldError = useCallback(
		(field: keyof T) => {
			setState((prevState) => {
				const { [field]: _, ...errors } =
					prevState.errors
				return {
					...prevState,
					errors,
					isValid:
						Object.keys(errors).length === 0,
				}
			})
		},
		[],
	)

	const markFieldAsTouched = useCallback(
		(field: keyof T) => {
			setState((prevState) => ({
				...prevState,
				touched: {
					...prevState.touched,
					[field]: true,
				},
			}))
		},
		[],
	)

	const isFieldValid = useCallback(
		(field: keyof T) => {
			return !state.errors[field]
		},
		[state.errors],
	)

	const isFieldTouched = useCallback(
		(field: keyof T) => {
			return !!state.touched[field]
		},
		[state.touched],
	)

	const getFieldError = useCallback(
		(field: keyof T) => {
			return state.errors[field]
		},
		[state.errors],
	)

	const validateGroup = useCallback(async () => {
		if (!config.validateGroup) {
			return true
		}

		const isValid = await config.validateGroup(
			state.values,
		)
		setState((prevState) => ({
			...prevState,
			isValid,
		}))

		config.onValidate?.(isValid)
		return isValid
	}, [config, state.values])

	const resetGroup = useCallback(() => {
		setState({
			values: config.initialValues,
			errors: {},
			touched: {},
			isValid: true,
			isDirty: false,
		})
	}, [config.initialValues])

	const getGroupValues = useCallback(() => {
		return state.values
	}, [state.values])

	const getGroupErrors = useCallback(() => {
		return state.errors
	}, [state.errors])

	const getGroupTouched = useCallback(() => {
		return state.touched
	}, [state.touched])

	const isGroupValid = useCallback(() => {
		return state.isValid
	}, [state.isValid])

	const isGroupDirty = useCallback(() => {
		return state.isDirty
	}, [state.isDirty])

	const getGroupName = useCallback(() => {
		return config.name
	}, [config.name])

	return {
		values: state.values,
		errors: state.errors,
		touched: state.touched,
		isValid: state.isValid,
		isDirty: state.isDirty,
		updateField,
		updateFields,
		setFieldError,
		clearFieldError,
		markFieldAsTouched,
		isFieldValid,
		isFieldTouched,
		getFieldError,
		validateGroup,
		resetGroup,
		getGroupValues,
		getGroupErrors,
		getGroupTouched,
		isGroupValid,
		isGroupDirty,
		getGroupName,
	}
}
