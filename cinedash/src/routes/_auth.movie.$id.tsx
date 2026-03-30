import { createFileRoute } from '@tanstack/react-router'

const MovieDetailPlaceholder = () => (
  <main className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6">
    <p className="text-muted-foreground">TODO: detalhes do filme</p>
  </main>
)

export const Route = createFileRoute('/_auth/movie/$id')({
  component: MovieDetailPlaceholder,
})
