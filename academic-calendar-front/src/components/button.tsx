import { cn } from '@/libs/utils'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'bg-green-700 duration-300 hover:bg-green-800 cursor-pointer text-white p-2 rounded w-full mt-2 mb-8 md:text-base text-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
