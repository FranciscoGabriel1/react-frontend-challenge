import { createFileRoute } from '@tanstack/react-router'
import { WatchlistPage } from '@/pages/WatchlistPage'

export const Route = createFileRoute('/_auth/watchlist')({
  component: WatchlistPage,
})
