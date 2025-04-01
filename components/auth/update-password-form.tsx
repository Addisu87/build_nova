"use client"

import { useRouter } from "next/navigation"
import { Button, Input, Label } from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { updatePasswordSchema } from "@/lib/auth/auth-schemas"
import type { z } from "zod"
import { AuthForm } from "./auth-form"
import { toast } from "sonner"

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

export function UpdatePasswordForm() {
	const router = useRouter()
	const { updatePassword } = useAuth()

	const { handleSubmit, register, errors, isLoading } = useAuthForm<UpdatePasswordFormData>({
		schema: updatePasswordSchema,
		onSubmit: async (data) => {
			try {
				await updatePassword(data.password)
				toast({
					title: "Success",
					description: "Your password has been updated successfully.",
				})
				setTimeout(() => {
					router.push("/")
				}, 1000)
			} catch (error) {
				// Error handling is already done in useAuthForm
			}
		},
	})

	return (
		<AuthForm
			title="Update Password"
			description="Enter your new password below"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="password">New Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
						disabled={isLoading}
						className="w-full"
						{...register("password")}
						aria-describedby={errors.password ? "password-error" : undefined}
					/>
					{errors.password && (
						<p id="password-error" className="text-sm text-destructive">
							{errors.password}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="confirmPassword">
						Confirm New Password
					</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="new-password"
						aria-invalid={
							!!errors.confirmPassword
						}
						aria-describedby={
							errors.confirmPassword
								? "confirm-password-error"
								: undefined
						}
					/>
					{errors.confirmPassword && (
						<p
							id="confirm-password-error"
							className="text-sm text-red-600"
						>
							{errors.confirmPassword}
						</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}
				>
					{isLoading ? "Updating password..." : "Update password"}
				</Button>
			</form>
		</AuthForm>
	)
}
