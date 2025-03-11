import {
	useState,
	useEffect,
	useRef,
} from "react"

export function useMemoize<T>(
	value: T,
	dependencies: any[],
): T {
	const [memoizedValue, setMemoizedValue] =
		useState<T>(value)
	const prevDeps = useRef<any[]>(dependencies)

	useEffect(() => {
		const hasChanged = dependencies.some(
			(dep, index) =>
				dep !== prevDeps.current[index],
		)

		if (hasChanged) {
			setMemoizedValue(value)
			prevDeps.current = dependencies
		}
	}, [value, dependencies])

	return memoizedValue
}

export function useMemoizeCallback<
	T extends (...args: any[]) => any,
>(callback: T, dependencies: any[]): T {
	const callbackRef = useRef<T>(callback)
	const prevDeps = useRef<any[]>(dependencies)

	useEffect(() => {
		const hasChanged = dependencies.some(
			(dep, index) =>
				dep !== prevDeps.current[index],
		)

		if (hasChanged) {
			callbackRef.current = callback
			prevDeps.current = dependencies
		}
	}, [callback, dependencies])

	return callbackRef.current
}
