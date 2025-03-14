import { Skeleton } from "@/components/ui"
import { cn } from "@/lib/utils"

interface PropertyMapSkeletonProps {
    className?: string
    height?: string
}

export function PropertyMapSkeleton({ 
    className,
    height = "h-[300px]"
}: PropertyMapSkeletonProps) {
    return (
        <div className={cn(
            "relative w-full overflow-hidden rounded-lg",
            height,
            className
        )}>
            <Skeleton className="h-full w-full" />
        </div>
    )
} 