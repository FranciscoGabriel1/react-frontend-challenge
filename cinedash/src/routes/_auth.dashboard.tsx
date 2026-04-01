import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DashboardPage } from '@/pages/DashboardPage'

const dashboardSearchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute('/_auth/dashboard')({
  validateSearch: dashboardSearchSchema,
  component: DashboardPage,
})
