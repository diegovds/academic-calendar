import { useModalStore } from '@/stores/useModalStore'
import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'

type ModalProps = {
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ onClose, title, children }: ModalProps) {
  const { isOpen, toggleWhoOpened } = useModalStore()
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
    if (exiting) {
      setShow(false)
      toggleWhoOpened()
    }
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
        <MdClose
          size={30}
          onClick={onClose}
          className="absolute right-3 top-3 cursor-pointer bg-foreground text-white rounded-full p-1 hover:opacity-95 duration-300"
        />
        {title && (
          <h2 className="text-xl mb-4 font-semibold text-foreground">
            {title}
          </h2>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}
