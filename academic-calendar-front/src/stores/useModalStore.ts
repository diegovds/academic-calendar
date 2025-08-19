import { create } from 'zustand'

interface AuthState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  toggleIsOpen: () => void
}

export const useModalStore = create<AuthState>(set => ({
  isOpen: false,
  setIsOpen: value => set({ isOpen: value }),
  toggleIsOpen: () => set(state => ({ isOpen: !state.isOpen })),
}))
