import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth'
import { useAuthStore } from '@/features/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginForm,
})
