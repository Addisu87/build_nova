import {
	useState,
	useCallback,
	useEffect,
} from "react"

interface DependencyRule {
	field: string
	condition: (value: any) => boolean
	action:
		| "show"
		| "hide"
		| "enable"
		| "disable"
		| "require"
		| "optional"
}

interface DependencyConfig {
	rules: DependencyRule[]
	initialValues: Record<string, any>
	onDependencyChange?: (
		field: string,
		action: DependencyRule["action"],
	) => void
}

export function useFieldDependencies(
	config: DependencyConfig,
) {
	const [state, setState] = useState<{
		values: Record<string, any>
		dependencies: Record<string, boolean>
		visibility: Record<string, boolean>
		enabled: Record<string, boolean>
		required: Record<string, boolean>
	}>({
		values: config.initialValues,
		dependencies: {},
		visibility: {},
		enabled: {},
		required: {},
	})

	const evaluateDependencies = useCallback(() => {
		const newDependencies: Record<
			string,
			boolean
		> = {}
		const newVisibility: Record<string, boolean> =
			{}
		const newEnabled: Record<string, boolean> = {}
		const newRequired: Record<string, boolean> =
			{}

		// Initialize all fields as visible, enabled, and optional
		Object.keys(config.initialValues).forEach(
			(field) => {
				newVisibility[field] = true
				newEnabled[field] = true
				newRequired[field] = false
			},
		)

		// Evaluate each dependency rule
		config.rules.forEach((rule) => {
			const { field, condition, action } = rule
			const isConditionMet = condition(
				state.values[rule.field],
			)

			newDependencies[field] = isConditionMet

			switch (action) {
				case "show":
					newVisibility[field] = isConditionMet
					break
				case "hide":
					newVisibility[field] = !isConditionMet
					break
				case "enable":
					newEnabled[field] = isConditionMet
					break
				case "disable":
					newEnabled[field] = !isConditionMet
					break
				case "require":
					newRequired[field] = isConditionMet
					break
				case "optional":
					newRequired[field] = !isConditionMet
					break
			}
		})

		setState((prevState) => ({
			...prevState,
			dependencies: newDependencies,
			visibility: newVisibility,
			enabled: newEnabled,
			required: newRequired,
		}))

		// Notify parent of dependency changes
		Object.entries(newDependencies).forEach(
			([field, isDependent]) => {
				if (isDependent) {
					config.onDependencyChange?.(
						field,
						config.rules.find(
							(r) => r.field === field,
						)?.action || "show",
					)
				}
			},
		)
	}, [config, state.values])

	// Re-evaluate dependencies when values change
	useEffect(() => {
		evaluateDependencies()
	}, [state.values, evaluateDependencies])

	const updateValue = useCallback(
		(field: string, value: any) => {
			setState((prevState) => ({
				...prevState,
				values: {
					...prevState.values,
					[field]: value,
				},
			}))
		},
		[],
	)

	const isFieldVisible = useCallback(
		(field: string) => {
			return state.visibility[field] ?? true
		},
		[state.visibility],
	)

	const isFieldEnabled = useCallback(
		(field: string) => {
			return state.enabled[field] ?? true
		},
		[state.enabled],
	)

	const isFieldRequired = useCallback(
		(field: string) => {
			return state.required[field] ?? false
		},
		[state.required],
	)

	const isFieldDependent = useCallback(
		(field: string) => {
			return state.dependencies[field] ?? false
		},
		[state.dependencies],
	)

	const getDependentFields = useCallback(
		(field: string) => {
			return config.rules
				.filter((rule) => rule.field === field)
				.map((rule) => rule.field)
		},
		[config.rules],
	)

	const getFieldDependencies = useCallback(
		(field: string) => {
			return config.rules
				.filter((rule) => rule.field === field)
				.map((rule) => ({
					field: rule.field,
					condition: rule.condition,
					action: rule.action,
				}))
		},
		[config.rules],
	)

	const resetDependencies = useCallback(() => {
		setState((prevState) => ({
			...prevState,
			values: config.initialValues,
			dependencies: {},
			visibility: {},
			enabled: {},
			required: {},
		}))
	}, [config.initialValues])

	return {
		values: state.values,
		updateValue,
		isFieldVisible,
		isFieldEnabled,
		isFieldRequired,
		isFieldDependent,
		getDependentFields,
		getFieldDependencies,
		resetDependencies,
	}
}
