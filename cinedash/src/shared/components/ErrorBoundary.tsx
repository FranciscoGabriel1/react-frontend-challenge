import { Component, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-semibold">Algo deu errado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ocorreu um erro inesperado nesta secao.
            </p>
          </div>
          <Button onClick={this.handleReset} variant="outline" className="rounded-full">
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
