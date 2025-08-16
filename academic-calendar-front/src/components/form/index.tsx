import { cn } from '@/libs/utils'
import type { FormHTMLAttributes } from 'react'

type FormProps = FormHTMLAttributes<HTMLFormElement>

export function Form({ children, className, ...props }: FormProps) {
  return (
    <form
      className={cn(
        'space-y-1 w-full md:w-[400px] p-10 mx-4 rounded bg-slate-900 text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}
