import { describe, it, expect } from 'vitest'
import { loginSchema } from '../loginSchema'

describe('loginSchema', () => {
  it('valida credenciais corretas', () => {
    const result = loginSchema.safeParse({
      email: 'user@cinedash.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail invalido', () => {
    const result = loginSchema.safeParse({
      email: 'nao-e-email',
      password: '123456',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('E-mail invalido')
  })

  it('rejeita senha com menos de 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'user@cinedash.com',
      password: '123',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Senha deve ter mais de 6 caracteres')
  })

  it('rejeita campos vazios', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues).toHaveLength(2)
  })
})
