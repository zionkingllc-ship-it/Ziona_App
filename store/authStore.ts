import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthState = {
  isAuthenticated: boolean
  isGuest: boolean
  token?: string

  setGuest: () => Promise<void>
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isGuest: false,
  token: undefined,

  setGuest: async () => {
    await AsyncStorage.setItem('authMode', 'guest')
    set({ isGuest: true, isAuthenticated: false })
  },

  login: async (token) => {
    await AsyncStorage.setItem('token', token)
    set({ token, isAuthenticated: true, isGuest: false })
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'authMode'])
    set({ token: undefined, isAuthenticated: false, isGuest: false })
  },
}))
