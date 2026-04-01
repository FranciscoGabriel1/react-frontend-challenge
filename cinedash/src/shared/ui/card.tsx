import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn('bg-card text-card-foreground flex flex-col rounded-xl shadow-md', className)}
      {...props}
    />
  ),
)

const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn('flex flex-col gap-0.5 px-2.5 py-2', className)}
      {...props}
    />
  ),
)

Card.displayName = 'Card'
CardContent.displayName = 'CardContent'

export { Card, CardContent }
