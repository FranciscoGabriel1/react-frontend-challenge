import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

beforeEach(() => {
  useAuthStore.setState({ token: null, user: null })
})

describe('authStore', () => {
  it('nao esta autenticado inicialmente', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('autentica apos login', () => {
    useAuthStore.getState().login('user@cinedash.com', 'password123')
    expect(useAuthStore.getState().isAuthenticated()).toBe(true)
    expect(useAuthStore.getState().token).not.toBeNull()
    expect(useAuthStore.getState().user?.email).toBe('user@cinedash.com')
  })

  it('gera token unico a cada login', () => {
    useAuthStore.getState().login('user@cinedash.com', 'password123')
    const firstToken = useAuthStore.getState().token

    useAuthStore.setState({ token: null, user: null })
    useAuthStore.getState().login('user@cinedash.com', 'password123')
    const secondToken = useAuthStore.getState().token

    expect(firstToken).not.toBe(secondToken)
  })

  it('limpa estado apos logout', () => {
    useAuthStore.getState().login('user@cinedash.com', 'password123')
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().isAuthenticated()).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
  })
})
