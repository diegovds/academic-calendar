import { cn } from '@/libs/utils'
import type { FormHTMLAttributes } from 'react'

type PageProps = FormHTMLAttributes<HTMLDivElement>

export function Page({ children, className, ...props }: PageProps) {
  return (
    <div
      className={cn('container flex-1 mx-auto my-10 px-4 md:px-10', className)}
      {...props}
    >
      {children}
    </div>
  )
}
