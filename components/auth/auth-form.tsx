import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Facebook, Chrome } from "lucide-react"
import { Button } from "@/components/ui"

interface AuthFormProps {
  children: React.ReactNode
  title: string
  description?: string
  linkText?: string
  linkLabel?: string
  forgotPasswordLink?: boolean
  onGoogleClick?: () => void
  onFacebookClick?: () => void
  isLoading?: boolean
}

export function AuthForm({
  children,
  title,
  description,
  linkText,
  linkLabel,
  forgotPasswordLink = false,
  onGoogleClick,
  onFacebookClick,
  isLoading = false,
}: AuthFormProps) {
  const searchParams = useSearchParams()
  const isModal = searchParams.get("auth")

  const FooterLink = ({ href, label }: { href: string; label: string }) => {
    // Convert auth links to modal format
    const asModal = href.includes("/auth/") 
      ? `?auth=${href.split("/auth/")[1]}` 
      : href
    
    return (
      <Link 
        href={isModal ? asModal : href} 
        className="font-semibold text-primary hover:underline"
        shallow={!!isModal}
      >
        {label}
      </Link>
    )
  }

  const content = (
    <div className={isModal ? "" : "min-h-screen bg-gray-50 pt-16"}>
      <div className={`container mx-auto ${isModal ? "max-w-full" : "max-w-md px-4"}`}>
        <div className={isModal ? "" : "rounded-lg bg-white p-8 shadow-md"}>
          <h2 className="mb-6 text-center text-2xl font-bold">{title}</h2>
          {description && (
            <p className="mb-6 text-center text-gray-600">{description}</p>
          )}

          {(onGoogleClick || onFacebookClick) && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {onGoogleClick && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onGoogleClick}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                )}
                {onFacebookClick && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onFacebookClick}
                    disabled={isLoading}
                  >
                    <Facebook className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                )}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>
            </>
          )}
          
          {children}

          <div className="mt-6 text-center text-sm">
            {forgotPasswordLink && (
              <div className="mb-4">
                <FooterLink 
                  href="/auth/reset-password" 
                  label="Forgot your password?" 
                />
              </div>
            )}
            
            {linkText && linkLabel && (
              <div>
                <span className="text-gray-600">{linkText} </span>
                <FooterLink 
                  href={`/auth/${linkLabel.toLowerCase().replace(" ", "")}`}
                  label={linkLabel} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return content
}