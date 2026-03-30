import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  password: z.string().min(6, 'Senha deve ter mais de 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
