import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase/db"
import { useAuth } from "./use-auth"

type Review =
	Database["public"]["Tables"]["reviews"]["Row"] & {
		user: {
			name: string
			avatar_url: string | null
		}
	}

interface ReviewStats {
	averageRating: number
	totalReviews: number
	ratingDistribution: {
		[key: number]: number
	}
}

export function usePropertyReviews(
	propertyId: string,
) {
	const { user } = useAuth()
	const [reviews, setReviews] = useState<
		Review[]
	>([])
	const [stats, setStats] = useState<ReviewStats>(
		{
			averageRating: 0,
			totalReviews: 0,
			ratingDistribution: {},
		},
	)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] =
		useState<Error | null>(null)

	useEffect(() => {
		async function fetchReviews() {
			try {
				setIsLoading(true)
				const { data, error: fetchError } =
					await supabase
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

				setReviews(data || [])
				calculateStats(data || [])
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error(
								"Failed to fetch reviews",
						  ),
				)
				toast.error("Failed to load reviews")
			} finally {
				setIsLoading(false)
			}
		}

		if (propertyId) {
			fetchReviews()
		}
	}, [propertyId])

	const calculateStats = (reviews: Review[]) => {
		const totalReviews = reviews.length
		const ratingDistribution: {
			[key: number]: number
		} = {}
		let totalRating = 0

		reviews.forEach((review) => {
			const rating = review.rating
			ratingDistribution[rating] =
				(ratingDistribution[rating] || 0) + 1
			totalRating += rating
		})

		const averageRating =
			totalReviews > 0
				? totalRating / totalReviews
				: 0

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
			toast.error(
				"Please sign in to leave a review",
			)
			throw new Error("User not authenticated")
		}

		try {
			setIsLoading(true)
			const { data, error: createError } =
				await supabase
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

			setReviews([data, ...reviews])
			calculateStats([data, ...reviews])
			toast.success(
				"Review submitted successfully",
			)
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to create review"),
			)
			toast.error("Failed to submit review")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const updateReview = async (
		reviewId: string,
		updates: Partial<
			Database["public"]["Tables"]["reviews"]["Row"]
		>,
	) => {
		try {
			setIsLoading(true)
			const { data, error: updateError } =
				await supabase
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

			setReviews(
				reviews.map((review) =>
					review.id === reviewId ? data : review,
				),
			)
			calculateStats(
				reviews.map((review) =>
					review.id === reviewId ? data : review,
				),
			)
			toast.success("Review updated successfully")
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to update review"),
			)
			toast.error("Failed to update review")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteReview = async (
		reviewId: string,
	) => {
		try {
			setIsLoading(true)
			const { error: deleteError } =
				await supabase
					.from("reviews")
					.delete()
					.eq("id", reviewId)

			if (deleteError) {
				throw deleteError
			}

			setReviews(
				reviews.filter(
					(review) => review.id !== reviewId,
				),
			)
			calculateStats(
				reviews.filter(
					(review) => review.id !== reviewId,
				),
			)
			toast.success("Review deleted successfully")
		} catch (err) {
			setError(
				err instanceof Error
					? err
					: new Error("Failed to delete review"),
			)
			toast.error("Failed to delete review")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		reviews,
		stats,
		isLoading,
		error,
		createReview,
		updateReview,
		deleteReview,
	}
}
