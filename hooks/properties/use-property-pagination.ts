import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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

interface UsePropertyPaginationProps {
	items?: any[]
	defaultItemsPerPage?: number
}

export function usePropertyPagination({ 
	items = [], 
	defaultItemsPerPage = 12 
}: UsePropertyPaginationProps = {}) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { isLoading } = useAuth()
	const [pagination, setPagination] = useState<PaginationState>({
		...DEFAULT_PAGINATION,
		itemsPerPage: defaultItemsPerPage,
		totalItems: items.length,
		totalPages: Math.ceil(items.length / defaultItemsPerPage)
	})

	useEffect(() => {
		// Parse search params into pagination state
		const newPagination: PaginationState = {
			...pagination,
			totalItems: items.length,
			totalPages: Math.ceil(items.length / pagination.itemsPerPage)
		}

		// Current page
		const page = searchParams.get("page")
		if (page) {
			const parsedPage = parseInt(page)
			if (!isNaN(parsedPage) && parsedPage > 0) {
				newPagination.currentPage = Math.min(parsedPage, newPagination.totalPages)
			}
		}

		// Items per page
		const perPage = searchParams.get("perPage")
		if (perPage) {
			const parsedPerPage = parseInt(perPage)
			if (!isNaN(parsedPerPage) && parsedPerPage > 0) {
				newPagination.itemsPerPage = parsedPerPage
				newPagination.totalPages = Math.ceil(items.length / parsedPerPage)
			}
		}

		setPagination(newPagination)
	}, [searchParams, items])

	const updatePagination = (updates: Partial<PaginationState>) => {
		try {
			const updatedPagination = {
				...pagination,
				...updates,
			}
			const params = new URLSearchParams(searchParams.toString())

			// Update page parameter
			if (updatedPagination.currentPage > 1) {
				params.set("page", updatedPagination.currentPage.toString())
			} else {
				params.delete("page")
			}

			// Update items per page parameter
			if (updatedPagination.itemsPerPage !== DEFAULT_PAGINATION.itemsPerPage) {
				params.set("perPage", updatedPagination.itemsPerPage.toString())
			} else {
				params.delete("perPage")
			}

			const queryString = params.toString()
			router.push(queryString ? `?${queryString}` : window.location.pathname)
		} catch (err) {
			toast.error("Failed to update pagination")
			throw err
		}
	}

	const goToPage = (page: number) => {
		if (page < 1 || page > pagination.totalPages) {
			return
		}
		updatePagination({ currentPage: page })
	}

	const goToNextPage = () => {
		if (pagination.currentPage < pagination.totalPages) {
			goToPage(pagination.currentPage + 1)
		}
	}

	const goToPreviousPage = () => {
		if (pagination.currentPage > 1) {
			goToPage(pagination.currentPage - 1)
		}
	}

	const updateItemsPerPage = (itemsPerPage: number) => {
		if (itemsPerPage < 1) {
			return
		}
		updatePagination({
			itemsPerPage,
			currentPage: 1,
			totalPages: Math.ceil(pagination.totalItems / itemsPerPage)
		})
	}

	const resetPagination = () => {
		try {
			const params = new URLSearchParams(searchParams.toString())
			params.delete("page")
			params.delete("perPage")
			const queryString = params.toString()
			router.push(queryString ? `?${queryString}` : window.location.pathname)
		} catch (err) {
			toast.error("Failed to reset pagination")
			throw err
		}
	}

	// Calculate paginated items
	const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
	const endIndex = startIndex + pagination.itemsPerPage
	const paginatedItems = items.slice(startIndex, endIndex)

	// Generate page numbers for pagination display
	const getPageNumbers = () => {
		const totalPages = pagination.totalPages
		const currentPage = pagination.currentPage
		let pages: (number | string)[] = []

		if (totalPages <= 7) {
			pages = Array.from({ length: totalPages }, (_, i) => i + 1)
		} else {
			if (currentPage <= 3) {
				pages = [1, 2, 3, 4, '...', totalPages - 1, totalPages]
			} else if (currentPage >= totalPages - 2) {
				pages = [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
			} else {
				pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
			}
		}
		return pages
	}

	return {
		pagination,
		paginatedItems,
		isLoading,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		updateItemsPerPage,
		resetPagination,
		getPageNumbers
	}
}
