import { useState, useCallback } from "react"

interface ColorPickerConfig {
	initialColor?: string
	format?: "hex" | "rgb" | "hsl"
	showAlpha?: boolean
	showInput?: boolean
	showSwatches?: boolean
	swatches?: string[]
	onColorChange?: (color: string) => void
	onValidationChange?: (isValid: boolean) => void
}

interface ColorPickerState {
	color: string
	displayValue: string
	isOpen: boolean
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<ColorPickerConfig> =
	{
		format: "hex",
		showAlpha: false,
		showInput: true,
		showSwatches: true,
		swatches: [
			"#000000",
			"#FFFFFF",
			"#FF0000",
			"#00FF00",
			"#0000FF",
			"#FFFF00",
			"#00FFFF",
			"#FF00FF",
		],
	}

export function useFieldColorPicker(
	config: ColorPickerConfig,
) {
	const [state, setState] =
		useState<ColorPickerState>({
			color: config.initialColor || "#000000",
			displayValue:
				config.initialColor || "#000000",
			isOpen: false,
			isValid: true,
			error: null,
		})

	const validateColor = useCallback(
		(color: string): boolean => {
			try {
				// Check if color is a valid hex color
				if (config.format === "hex") {
					const hexRegex =
						/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
					if (!hexRegex.test(color)) {
						setState((prevState) => ({
							...prevState,
							isValid: false,
							error: "Invalid hex color",
						}))
						return false
					}
				}
				// Check if color is a valid RGB color
				else if (config.format === "rgb") {
					const rgbRegex =
						/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/
					if (!rgbRegex.test(color)) {
						setState((prevState) => ({
							...prevState,
							isValid: false,
							error: "Invalid RGB color",
						}))
						return false
					}
				}
				// Check if color is a valid HSL color
				else if (config.format === "hsl") {
					const hslRegex =
						/^hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)$/
					if (!hslRegex.test(color)) {
						setState((prevState) => ({
							...prevState,
							isValid: false,
							error: "Invalid HSL color",
						}))
						return false
					}
				}

				setState((prevState) => ({
					...prevState,
					isValid: true,
					error: null,
				}))

				return true
			} catch (error) {
				console.error(
					"Failed to validate color:",
					error,
				)
				return false
			}
		},
		[config.format],
	)

	const handleColorChange = useCallback(
		(color: string) => {
			const isValid = validateColor(color)

			setState((prevState) => ({
				...prevState,
				color,
				displayValue: color,
				isValid,
			}))

			config.onColorChange?.(color)
			config.onValidationChange?.(isValid)
		},
		[config, validateColor],
	)

	const handleInputChange = useCallback(
		(
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const value = event.target.value
			handleColorChange(value)
		},
		[handleColorChange],
	)

	const toggleColorPicker = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			isOpen: !prevState.isOpen,
		}))
	}, [])

	const reset = useCallback(() => {
		setState({
			color: config.initialColor || "#000000",
			displayValue:
				config.initialColor || "#000000",
			isOpen: false,
			isValid: true,
			error: null,
		})
	}, [config])

	const getInputProps = useCallback(() => {
		return {
			value: state.displayValue,
			onChange: handleInputChange,
			onClick: toggleColorPicker,
			"aria-expanded": state.isOpen,
			"aria-controls": "color-picker-dropdown",
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "color-picker-error"
				: undefined,
		}
	}, [
		state,
		handleInputChange,
		toggleColorPicker,
	])

	const getColorPickerProps = useCallback(() => {
		return {
			color: state.color,
			format: config.format,
			showAlpha: config.showAlpha,
			showInput: config.showInput,
			showSwatches: config.showSwatches,
			swatches: config.swatches,
			onChange: handleColorChange,
			isOpen: state.isOpen,
			onClose: () =>
				setState((prevState) => ({
					...prevState,
					isOpen: false,
				})),
		}
	}, [state, config, handleColorChange])

	return {
		color: state.color,
		displayValue: state.displayValue,
		isOpen: state.isOpen,
		isValid: state.isValid,
		error: state.error,
		handleColorChange,
		handleInputChange,
		toggleColorPicker,
		reset,
		getInputProps,
		getColorPickerProps,
	}
}
