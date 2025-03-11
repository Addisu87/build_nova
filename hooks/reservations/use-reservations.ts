import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import {
	getReservations,
	createReservation,
	updateReservation,
	deleteReservation,
} from "@/lib/supabase/db"
import { useAuth } from "./use-auth"

type Reservation =
	Database["public"]["Tables"]["reservations"]["Row"] & {
		property: Database["public"]["Tables"]["properties"]["Row"]
	}

export function useReservations() {
	const router = useRouter()
	const { user } = useAuth()
	const [reservations, setReservations] =
		useState<Reservation[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] =
		useState<Error | null>(null)

	useEffect(() => {
		async function fetchReservations() {
			if (!user) {
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				const data = await getReservations(
					user.id,
				)
				setReservations(data)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error(
								"Failed to fetch reservations",
						  ),
				)
				toast.error("Failed to load reservations")
			} finally {
				setIsLoading(false)
			}
		}

		fetchReservations()
	}, [user])

	const createNewReservation = async (
		reservation: Omit<
			Database["public"]["Tables"]["reservations"]["Row"],
			"id" | "created_at" | "user_id"
		>,
	) => {
		if (!user) {
			toast.error(
				"Please sign in to make a reservation",
			)
			router.push("/login")
			return
		}

		try {
			setIsLoading(true)
			const newReservation =
				await createReservation({
					...reservation,
					user_id: user.id,
				})
			setReservations([
				...reservations,
				newReservation,
			])
			toast.success(
				"Reservation created successfully",
			)
			router.refresh()
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to create reservation",
					  ),
			)
			toast.error("Failed to create reservation")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const updateExistingReservation = async (
		id: string,
		updates: Partial<
			Database["public"]["Tables"]["reservations"]["Row"]
		>,
	) => {
		try {
			setIsLoading(true)
			const updatedReservation =
				await updateReservation(id, updates)
			setReservations(
				reservations.map((reservation) =>
					reservation.id === id
						? updatedReservation
						: reservation,
				),
			)
			toast.success(
				"Reservation updated successfully",
			)
			router.refresh()
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to update reservation",
					  ),
			)
			toast.error("Failed to update reservation")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const cancelReservation = async (
		id: string,
	) => {
		try {
			setIsLoading(true)
			await deleteReservation(id)
			setReservations(
				reservations.filter(
					(reservation) => reservation.id !== id,
				),
			)
			toast.success(
				"Reservation cancelled successfully",
			)
			router.refresh()
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error(
							"Failed to cancel reservation",
					  ),
			)
			toast.error("Failed to cancel reservation")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		reservations,
		isLoading,
		error,
		createReservation: createNewReservation,
		updateReservation: updateExistingReservation,
		cancelReservation,
	}
}
