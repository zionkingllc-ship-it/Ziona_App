import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthState, User, AuthTokens } from '@/types'

type AuthStore = AuthState & {
  setAuth: (user: User, tokens: AuthTokens) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      mode: 'unauthenticated', 

      setAuth: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          mode: 'authenticated',
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          mode: 'unauthenticated', 
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        mode: state.mode, 
      }),
    }
  )
)