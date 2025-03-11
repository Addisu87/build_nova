import { useState, useEffect } from "react"
import {
	useRouter,
	useSearchParams,
} from "next/navigation"
import { toast } from "react-hot-toast"

export interface PaginationState {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
}

const DEFAULT_PAGINATION: PaginationState = {
	currentPage: 1,
	totalPages: 1,
	totalItems: 0,
	itemsPerPage: 12,
}

export function usePropertyPagination() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [pagination, setPagination] =
		useState<PaginationState>(DEFAULT_PAGINATION)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Parse search params into pagination state
		const newPagination: PaginationState = {
			...DEFAULT_PAGINATION,
		}

		// Current page
		const page = searchParams.get("page")
		if (page) {
			const parsedPage = parseInt(page)
			if (!isNaN(parsedPage) && parsedPage > 0) {
				newPagination.currentPage = parsedPage
			}
		}

		// Items per page
		const perPage = searchParams.get("perPage")
		if (perPage) {
			const parsedPerPage = parseInt(perPage)
			if (
				!isNaN(parsedPerPage) &&
				parsedPerPage > 0
			) {
				newPagination.itemsPerPage = parsedPerPage
			}
		}

		setPagination(newPagination)
		setIsLoading(false)
	}, [searchParams])

	const updatePagination = (
		updates: Partial<PaginationState>,
	) => {
		try {
			setIsLoading(true)
			const updatedPagination = {
				...pagination,
				...updates,
			}
			const params = new URLSearchParams(
				searchParams.toString(),
			)

			// Update page parameter
			if (updatedPagination.currentPage > 1) {
				params.set(
					"page",
					updatedPagination.currentPage.toString(),
				)
			} else {
				params.delete("page")
			}

			// Update items per page parameter
			if (
				updatedPagination.itemsPerPage !==
				DEFAULT_PAGINATION.itemsPerPage
			) {
				params.set(
					"perPage",
					updatedPagination.itemsPerPage.toString(),
				)
			} else {
				params.delete("perPage")
			}

			const queryString = params.toString()
			router.push(
				queryString ? `?${queryString}` : "/",
			)
		} catch (err) {
			toast.error("Failed to update pagination")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const goToPage = (page: number) => {
		if (
			page < 1 ||
			page > pagination.totalPages
		) {
			return
		}
		updatePagination({ currentPage: page })
	}

	const goToNextPage = () => {
		if (
			pagination.currentPage <
			pagination.totalPages
		) {
			goToPage(pagination.currentPage + 1)
		}
	}

	const goToPreviousPage = () => {
		if (pagination.currentPage > 1) {
			goToPage(pagination.currentPage - 1)
		}
	}

	const updateItemsPerPage = (
		itemsPerPage: number,
	) => {
		if (itemsPerPage < 1) {
			return
		}
		updatePagination({
			itemsPerPage,
			currentPage: 1, // Reset to first page when changing items per page
		})
	}

	const resetPagination = () => {
		try {
			setIsLoading(true)
			const params = new URLSearchParams(
				searchParams.toString(),
			)
			params.delete("page")
			params.delete("perPage")
			const queryString = params.toString()
			router.push(
				queryString ? `?${queryString}` : "/",
			)
		} catch (err) {
			toast.error("Failed to reset pagination")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	return {
		pagination,
		isLoading,
		updatePagination,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		updateItemsPerPage,
		resetPagination,
	}
}
