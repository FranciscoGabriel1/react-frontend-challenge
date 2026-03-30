import { createFileRoute } from '@tanstack/react-router'
import { Film } from 'lucide-react'
import { useThemeStore } from '@/shared/stores/themeStore'

export const Route = createFileRoute('/')({
  component: PlaceholderPage,
})

function PlaceholderPage() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="flex items-center gap-3">
        <Film className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">
          Cine<span className="text-primary">Dash</span>
        </h1>
      </div>


      <button
        onClick={toggleTheme}
        className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
      >
        Tema atual: <span className="text-primary font-medium">{theme}</span>
        {' - clique para alternar'}
      </button>

    </div>
  )
}
