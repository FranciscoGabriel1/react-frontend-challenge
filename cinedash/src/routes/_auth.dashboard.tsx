import { createFileRoute } from '@tanstack/react-router'
import { Film } from 'lucide-react'
import { UserMenu } from '@/shared/components/UserMenu'

const DashboardPlaceholder = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <Film className="h-6 w-6 text-primary" aria-hidden="true" />
        <span className="text-lg font-bold">CineDash</span>
      </div>

      <UserMenu />
    </header>

    <main className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold">Dashboard</p>
      <p className="text-sm text-muted-foreground">Corpo da aplicação :-) </p>
    </main>
  </div>
)

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPlaceholder,
})
