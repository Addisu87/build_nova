import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

export function useAdminStatus(user: User | null) {
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		setIsAdmin(user?.user_metadata?.role === "admin" || false)
	}, [user?.id])

	return { isAdmin }
}
