import { createFileRoute } from '@tanstack/react-router'
import { BrowsePage } from '@/pages/BrowsePage'

export const Route = createFileRoute('/_auth/filmes')({
  component: () => <BrowsePage mediaType="movie" />,
})
