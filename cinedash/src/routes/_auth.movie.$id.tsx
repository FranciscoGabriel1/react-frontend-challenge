import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const movieSearchSchema = z.object({
  t: z.enum(['movie', 'tv']).optional(),
})

export const Route = createFileRoute('/_auth/movie/$id')({
  validateSearch: movieSearchSchema,
  component: () => null,
})
