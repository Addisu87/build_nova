import {
	useState,
	useCallback,
	useEffect,
} from "react"
import { z } from "zod"

interface ValidationState<T> {
	values: T
	errors: Partial<Record<keyof T, string>>
	touched: Partial<Record<keyof T, boolean>>
	isValid: boolean
	isSubmitting: boolean
	isDirty: boolean
}

interface ValidationConfig<T> {
	initialValues: T
	validationSchema: z.ZodSchema<T>
	onSubmit: (values: T) => Promise<void> | void
	validateOnChange?: boolean
	validateOnBlur?: boolean
}

export function useFormValidation<
	T extends Record<string, any>,
>(config: ValidationConfig<T>) {
	const [state, setState] = useState<
		ValidationState<T>
	>({
		values: config.initialValues,
		errors: {},
		touched: {},
		isValid: false,
		isSubmitting: false,
		isDirty: false,
	})

	const validateField = useCallback(
		(field: keyof T, value: any) => {
			try {
				const fieldSchema =
					config.validationSchema.shape[
						field as string
					]
				fieldSchema.parse(value)
				return undefined
			} catch (error) {
				if (error instanceof z.ZodError) {
					return error.errors[0].message
				}
				return "Invalid value"
			}
		},
		[config.validationSchema],
	)

	const validateForm = useCallback(() => {
		try {
			config.validationSchema.parse(state.values)
			setState((prevState) => ({
				...prevState,
				errors: {},
				isValid: true,
			}))
			return true
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors: Partial<
					Record<keyof T, string>
				> = {}
				error.errors.forEach((err) => {
					const path = err.path[0] as keyof T
					errors[path] = err.message
				})
				setState((prevState) => ({
					...prevState,
					errors,
					isValid: false,
				}))
			}
			return false
		}
	}, [config.validationSchema, state.values])

	const handleChange = useCallback(
		(field: keyof T, value: any) => {
			setState((prevState) => {
				const newValues = {
					...prevState.values,
					[field]: value,
				}
				const errors = config.validateOnChange
					? {
							...prevState.errors,
							[field]: validateField(
								field,
								value,
							),
					  }
					: prevState.errors

				return {
					...prevState,
					values: newValues,
					errors,
					isDirty: true,
				}
			})
		},
		[config.validateOnChange, validateField],
	)

	const handleBlur = useCallback(
		(field: keyof T) => {
			setState((prevState) => {
				const errors = config.validateOnBlur
					? {
							...prevState.errors,
							[field]: validateField(
								field,
								prevState.values[field],
							),
					  }
					: prevState.errors

				return {
					...prevState,
					touched: {
						...prevState.touched,
						[field]: true,
					},
					errors,
				}
			})
		},
		[config.validateOnBlur, validateField],
	)

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault()

			if (!validateForm()) {
				return
			}

			setState((prevState) => ({
				...prevState,
				isSubmitting: true,
			}))

			try {
				await config.onSubmit(state.values)
			} catch (error) {
				console.error(
					"Form submission error:",
					error,
				)
			} finally {
				setState((prevState) => ({
					...prevState,
					isSubmitting: false,
				}))
			}
		},
		[config.onSubmit, state.values, validateForm],
	)

	const resetForm = useCallback(() => {
		setState({
			values: config.initialValues,
			errors: {},
			touched: {},
			isValid: false,
			isSubmitting: false,
			isDirty: false,
		})
	}, [config.initialValues])

	const setFieldValue = useCallback(
		(field: keyof T, value: any) => {
			handleChange(field, value)
		},
		[handleChange],
	)

	const setFieldError = useCallback(
		(field: keyof T, error: string) => {
			setState((prevState) => ({
				...prevState,
				errors: {
					...prevState.errors,
					[field]: error,
				},
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
				}
			})
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

	return {
		...state,
		handleChange,
		handleBlur,
		handleSubmit,
		resetForm,
		setFieldValue,
		setFieldError,
		clearFieldError,
		isFieldValid,
		isFieldTouched,
		getFieldError,
		validateForm,
	}
}
