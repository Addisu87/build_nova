"use client"

import { useEffect } from "react"
import { useUnifiedFavorites } from "@/hooks/favorites/use-unified-favorites"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui"
import { toast } from "sonner"

export function GuestFavoritesPrompt() {
    const { user } = useAuth()
    const { favorites, migrateGuestFavorites } = useUnifiedFavorites()

    useEffect(() => {
        if (user && favorites.length > 0) {
            toast.info(
                "Would you like to sync your guest favorites?",
                {
                    action: {
                        label: "Sync Now",
                        onClick: migrateGuestFavorites
                    }
                }
            )
        }
    }, [user])

    if (!user || favorites.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-white rounded-lg shadow-lg">
            <p className="text-sm text-gray-600 mb-2">
                You have {favorites.length} favorite properties saved as a guest
            </p>
            <Button 
                onClick={migrateGuestFavorites}
                size="sm"
            >
                Sync Favorites
            </Button>
        </div>
    )
}