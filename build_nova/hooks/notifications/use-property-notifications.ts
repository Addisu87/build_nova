import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { Database } from "@/types/supabase"
import { supabase } from "@/lib/supabase/db"
import { useAuth } from "./use-auth"

type Notification =
	Database["public"]["Tables"]["notifications"]["Row"]

interface NotificationPreferences {
	priceChanges: boolean
	newProperties: boolean
	reservationUpdates: boolean
	reviewNotifications: boolean
	emailNotifications: boolean
	pushNotifications: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences =
	{
		priceChanges: true,
		newProperties: true,
		reservationUpdates: true,
		reviewNotifications: true,
		emailNotifications: true,
		pushNotifications: true,
	}

export function usePropertyNotifications() {
	const { user } = useAuth()
	const [notifications, setNotifications] =
		useState<Notification[]>([])
	const [preferences, setPreferences] =
		useState<NotificationPreferences>(
			DEFAULT_PREFERENCES,
		)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (!user) {
			setIsLoading(false)
			return
		}

		// Fetch notifications and preferences
		async function fetchData() {
			try {
				setIsLoading(true)

				// Fetch notifications
				const {
					data: notificationsData,
					error: notificationsError,
				} = await supabase
					.from("notifications")
					.select("*")
					.eq("user_id", user.id)
					.order("created_at", {
						ascending: false,
					})

				if (notificationsError) {
					throw notificationsError
				}

				// Fetch preferences
				const {
					data: preferencesData,
					error: preferencesError,
				} = await supabase
					.from("notification_preferences")
					.select("*")
					.eq("user_id", user.id)
					.single()

				if (
					preferencesError &&
					preferencesError.code !== "PGRST116"
				) {
					throw preferencesError
				}

				setNotifications(notificationsData || [])
				setPreferences(
					preferencesData || DEFAULT_PREFERENCES,
				)
			} catch (err) {
				console.error(
					"Failed to fetch notifications:",
					err,
				)
				toast.error(
					"Failed to load notifications",
				)
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()

		// Subscribe to new notifications
		const subscription = supabase
			.channel("notifications")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					const newNotification =
						payload.new as Notification
					setNotifications((prev) => [
						newNotification,
						...prev,
					])
					showNotification(newNotification)
				},
			)
			.subscribe()

		return () => {
			subscription.unsubscribe()
		}
	}, [user])

	const showNotification = (
		notification: Notification,
	) => {
		if (preferences.pushNotifications) {
			toast(notification.message, {
				duration: 5000,
				position: "top-right",
			})
		}
	}

	const markAsRead = async (
		notificationId: string,
	) => {
		try {
			setIsLoading(true)
			const { error } = await supabase
				.from("notifications")
				.update({ read: true })
				.eq("id", notificationId)

			if (error) {
				throw error
			}

			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === notificationId
						? { ...notification, read: true }
						: notification,
				),
			)
		} catch (err) {
			console.error(
				"Failed to mark notification as read:",
				err,
			)
			toast.error("Failed to update notification")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const markAllAsRead = async () => {
		try {
			setIsLoading(true)
			const { error } = await supabase
				.from("notifications")
				.update({ read: true })
				.eq("user_id", user.id)
				.eq("read", false)

			if (error) {
				throw error
			}

			setNotifications((prev) =>
				prev.map((notification) => ({
					...notification,
					read: true,
				})),
			)
		} catch (err) {
			console.error(
				"Failed to mark all notifications as read:",
				err,
			)
			toast.error(
				"Failed to update notifications",
			)
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const deleteNotification = async (
		notificationId: string,
	) => {
		try {
			setIsLoading(true)
			const { error } = await supabase
				.from("notifications")
				.delete()
				.eq("id", notificationId)

			if (error) {
				throw error
			}

			setNotifications((prev) =>
				prev.filter(
					(notification) =>
						notification.id !== notificationId,
				),
			)
		} catch (err) {
			console.error(
				"Failed to delete notification:",
				err,
			)
			toast.error("Failed to delete notification")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const updatePreferences = async (
		newPreferences: Partial<NotificationPreferences>,
	) => {
		try {
			setIsLoading(true)
			const updatedPreferences = {
				...preferences,
				...newPreferences,
			}

			const { error } = await supabase
				.from("notification_preferences")
				.upsert({
					user_id: user?.id,
					...updatedPreferences,
				})

			if (error) {
				throw error
			}

			setPreferences(updatedPreferences)
			toast.success(
				"Notification preferences updated",
			)
		} catch (err) {
			console.error(
				"Failed to update notification preferences:",
				err,
			)
			toast.error("Failed to update preferences")
			throw err
		} finally {
			setIsLoading(false)
		}
	}

	const getUnreadCount = () => {
		return notifications.filter(
			(notification) => !notification.read,
		).length
	}

	const getNotificationsByType = (
		type: string,
	) => {
		return notifications.filter(
			(notification) =>
				notification.type === type,
		)
	}

	return {
		notifications,
		preferences,
		isLoading,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		updatePreferences,
		getUnreadCount,
		getNotificationsByType,
	}
}
