import { cn } from '@/libs/utils'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function FormInput({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'border p-2 rounded w-full outline-none bg-slate-100 text-slate-900',
        className
      )}
      {...props}
    />
  )
}
