import { Skeleton } from "@/components/ui"

export function PropertyMapSkeleton() {
    return (
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
            <Skeleton className="h-full w-full" />
        </div>
    )
} 