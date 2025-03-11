import { useState, useCallback } from "react"

interface RatingPickerConfig {
	initialRating?: number
	maxRating?: number
	step?: number
	allowHalf?: boolean
	readonly?: boolean
	onRatingChange?: (rating: number) => void
	onValidationChange?: (isValid: boolean) => void
}

interface RatingPickerState {
	rating: number
	hoveredRating: number | null
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<RatingPickerConfig> =
	{
		maxRating: 5,
		step: 1,
		allowHalf: false,
		readonly: false,
	}

export function useFieldRating(
	config: RatingPickerConfig,
) {
	const [state, setState] =
		useState<RatingPickerState>({
			rating: config.initialRating || 0,
			hoveredRating: null,
			isValid: true,
			error: null,
		})

	const validateRating = useCallback(
		(rating: number): boolean => {
			const { maxRating } = config

			if (rating < 0) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: "Rating cannot be negative",
				}))
				return false
			}

			if (maxRating && rating > maxRating) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: `Rating cannot exceed ${maxRating}`,
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

	const handleRatingChange = useCallback(
		(rating: number) => {
			if (config.readonly) {
				return
			}

			const isValid = validateRating(rating)

			setState((prevState) => ({
				...prevState,
				rating,
				isValid,
			}))

			config.onRatingChange?.(rating)
			config.onValidationChange?.(isValid)
		},
		[config, validateRating],
	)

	const handleHover = useCallback(
		(rating: number | null) => {
			if (config.readonly) {
				return
			}

			setState((prevState) => ({
				...prevState,
				hoveredRating: rating,
			}))
		},
		[config],
	)

	const handleClick = useCallback(
		(rating: number) => {
			if (config.readonly) {
				return
			}

			handleRatingChange(rating)
		},
		[config, handleRatingChange],
	)

	const reset = useCallback(() => {
		setState({
			rating: config.initialRating || 0,
			hoveredRating: null,
			isValid: true,
			error: null,
		})
	}, [config])

	const getRatingProps = useCallback(() => {
		return {
			rating: state.rating,
			hoveredRating: state.hoveredRating,
			maxRating: config.maxRating,
			step: config.step,
			allowHalf: config.allowHalf,
			readonly: config.readonly,
			onHover: handleHover,
			onClick: handleClick,
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "rating-picker-error"
				: undefined,
			"aria-label": "Rating",
			"aria-valuemin": 0,
			"aria-valuemax": config.maxRating,
			"aria-valuenow": state.rating,
		}
	}, [state, config, handleHover, handleClick])

	const getStarProps = useCallback(
		(index: number) => {
			const rating =
				state.hoveredRating !== null
					? state.hoveredRating
					: state.rating
			const isHalf =
				config.allowHalf && rating % 1 !== 0
			const isFilled = rating >= index + 1
			const isHalfFilled =
				isHalf && rating === index + 0.5

			return {
				isFilled,
				isHalfFilled,
				onClick: () => handleClick(index + 1),
				onMouseEnter: () =>
					handleHover(index + 1),
				onMouseLeave: () => handleHover(null),
				"aria-hidden": true,
			}
		},
		[state, config, handleClick, handleHover],
	)

	return {
		rating: state.rating,
		hoveredRating: state.hoveredRating,
		isValid: state.isValid,
		error: state.error,
		handleRatingChange,
		handleHover,
		handleClick,
		reset,
		getRatingProps,
		getStarProps,
	}
}
