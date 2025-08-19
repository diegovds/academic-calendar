import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  name: string
  token: string
  setName: (name: string) => void
  setToken: (token: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      name: '',
      token: '',
      setName: name => set({ name }),
      setToken: token => set({ token }),
      reset: () => set({ name: '', token: '' }),
    }),
    {
      name: 'auth-store',
    }
  )
)
