import { useState, useCallback } from "react"

interface FieldArrayConfig<T> {
	initialValues: T[]
	validateItem?: (
		item: T,
	) => boolean | Promise<boolean>
	onAdd?: (item: T) => void
	onRemove?: (index: number) => void
	onUpdate?: (index: number, item: T) => void
	onReorder?: (
		fromIndex: number,
		toIndex: number,
	) => void
}

export function useFieldArray<T>(
	config: FieldArrayConfig<T>,
) {
	const [state, setState] = useState<{
		values: T[]
		errors: Record<number, string>
		touched: Record<number, boolean>
		isDirty: boolean
	}>({
		values: config.initialValues,
		errors: {},
		touched: {},
		isDirty: false,
	})

	const addItem = useCallback(
		async (item: T) => {
			if (config.validateItem) {
				const isValid = await config.validateItem(
					item,
				)
				if (!isValid) {
					throw new Error("Invalid item")
				}
			}

			setState((prevState) => ({
				...prevState,
				values: [...prevState.values, item],
				isDirty: true,
			}))

			config.onAdd?.(item)
		},
		[config],
	)

	const removeItem = useCallback(
		(index: number) => {
			setState((prevState) => {
				const newValues = [...prevState.values]
				newValues.splice(index, 1)

				const newErrors = { ...prevState.errors }
				delete newErrors[index]

				const newTouched = {
					...prevState.touched,
				}
				delete newTouched[index]

				return {
					...prevState,
					values: newValues,
					errors: newErrors,
					touched: newTouched,
					isDirty: true,
				}
			})

			config.onRemove?.(index)
		},
		[config],
	)

	const updateItem = useCallback(
		async (index: number, item: T) => {
			if (config.validateItem) {
				const isValid = await config.validateItem(
					item,
				)
				if (!isValid) {
					throw new Error("Invalid item")
				}
			}

			setState((prevState) => {
				const newValues = [...prevState.values]
				newValues[index] = item

				return {
					...prevState,
					values: newValues,
					touched: {
						...prevState.touched,
						[index]: true,
					},
					isDirty: true,
				}
			})

			config.onUpdate?.(index, item)
		},
		[config],
	)

	const reorderItems = useCallback(
		(fromIndex: number, toIndex: number) => {
			setState((prevState) => {
				const newValues = [...prevState.values]
				const [movedItem] = newValues.splice(
					fromIndex,
					1,
				)
				newValues.splice(toIndex, 0, movedItem)

				return {
					...prevState,
					values: newValues,
					isDirty: true,
				}
			})

			config.onReorder?.(fromIndex, toIndex)
		},
		[config],
	)

	const setItemError = useCallback(
		(index: number, error: string) => {
			setState((prevState) => ({
				...prevState,
				errors: {
					...prevState.errors,
					[index]: error,
				},
			}))
		},
		[],
	)

	const clearItemError = useCallback(
		(index: number) => {
			setState((prevState) => {
				const newErrors = { ...prevState.errors }
				delete newErrors[index]
				return {
					...prevState,
					errors: newErrors,
				}
			})
		},
		[],
	)

	const markItemAsTouched = useCallback(
		(index: number) => {
			setState((prevState) => ({
				...prevState,
				touched: {
					...prevState.touched,
					[index]: true,
				},
			}))
		},
		[],
	)

	const isItemValid = useCallback(
		(index: number) => {
			return !state.errors[index]
		},
		[state.errors],
	)

	const isItemTouched = useCallback(
		(index: number) => {
			return !!state.touched[index]
		},
		[state.touched],
	)

	const getItemError = useCallback(
		(index: number) => {
			return state.errors[index]
		},
		[state.errors],
	)

	const resetArray = useCallback(() => {
		setState({
			values: config.initialValues,
			errors: {},
			touched: {},
			isDirty: false,
		})
	}, [config.initialValues])

	const validateArray = useCallback(async () => {
		if (!config.validateItem) {
			return true
		}

		const errors: Record<number, string> = {}
		let isValid = true

		for (
			let i = 0;
			i < state.values.length;
			i++
		) {
			const isValidItem =
				await config.validateItem(state.values[i])
			if (!isValidItem) {
				errors[i] = "Invalid item"
				isValid = false
			}
		}

		setState((prevState) => ({
			...prevState,
			errors,
		}))

		return isValid
	}, [config.validateItem, state.values])

	return {
		values: state.values,
		errors: state.errors,
		touched: state.touched,
		isDirty: state.isDirty,
		addItem,
		removeItem,
		updateItem,
		reorderItems,
		setItemError,
		clearItemError,
		markItemAsTouched,
		isItemValid,
		isItemTouched,
		getItemError,
		resetArray,
		validateArray,
	}
}
