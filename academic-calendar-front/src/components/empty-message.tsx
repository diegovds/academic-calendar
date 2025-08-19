import { cn } from '@/libs/utils'
import type { FormHTMLAttributes } from 'react'

type EmptyMessageProps = FormHTMLAttributes<HTMLDivElement> & {
  text: string
}

export function EmptyMessage({
  children,
  className,
  text,
  ...props
}: EmptyMessageProps) {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center justify-center',
        className
      )}
      {...props}
    >
      <p className="text-foreground">{text}</p>
      {children}
    </div>
  )
}
