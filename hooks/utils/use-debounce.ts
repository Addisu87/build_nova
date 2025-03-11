import { useState, useEffect } from "react"

export function useDebounce<T>(
	value: T,
	delay: number,
): T {
	const [debouncedValue, setDebouncedValue] =
		useState<T>(value)

	useEffect(() => {
		// Set up the timeout to update the debounced value
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		// Clean up the timeout if the value changes again before the delay
		return () => {
			clearTimeout(timeoutId)
		}
	}, [value, delay])

	return debouncedValue
}
