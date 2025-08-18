import { cn } from '@/libs/utils'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function FormInput({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'p-2 rounded w-full outline-none bg-[#f3f4f8] text-foreground shadow shadow-gray-300',
        className
      )}
      {...props}
    />
  )
}
