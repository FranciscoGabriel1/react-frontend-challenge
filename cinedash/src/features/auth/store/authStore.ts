import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (email, _password) => {
        set({
          token: crypto.randomUUID(),
          user: { email },
        })
      },
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => get().token !== null,
    }),
    { name: 'cinedash-auth' },
  ),
)
