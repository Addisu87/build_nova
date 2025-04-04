import { supabase } from "@/lib/supabase/client"
import { Database } from "@/types/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Reservation = Database["public"]["Tables"]["reservations"]["Row"]

interface AvailabilityCheck {
	startDate: string
	endDate: string
	isAvailable: boolean
}

export function usePropertyAvailability(propertyId: string) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [reservations, setReservations] = useState<Reservation[]>([])

	useEffect(() => {
		async function fetchReservations() {
			try {
				setIsLoading(true)
				const { data, error: fetchError } = await supabase
					.from("reservations")
					.select("*")
					.eq("property_id", propertyId)
					.eq("status", "confirmed")
					.order("start_date", {
						ascending: true,
					})

				if (fetchError) {
					throw fetchError
				}

				setReservations(data || [])
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Failed to fetch reservations"))
				toast.error("Failed to load property availability")
			} finally {
				setIsLoading(false)
			}
		}

		if (propertyId) {
			fetchReservations()
		}
	}, [propertyId])

	const checkAvailability = async (
		startDate: string,
		endDate: string,
	): Promise<boolean> => {
		try {
			setIsLoading(true)
			setError(null)

			// Check for overlapping reservations
			const { data, error: checkError } = await supabase
				.from("reservations")
				.select("*")
				.eq("property_id", propertyId)
				.eq("status", "confirmed")
				.or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

			if (checkError) {
				throw checkError
			}

			return data.length === 0
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to check availability"))
			toast.error("Failed to check property availability")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const getAvailableDates = (): Date[] => {
		const today = new Date()
		const availableDates: Date[] = []
		const reservationsByDate = new Map<string, Reservation>()

		// Create a map of reserved dates
		reservations.forEach((reservation) => {
			const start = new Date(reservation.start_date)
			const end = new Date(reservation.end_date)
			let current = new Date(start)

			while (current <= end) {
				reservationsByDate.set(current.toISOString().split("T")[0], reservation)
				current.setDate(current.getDate() + 1)
			}
		})

		// Check next 30 days for availability
		for (let i = 0; i < 30; i++) {
			const date = new Date(today)
			date.setDate(date.getDate() + i)
			const dateString = date.toISOString().split("T")[0]

			if (!reservationsByDate.has(dateString)) {
				availableDates.push(new Date(date))
			}
		}

		return availableDates
	}

	const getNextAvailablePeriod = (
		duration: number,
	): {
		startDate: string
		endDate: string
	} | null => {
		const availableDates = getAvailableDates()
		if (availableDates.length < duration) {
			return null
		}

		// Find the first continuous period of available dates
		for (let i = 0; i <= availableDates.length - duration; i++) {
			const startDate = availableDates[i]
			const endDate = new Date(startDate)
			endDate.setDate(endDate.getDate() + duration - 1)

			// Check if all dates in the period are available
			let isPeriodAvailable = true
			for (let j = 0; j < duration; j++) {
				const currentDate = new Date(startDate)
				currentDate.setDate(currentDate.getDate() + j)
				const dateString = currentDate.toISOString().split("T")[0]

				if (
					!availableDates.some(
						(date) => date.toISOString().split("T")[0] === dateString,
					)
				) {
					isPeriodAvailable = false
					break
				}
			}

			if (isPeriodAvailable) {
				return {
					startDate: startDate.toISOString().split("T")[0],
					endDate: endDate.toISOString().split("T")[0],
				}
			}
		}

		return null
	}

	return {
		isLoading,
		error,
		reservations,
		checkAvailability,
		getAvailableDates,
		getNextAvailablePeriod,
	}
}
