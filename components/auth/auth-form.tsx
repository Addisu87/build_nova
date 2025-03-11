import Link from "next/link"

type FooterLinkProps = {
  href: string
  label: string
}

interface AuthFormProps {
  children: React.ReactNode
  title: string
  description: string
  linkText?: string
  linkHref?: string
  linkLabel?: string
  forgotPasswordLink?: boolean
  additionalContent?: React.ReactNode
}

const FooterLink = ({ href, label }: FooterLinkProps) => (
  <Link href={href} className="text-blue-600 hover:underline">
    {label}
  </Link>
)

export function AuthForm({
  children,
  title,
  description,
  linkText,
  linkHref,
  linkLabel,
  forgotPasswordLink = false,
  additionalContent,
}: AuthFormProps) {
  const renderFooter = () => (
    <div className="text-center text-sm">
      {forgotPasswordLink && (
        <div className="space-y-4">
          <FooterLink href="/auth/reset-password" label="Forgot your password?" />
        </div>
      )}
      
      {linkText && linkHref && linkLabel && (
        <div className="mt-4">
          {linkText}{" "}
          <FooterLink href={linkHref} label={linkLabel} />
        </div>
      )}
      
      {additionalContent && additionalContent}
    </div>
  )

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

        {(forgotPasswordLink || linkText || additionalContent) && renderFooter()}
      </div>
    </main>
  )
}