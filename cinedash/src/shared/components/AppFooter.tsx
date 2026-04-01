import { ArrowUp, Film } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const CURRENT_YEAR = new Date().getFullYear()

const NAV_LINKS = [
  { label: 'Inicio', to: '/dashboard', external: false },
  { label: 'Filmes', to: '/filmes', external: false },
  { label: 'Series', to: '/series', external: false },
  { label: 'Minha Lista', to: '/watchlist', external: false },
  { label: 'TMDB', to: 'https://www.themoviedb.org', external: true },
  { label: 'API Docs', to: 'https://developers.themoviedb.org', external: true },
] as const

const linkClass = 'text-sm text-muted-foreground transition-colors hover:text-foreground'

const AppFooter = () => (
  <footer className="mt-auto bg-background">
    <div className="mx-auto flex max-w-screen-2xl flex-col items-center px-6 pb-10 pt-12 sm:px-10 lg:px-16">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo"
        className="mb-8 flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar ao topo
      </button>

      <div className="mb-8 flex items-center gap-2">
        <Film className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold">CineDash</span>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-x-16 gap-y-3 sm:grid-cols-3">
        {NAV_LINKS.map(({ label, to, external }) =>
          external ? (
            <a
              key={label}
              href={to}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {label}
            </a>
          ) : (
            <Link key={label} to={to} className={linkClass}>
              {label}
            </Link>
          ),
        )}
      </div>

      <p className="text-xs text-muted-foreground/60">
        © {CURRENT_YEAR} CineDash. Dados fornecidos por{' '}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-muted-foreground"
        >
          The Movie Database
        </a>
        .
      </p>
    </div>
  </footer>
)

export { AppFooter }
