import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background shadow p-2">
      <span className="mx-auto flex w-fit items-center gap-1.5 text-xs text-foreground tracking-wider">
        Feito com
        <Heart size={13} className="fill-foreground text-foreground" />
        por
        <strong className="font-medium">Diego Viana</strong>
      </span>
    </footer>
  )
}
