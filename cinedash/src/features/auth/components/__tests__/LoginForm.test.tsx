import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { useAuthStore } from '../../store/authStore'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

beforeEach(() => {
  useAuthStore.setState({ token: null, user: null })
})

describe('LoginForm', () => {
  it('renderiza campos de e-mail e senha', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
  })

  it('exibe erro para e-mail invalido', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'nao-e-email')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText('E-mail invalido')).toBeInTheDocument()
  })

  it('exibe erro para senha curta', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'user@cinedash.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), '123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(await screen.findByText('Senha deve ter mais de 6 caracteres')).toBeInTheDocument()
  })

  it('autentica e navega com credenciais validas', async () => {
    render(<LoginForm />)
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'user@cinedash.com')
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated()).toBe(true)
    })
  })
})
