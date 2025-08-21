import { cn } from '@/libs/utils'
import type { HTMLAttributes } from 'react'

type FormErrorProps = HTMLAttributes<HTMLSpanElement> & {
  error?: string
}

export function FormError({
  children,
  className,
  error,
  ...props
}: FormErrorProps) {
  return (
    <span
      className={cn(
        `${error ? 'opacity-100' : 'opacity-0'} text-red-500 text-xs md:text-sm`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
