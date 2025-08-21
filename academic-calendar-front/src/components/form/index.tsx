import { cn } from '@/libs/utils'
import type { FormHTMLAttributes } from 'react'

type FormProps = FormHTMLAttributes<HTMLFormElement>

export function Form({ children, className, ...props }: FormProps) {
  return (
    <form
      className={cn(
        'space-y-2 w-full p-10 rounded bg-background text-foreground text-sm shadow shadow-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}
