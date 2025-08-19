import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  name: string
  sub: string
  token: string
  setName: (name: string) => void
  setSub: (sub: string) => void
  setToken: (token: string) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      name: '',
      sub: '',
      token: '',
      setName: name => set({ name }),
      setSub: sub => set({ sub }),
      setToken: token => set({ token }),
      reset: () => set({ name: '', sub: '', token: '' }),
    }),
    {
      name: 'auth-store',
    }
  )
)
