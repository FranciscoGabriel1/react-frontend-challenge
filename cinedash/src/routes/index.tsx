import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const authenticated = useAuthStore.getState().isAuthenticated()
    throw redirect({ to: authenticated ? '/dashboard' : '/login' })
  },
})
