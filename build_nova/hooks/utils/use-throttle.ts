import {
	useState,
	useEffect,
	useRef,
} from "react"

export function useThrottle<T>(
	value: T,
	limit: number,
): T {
	const [throttledValue, setThrottledValue] =
		useState<T>(value)
	const lastRan = useRef<number>(Date.now())

	useEffect(() => {
		const now = Date.now()
		const timeSinceLastRun = now - lastRan.current

		if (timeSinceLastRun >= limit) {
			setThrottledValue(value)
			lastRan.current = now
		}
	}, [value, limit])

	return throttledValue
}
