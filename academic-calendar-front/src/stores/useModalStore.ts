import { create } from 'zustand'

interface AuthState {
  isOpen: boolean
  whoOpened: string
  setIsOpen: (isOpen: boolean) => void
  setWhoOpened: (whoOpened: string) => void
  toggleIsOpen: () => void
  toggleWhoOpened: () => void
}

export const useModalStore = create<AuthState>(set => ({
  isOpen: false,
  whoOpened: '',
  setIsOpen: value => set({ isOpen: value }),
  setWhoOpened: value => set({ whoOpened: value }),
  toggleIsOpen: () => set(state => ({ isOpen: !state.isOpen })),
  toggleWhoOpened: () => set({ whoOpened: '' }),
}))
