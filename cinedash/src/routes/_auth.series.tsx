import { createFileRoute } from '@tanstack/react-router'
import { BrowsePage } from '@/pages/BrowsePage'

export const Route = createFileRoute('/_auth/series')({
  component: () => <BrowsePage mediaType="tv" />,
})
