"use client"

import { ImageUploadPanel } from "@/components/admin/image-upload-panel"
import { LoadingState } from "@/components/ui/loading-state"
import { useAuth } from "@/contexts/auth-context"
import { useProtectedRoute } from "@/hooks/auth/use-protected-route"
import { PROPERTY_TYPES } from "@/types"
import { useState } from "react"
import { toast } from "sonner"
import { AuthForm } from "./auth-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AdminDashboard() {
	const { user, isLoading } = useAuth()
	const { isAuthenticated } = useProtectedRoute(true)
	const [selectedPropertyType, setSelectedPropertyType] = useState<string>("apartment")

	if (isLoading) {
		return <LoadingState type="imageUpload" />
	}

	if (!isAuthenticated || user?.user_metadata?.role !== "admin") {
		return (
			<div className="text-center">
				<h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
				<p className="text-gray-600 mt-2">
					You do not have permission to access this page.
				</p>
			</div>
		)
	}

	return (
		<AuthForm description={`Admin Dashboard - Logged in as: ${user?.email}`}>
			<Tabs defaultValue="property-types" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="property-types">Property Type Images</TabsTrigger>
					<TabsTrigger value="property-uploads">Property Uploads</TabsTrigger>
				</TabsList>

				<TabsContent value="property-types" className="space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4">Property Type Images</h2>
						<div className="mb-4">
							<label className="text-sm font-medium block mb-2">Property Type</label>
							<select
								value={selectedPropertyType}
								onChange={(e) => setSelectedPropertyType(e.target.value)}
								className="w-full p-2 border rounded-md"
							>
								{PROPERTY_TYPES.map((type) => (
									<option key={type} value={type.toLowerCase()}>
										{type}
									</option>
								))}
							</select>
						</div>

						<ImageUploadPanel
							folderPath={`properties/${selectedPropertyType.toLowerCase()}`}
							maxFiles={10}
							onUploadComplete={(results) => {
								console.log("Uploaded:", results)
								toast.success(`Successfully uploaded ${results.length} images`)
							}}
						/>
					</div>
				</TabsContent>

				<TabsContent value="property-uploads" className="space-y-6">
					<div>
						<h2 className="text-lg font-semibold mb-4">Property Uploads</h2>
						<p className="text-sm text-muted-foreground mb-4">
							Upload images for specific properties. Images will be stored in their
							respective property folders.
						</p>

						<ImageUploadPanel
							folderPath="properties/uploads"
							maxFiles={20}
							onUploadComplete={(results) => {
								console.log("Uploaded:", results)
								toast.success(`Successfully uploaded ${results.length} images`)
							}}
							showPreview={true}
							allowDelete={true}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</AuthForm>
	)
}
