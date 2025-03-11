import { z } from "zod"

export const loginSchema = z.object({
	email: z
		.string()
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(
			6,
			"Password must be at least 6 characters",
		),
})

export const signupSchema = z
	.object({
		email: z
			.string()
			.email(
				"Please enter a valid email address",
			),
		password: z
			.string()
			.min(
				6,
				"Password must be at least 6 characters",
			)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string(),
		fullName: z
			.string()
			.min(2, "Please enter your full name"),
	})
	.refine(
		(data) =>
			data.password === data.confirmPassword,
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	)

export const resetPasswordSchema = z.object({
	email: z
		.string()
		.email("Please enter a valid email address"),
})

export const updatePasswordSchema = z
	.object({
		password: z
			.string()
			.min(
				6,
				"Password must be at least 6 characters",
			)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string(),
	})
	.refine(
		(data) =>
			data.password === data.confirmPassword,
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	)
