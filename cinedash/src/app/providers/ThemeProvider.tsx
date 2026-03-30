import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/shared/stores/themeStore'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}
