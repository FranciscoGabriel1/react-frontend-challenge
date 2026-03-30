import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth'
import { AppHeader } from '@/shared/components/AppHeader'
import { AppFooter } from '@/shared/components/AppFooter'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  ),
})
