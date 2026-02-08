import { router } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore()

  return (onAuthedAction: () => void) => {
    if (!isAuthenticated) {
      router.push('/(auth)')
      return
    }

    onAuthedAction()
  }
}