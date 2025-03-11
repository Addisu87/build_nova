"use client"

import { useRouter } from "next/navigation"
import { Button, Input, Label } from "@/components/ui"
import { useAuth } from "@/contexts/auth-context"
import { useAuthForm } from "@/hooks/auth/use-auth-form"
import { updatePasswordSchema } from "@/lib/auth/schemas"
import { AuthFormWrapper } from "./auth-form-wrapper"

export function UpdatePasswordForm() {
    const router = useRouter()
    const { updatePassword } = useAuth()

    const { handleSubmit, isLoading, errors } = useAuthForm({
        schema: updatePasswordSchema,
        onSubmit: async (data) => {
            await updatePassword(data.password)
            router.push("/")
        },
    })

    return (
        <AuthFormWrapper
            title="Update your password"
            description="Enter your new password below"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && (
                    <p className="text-sm text-red-600">{errors.form}</p>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && (
                        <p id="password-error" className="text-sm text-red-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    />
                    {errors.confirmPassword && (
                        <p id="confirm-password-error" className="text-sm text-red-600">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating password..." : "Update Password"}
                </Button>
            </form>
        </AuthFormWrapper>
    )
} 