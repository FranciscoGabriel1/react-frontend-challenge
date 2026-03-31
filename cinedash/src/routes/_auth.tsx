import { createFileRoute, Outlet, redirect, useMatches } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/features/auth'
import { AppHeader } from '@/shared/components/AppHeader'
import { AppFooter } from '@/shared/components/AppFooter'
import { DashboardPage } from '@/pages/DashboardPage'
import { MovieDetailModal } from '@/features/movies/components/MovieDetailModal'

const AuthLayout = () => {
  const matches = useMatches()
  const movieMatch = matches.find((m) => m.routeId === '/_auth/movie/$id')
  const movieId = movieMatch
    ? Number((movieMatch.params as { id: string }).id)
    : null
  const mediaType =
    ((movieMatch?.search as { t?: 'movie' | 'tv' } | undefined)?.t) ?? 'movie'

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      {movieId !== null ? <DashboardPage /> : <Outlet />}
      <AnimatePresence>
        {movieId !== null && (
          <MovieDetailModal key={movieId} id={movieId} mediaType={mediaType} />
        )}
      </AnimatePresence>
      <AppFooter />
    </div>
  )
}

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthLayout,
})
