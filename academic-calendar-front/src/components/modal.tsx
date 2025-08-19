import { useEffect, useState } from 'react'
import { Button } from './button'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [show, setShow] = useState(isOpen)
  const [exiting, setExiting] = useState(false)

  // Controla abertura e início da saída
  useEffect(() => {
    if (isOpen) {
      setShow(true)
      setExiting(false)
    } else if (show) {
      setExiting(true)
    }
  }, [isOpen, show])

  // Fecha o modal do DOM após animação de saída
  const handleAnimationEnd = () => {
    if (exiting) setShow(false)
  }

  // Fecha com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`absolute inset-0 bg-overlay ${
          exiting ? 'overlay-exit' : 'overlay-animate'
        }`}
        onClick={onClose}
        onAnimationEnd={handleAnimationEnd}
      />
      <div
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-background text-foreground shadow-xl p-10 ${
          exiting ? 'modal-exit' : 'modal-animate'
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            {title}
          </h2>
        )}
        <div className="mb-4">{children}</div>
        <Button type="button" className="mb-0" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}
