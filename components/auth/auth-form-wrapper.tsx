interface AuthFormWrapperProps {
    children: React.ReactNode
    title: string
    description: string
    footer?: React.ReactNode
}

export function AuthFormWrapper({
    children,
    title,
    description,
    footer,
}: AuthFormWrapperProps) {
    return (
        <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="mt-2 text-gray-600">
                        {description}
                    </p>
                </div>

                {children}

                {footer && (
                    <div className="text-center text-sm">
                        {footer}
                    </div>
                )}
            </div>
        </main>
    )
} 