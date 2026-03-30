import { Film } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { UserMenu } from './UserMenu'

const AppHeader = () => (
  <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
    <Link
      to="/dashboard"
      className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Film className="h-6 w-6 text-primary" aria-hidden="true" />
      <span className="text-lg font-bold">CineDash</span>
    </Link>
    <UserMenu />
  </header>
)

export { AppHeader }
