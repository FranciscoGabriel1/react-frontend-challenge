import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { parseMovieIdParam } from '@/features/movies/utils'

const movieSearchSchema = z.object({
  t: z.enum(['movie', 'tv']).optional(),
})

export const Route = createFileRoute('/_auth/movie/$id')({
  validateSearch: movieSearchSchema,
  beforeLoad: ({ params }) => {
    if (parseMovieIdParam(params.id) === null) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: () => null,
})
