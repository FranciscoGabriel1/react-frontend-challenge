import { useState, useRef, useEffect } from 'react'
import { Film, Search, X } from 'lucide-react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { UserMenu } from './UserMenu'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Inicio' },
  { to: '/filmes', label: 'Filmes' },
  { to: '/series', label: 'Series' },
  { to: '/watchlist', label: 'Minha Lista' },
] as const

const AppHeader = () => {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    void navigate({
      to: '/dashboard',
      search: value.trim().length >= 2 ? { q: value.trim() } : {},
    })
  }

  const handleSearchClose = () => {
    setSearchOpen(false)
    setSearchValue('')
    void navigate({ to: '/dashboard', search: {} })
  }

  const isActiveLink = (to: string) => {
    if (to === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3 sm:px-10 lg:px-16">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Film className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="hidden text-lg font-bold sm:inline">CineDash</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegacao principal">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground ${
                  isActiveLink(to)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/60 px-3 py-1.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar..."
                className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-52"
                aria-label="Buscar filmes"
              />
              <button
                onClick={handleSearchClose}
                className="ml-1 text-muted-foreground hover:text-foreground"
                aria-label="Fechar busca"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Abrir busca"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <nav className="flex items-center gap-0.5 md:hidden" aria-label="Navegacao mobile">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors hover:text-foreground ${
                  isActiveLink(to) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export { AppHeader }
