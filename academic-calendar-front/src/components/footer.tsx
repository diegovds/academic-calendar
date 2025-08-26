import { Heart } from 'lucide-react'
import { ModeToggle } from './ui/mode-toggle'

export function Footer() {
  return (
    <footer className="bg-secondary shadow shadow-gray-300">
      <div className="relative mx-auto flex items-center container px-4 md:px-10 py-2">
        <span className="absolute left-1/2 -translate-x-1/2 flex w-fit items-center gap-1.5 text-xs text-foreground tracking-wider">
          Feito com
          <Heart size={13} className="fill-foreground text-foreground" />
          por
          <strong className="font-medium">Diego Viana</strong>
        </span>

        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
