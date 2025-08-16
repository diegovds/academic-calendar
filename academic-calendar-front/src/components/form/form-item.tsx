import { cn } from '@/libs/utils'
import type { HTMLAttributes } from 'react'

type FormItemProps = HTMLAttributes<HTMLDivElement>

export function FormItem({ children, className, ...props }: FormItemProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}
