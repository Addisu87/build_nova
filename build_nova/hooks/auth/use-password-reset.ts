import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface PasswordResetState {
	isLoading: boolean
	error: string | null
	success: boolean
}

export function usePasswordReset() {
	const [state, setState] =
		useState<PasswordResetState>({
			isLoading: false,
			error: null,
			success: false,
		})

	const resetPassword = async (email: string) => {
		setState({
			isLoading: true,
			error: null,
			success: false,
		})

		try {
			const { error } =
				await supabase.auth.resetPasswordForEmail(
					email,
					{
						redirectTo: `${window.location.origin}/auth/reset-password`,
					},
				)

			if (error) throw error

			setState({
				isLoading: false,
				error: null,
				success: true,
			})
		} catch (error) {
			setState({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to reset password",
				success: false,
			})
		}
	}

	const updatePassword = async (
		newPassword: string,
	) => {
		setState({
			isLoading: true,
			error: null,
			success: false,
		})

		try {
			const { error } =
				await supabase.auth.updateUser({
					password: newPassword,
				})

			if (error) throw error

			setState({
				isLoading: false,
				error: null,
				success: true,
			})
		} catch (error) {
			setState({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to update password",
				success: false,
			})
		}
	}

	return {
		...state,
		resetPassword,
		updatePassword,
	}
}
