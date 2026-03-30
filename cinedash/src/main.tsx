import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryProvider, ThemeProvider } from '@/app/providers'
import { routeTree } from './routeTree.gen'
import '@/app/globals.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
