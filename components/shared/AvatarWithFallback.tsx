import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarWithFallbackProps {
  src?: string | null
  alt: string
  fallback: string
  className?: string
}

export function AvatarWithFallback({
  src,
  alt,
  fallback,
  className,
}: AvatarWithFallbackProps) {
  return (
    <Avatar className={className}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
        {fallback.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
