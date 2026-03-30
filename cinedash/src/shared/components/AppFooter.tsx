import { Film } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const CURRENT_YEAR = new Date().getFullYear()

const AppFooter = () => (
  <footer className="mt-auto border-t border-border/50 bg-background">
    <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-base font-bold">CineDash</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Descubra, explore e organize os melhores filmes do cinema.
          </p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navegacao
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50 cursor-default">
                  Minha Lista
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sobre
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  TMDB
                </a>
              </li>
              <li>
                <a
                  href="https://developers.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © {CURRENT_YEAR} CineDash. Todos os direitos reservados.
        </p>
        <p className="text-xs text-muted-foreground">
          Dados fornecidos por{' '}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            The Movie Database (TMDB)
          </a>
        </p>
      </div>
    </div>
  </footer>
)

export { AppFooter }
