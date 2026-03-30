import { useForm, type ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Film, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { useAuthStore } from '../store/authStore'

export const LoginForm = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password)
    void navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <Film className="h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            CineDash
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <div className="rounded-xl bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<LoginFormData, 'email'> }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="E-mail"
                        autoComplete="email"
                        aria-label="E-mail"
                        className="h-12 bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: ControllerRenderProps<LoginFormData, 'password'> }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        aria-label="Senha"
                        className="h-12 bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-12 w-full rounded-full text-sm font-semibold"
                disabled={form.formState.isSubmitting}
                aria-label="Entrar"
              >
                {form.formState.isSubmitting
                  ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  : 'Entrar'
                }
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Use qualquer e-mail valido e senha com mais de 6 caracteres.
        </p>
      </div>
    </div>
  )
}
