import {
	useState,
	useCallback,
	useRef,
	useEffect,
} from "react"

interface MapPickerConfig {
	initialLocation?: {
		lat: number
		lng: number
	}
	initialZoom?: number
	minZoom?: number
	maxZoom?: number
	bounds?: {
		north: number
		south: number
		east: number
		west: number
	}
	onLocationChange?: (location: {
		lat: number
		lng: number
	}) => void
	onValidationChange?: (isValid: boolean) => void
}

interface MapPickerState {
	location: {
		lat: number
		lng: number
	} | null
	zoom: number
	isDragging: boolean
	isValid: boolean
	error: string | null
}

const DEFAULT_CONFIG: Partial<MapPickerConfig> = {
	initialZoom: 13,
	minZoom: 3,
	maxZoom: 18,
	initialLocation: {
		lat: 0,
		lng: 0,
	},
}

export function useFieldMapPicker(
	config: MapPickerConfig,
) {
	const [state, setState] =
		useState<MapPickerState>({
			location: config.initialLocation || null,
			zoom:
				config.initialZoom ||
				DEFAULT_CONFIG.initialZoom!,
			isDragging: false,
			isValid: true,
			error: null,
		})
	const mapRef = useRef<google.maps.Map | null>(
		null,
	)
	const markerRef =
		useRef<google.maps.Marker | null>(null)

	const validateLocation = useCallback(
		(location: {
			lat: number
			lng: number
		}): boolean => {
			const { bounds } = config

			if (!location) {
				setState((prevState) => ({
					...prevState,
					isValid: false,
					error: "Location is required",
				}))
				return false
			}

			if (bounds) {
				if (
					location.lat < bounds.south ||
					location.lat > bounds.north ||
					location.lng < bounds.west ||
					location.lng > bounds.east
				) {
					setState((prevState) => ({
						...prevState,
						isValid: false,
						error:
							"Selected location is outside allowed bounds",
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
		},
		[config],
	)

	const initializeMap = useCallback(
		(element: HTMLElement) => {
			const mapOptions: google.maps.MapOptions = {
				center:
					state.location ||
					DEFAULT_CONFIG.initialLocation,
				zoom: state.zoom,
				minZoom: config.minZoom,
				maxZoom: config.maxZoom,
				restriction: config.bounds
					? {
							latLngBounds: {
								north: config.bounds.north,
								south: config.bounds.south,
								east: config.bounds.east,
								west: config.bounds.west,
							},
					  }
					: undefined,
			}

			const map = new google.maps.Map(
				element,
				mapOptions,
			)
			mapRef.current = map

			const marker = new google.maps.Marker({
				position:
					state.location ||
					DEFAULT_CONFIG.initialLocation,
				map: map,
				draggable: true,
			})
			markerRef.current = marker

			marker.addListener("dragend", () => {
				const position = marker.getPosition()
				if (position) {
					handleLocationChange({
						lat: position.lat(),
						lng: position.lng(),
					})
				}
			})

			map.addListener(
				"click",
				(event: google.maps.MapMouseEvent) => {
					if (event.latLng) {
						handleLocationChange({
							lat: event.latLng.lat(),
							lng: event.latLng.lng(),
						})
					}
				},
			)

			map.addListener("dragstart", () => {
				setState((prevState) => ({
					...prevState,
					isDragging: true,
				}))
			})

			map.addListener("dragend", () => {
				setState((prevState) => ({
					...prevState,
					isDragging: false,
				}))
			})

			map.addListener("zoom_changed", () => {
				if (mapRef.current) {
					setState((prevState) => ({
						...prevState,
						zoom:
							mapRef.current!.getZoom() ||
							DEFAULT_CONFIG.initialZoom!,
					}))
				}
			})
		},
		[config, state.location, state.zoom],
	)

	const handleLocationChange = useCallback(
		(location: { lat: number; lng: number }) => {
			const isValid = validateLocation(location)

			setState((prevState) => ({
				...prevState,
				location,
				isValid,
			}))

			if (markerRef.current) {
				markerRef.current.setPosition(location)
			}

			config.onLocationChange?.(location)
			config.onValidationChange?.(isValid)
		},
		[config, validateLocation],
	)

	const panToLocation = useCallback(
		(location: { lat: number; lng: number }) => {
			if (mapRef.current) {
				mapRef.current.panTo(location)
				mapRef.current.setCenter(location)
			}
		},
		[],
	)

	const setZoom = useCallback((zoom: number) => {
		if (mapRef.current) {
			mapRef.current.setZoom(zoom)
			setState((prevState) => ({
				...prevState,
				zoom,
			}))
		}
	}, [])

	const reset = useCallback(() => {
		if (mapRef.current && markerRef.current) {
			const initialLocation =
				config.initialLocation ||
				DEFAULT_CONFIG.initialLocation
			mapRef.current.setCenter(initialLocation)
			mapRef.current.setZoom(
				config.initialZoom ||
					DEFAULT_CONFIG.initialZoom!,
			)
			markerRef.current.setPosition(
				initialLocation,
			)
		}

		setState({
			location: config.initialLocation || null,
			zoom:
				config.initialZoom ||
				DEFAULT_CONFIG.initialZoom!,
			isDragging: false,
			isValid: true,
			error: null,
		})
	}, [config])

	const getMapProps = useCallback(() => {
		return {
			ref: mapRef,
			onLoad: (element: HTMLElement) =>
				initializeMap(element),
			"aria-invalid": !state.isValid,
			"aria-describedby": state.error
				? "map-picker-error"
				: undefined,
		}
	}, [state, initializeMap])

	return {
		location: state.location,
		zoom: state.zoom,
		isDragging: state.isDragging,
		isValid: state.isValid,
		error: state.error,
		handleLocationChange,
		panToLocation,
		setZoom,
		reset,
		getMapProps,
	}
}
