import { useEffect, useState } from "react"

interface PaginationOptions<T> {
	items: T[]
	defaultItemsPerPage: number
	resetOnItemsChange?: boolean
}

export function usePropertyPagination<T>({
	items,
	defaultItemsPerPage,
	resetOnItemsChange = false,
}: PaginationOptions<T>) {
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(defaultItemsPerPage)

	// Reset to first page when items change if resetOnItemsChange is true
	useEffect(() => {
		if (resetOnItemsChange) {
			setCurrentPage(1)
		}
	}, [items, resetOnItemsChange])

	const totalPages = Math.ceil(items.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page)
		}
	}

	const goToNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1)
		}
	}

	const goToPreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1)
		}
	}

	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		// Always show first page
		pages.push(1)

		// Calculate middle pages
		const leftBound = Math.max(2, currentPage - 1)
		const rightBound = Math.min(totalPages - 1, currentPage + 1)

		if (leftBound > 2) pages.push("...")
		for (let i = leftBound; i <= rightBound; i++) {
			pages.push(i)
		}
		if (rightBound < totalPages - 1) pages.push("...")

		// Always show last page
		pages.push(totalPages)

		return pages
	}

	return {
		pagination: {
			currentPage,
			totalPages,
			itemsPerPage,
		},
		paginatedItems,
		goToPage,
		goToNextPage,
		goToPreviousPage,
		getPageNumbers,
	}
}
