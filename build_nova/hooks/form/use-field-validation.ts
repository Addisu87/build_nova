import { useState, useCallback } from "react"
import { z } from "zod"

interface ValidationRule {
	schema: z.ZodSchema<any>
	message?: string
	trigger?: "onChange" | "onBlur" | "onSubmit"
}

interface ValidationConfig {
	rules: Record<string, ValidationRule>
	validateOnChange?: boolean
	validateOnBlur?: boolean
	validateOnSubmit?: boolean
	onValidationChange?: (
		field: string,
		isValid: boolean,
	) => void
}

export function useFieldValidation(
	config: ValidationConfig,
) {
	const [state, setState] = useState<{
		errors: Record<string, string>
		touched: Record<string, boolean>
		isValid: boolean
	}>({
		errors: {},
		touched: {},
		isValid: true,
	})

	const validateField = useCallback(
		(
			field: string,
			value: any,
			trigger: ValidationRule["trigger"] = "onChange",
		) => {
			const rule = config.rules[field]
			if (!rule) {
				return true
			}

			if (
				rule.trigger &&
				rule.trigger !== trigger
			) {
				return true
			}

			try {
				rule.schema.parse(value)
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
				return true
			} catch (error) {
				if (error instanceof z.ZodError) {
					const errorMessage =
						rule.message ||
						error.errors[0].message
					setState((prevState) => ({
						...prevState,
						errors: {
							...prevState.errors,
							[field]: errorMessage,
						},
						isValid: false,
					}))
				}
				return false
			}
		},
		[config.rules],
	)

	const validateFields = useCallback(
		(
			values: Record<string, any>,
			trigger: ValidationRule["trigger"] = "onSubmit",
		) => {
			let isValid = true
			const errors: Record<string, string> = {}

			Object.entries(values).forEach(
				([field, value]) => {
					const rule = config.rules[field]
					if (!rule) {
						return
					}

					if (
						rule.trigger &&
						rule.trigger !== trigger
					) {
						return
					}

					try {
						rule.schema.parse(value)
					} catch (error) {
						if (error instanceof z.ZodError) {
							errors[field] =
								rule.message ||
								error.errors[0].message
							isValid = false
						}
					}
				},
			)

			setState((prevState) => ({
				...prevState,
				errors,
				isValid,
			}))

			return isValid
		},
		[config.rules],
	)

	const setFieldError = useCallback(
		(field: string, error: string) => {
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
		(field: string) => {
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
		(field: string) => {
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
		(field: string) => {
			return !state.errors[field]
		},
		[state.errors],
	)

	const isFieldTouched = useCallback(
		(field: string) => {
			return !!state.touched[field]
		},
		[state.touched],
	)

	const getFieldError = useCallback(
		(field: string) => {
			return state.errors[field]
		},
		[state.errors],
	)

	const resetValidation = useCallback(() => {
		setState({
			errors: {},
			touched: {},
			isValid: true,
		})
	}, [])

	const getValidationState = useCallback(() => {
		return {
			errors: state.errors,
			touched: state.touched,
			isValid: state.isValid,
		}
	}, [state])

	const getInvalidFields = useCallback(() => {
		return Object.keys(state.errors)
	}, [state.errors])

	const getTouchedFields = useCallback(() => {
		return Object.keys(state.touched)
	}, [state.touched])

	return {
		errors: state.errors,
		touched: state.touched,
		isValid: state.isValid,
		validateField,
		validateFields,
		setFieldError,
		clearFieldError,
		markFieldAsTouched,
		isFieldValid,
		isFieldTouched,
		getFieldError,
		resetValidation,
		getValidationState,
		getInvalidFields,
		getTouchedFields,
	}
}
