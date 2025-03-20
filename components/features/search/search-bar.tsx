import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  variant?: 'default' | 'hero'
  initialQuery?: string
}

export function SearchBar({ variant = 'default', initialQuery = '' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        flex gap-2 w-full
        ${variant === 'hero' ? 'bg-white/90 dark:bg-gray-900/90 p-2 rounded-lg backdrop-blur' : ''}
      `}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by location, property type, or keywords..."
          className={`
            pl-10
            ${variant === 'hero' ? 'bg-transparent border-0 focus-visible:ring-0' : ''}
          `}
        />
      </div>
      <Button type="submit" variant={variant === 'hero' ? 'default' : 'secondary'}>
        Search
      </Button>
    </form>
  )
}