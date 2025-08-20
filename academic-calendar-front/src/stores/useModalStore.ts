import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  whoOpened: string
  setIsOpen: (isOpen: boolean) => void
  setWhoOpened: (whoOpened: string) => void
  toggleIsOpen: () => void
  toggleWhoOpened: () => void
}

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  whoOpened: '',
  setIsOpen: value => set({ isOpen: value }),
  setWhoOpened: value => set({ whoOpened: value }),
  toggleIsOpen: () => set(state => ({ isOpen: !state.isOpen })),
  toggleWhoOpened: () => set({ whoOpened: '' }),
}))
