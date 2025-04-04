import { useAuth } from "@/contexts/auth-context"
import { useAsyncOperation } from "@/hooks/utils/use-async-operation"
import { supabase } from "@/lib/supabase/client"
import { Review, ReviewStats, ReviewWithUser } from "@/types"
import { Database } from "@/types/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function usePropertyReviews(propertyId: string) {
	const { user, isLoading: authLoading } = useAuth()
	const [reviews, setReviews] = useState<ReviewWithUser[]>([])
	const [stats, setStats] = useState<ReviewStats>({
		averageRating: 0,
		totalReviews: 0,
		ratingDistribution: {},
	})

	const fetchOperation = useAsyncOperation<ReviewWithUser[]>()
	const createOperation = useAsyncOperation<ReviewWithUser>()
	const updateOperation = useAsyncOperation<ReviewWithUser>()
	const deleteOperation = useAsyncOperation<void>()

	useEffect(() => {
		async function fetchReviews() {
			if (!propertyId) return

			const result = await fetchOperation.execute(
				async () => {
					const { data, error: fetchError } = await supabase
						.from("reviews")
						.select(
							`
								*,
								user:profiles (
								name,
								avatar_url
								)
							`,
						)
						.eq("property_id", propertyId)
						.order("created_at", {
							ascending: false,
						})

					if (fetchError) {
						throw fetchError
					}

					return data || []
				},
				{
					errorMessage: "Failed to load reviews",
				},
			)

			if (result) {
				setReviews(result)
				calculateStats(result)
			}
		}

		fetchReviews()
	}, [propertyId, fetchOperation])

	const calculateStats = (reviews: ReviewWithUser[]) => {
		const totalReviews = reviews.length
		const ratingDistribution: {
			[key: number]: number
		} = {}
		let totalRating = 0

		reviews.forEach((review) => {
			const rating = review.rating
			ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1
			totalRating += rating
		})

		const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

		setStats({
			averageRating,
			totalReviews,
			ratingDistribution,
		})
	}

	const createReview = async (
		review: Omit<
			Database["public"]["Tables"]["reviews"]["Row"],
			"id" | "created_at" | "user_id"
		>,
	) => {
		if (!user) {
			toast.error("Please sign in to leave a review")
			throw new Error("User not authenticated")
		}

		const result = await createOperation.execute(
			async () => {
				const { data, error: createError } = await supabase
					.from("reviews")
					.insert({
						...review,
						user_id: user.id,
						property_id: propertyId,
					})
					.select(
						`
          *,
          user:profiles (
            name,
            avatar_url
          )
        `,
					)
					.single()

				if (createError) {
					throw createError
				}

				return data
			},
			{
				errorMessage: "Failed to submit review",
				successMessage: "Review submitted successfully",
			},
		)

		if (result) {
			setReviews([result, ...reviews])
			calculateStats([result, ...reviews])
		}

		return result
	}

	const updateReview = async (
		reviewId: string,
		updates: Partial<Pick<Review, "rating" | "comment">>,
	) => {
		const result = await updateOperation.execute(
			async () => {
				const { data, error: updateError } = await supabase
					.from("reviews")
					.update(updates)
					.eq("id", reviewId)
					.select(
						`
          *,
          user:profiles (
            name,
            avatar_url
          )
        `,
					)
					.single()

				if (updateError) {
					throw updateError
				}

				return data
			},
			{
				errorMessage: "Failed to update review",
				successMessage: "Review updated successfully",
			},
		)

		if (result) {
			setReviews(reviews.map((review) => (review.id === reviewId ? result : review)))
			calculateStats(
				reviews.map((review) => (review.id === reviewId ? result : review)),
			)
		}

		return result
	}

	const deleteReview = async (reviewId: string) => {
		const success = await deleteOperation.execute(
			async () => {
				const { error: deleteError } = await supabase
					.from("reviews")
					.delete()
					.eq("id", reviewId)

				if (deleteError) {
					throw deleteError
				}
			},
			{
				errorMessage: "Failed to delete review",
				successMessage: "Review deleted successfully",
			},
		)

		if (success !== null) {
			const updatedReviews = reviews.filter((review) => review.id !== reviewId)
			setReviews(updatedReviews)
			calculateStats(updatedReviews)
		}
	}

	return {
		reviews,
		stats,
		isLoading:
			fetchOperation.isLoading ||
			createOperation.isLoading ||
			updateOperation.isLoading ||
			deleteOperation.isLoading ||
			authLoading,
		error:
			fetchOperation.error ||
			createOperation.error ||
			updateOperation.error ||
			deleteOperation.error,
		createReview,
		updateReview,
		deleteReview,
	}
}
