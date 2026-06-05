import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        cyan: 'border-transparent bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
        blue: 'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400',
        violet: 'border-transparent bg-violet-500/10 text-violet-600 dark:text-violet-400',
        rose: 'border-transparent bg-rose-500/10 text-rose-600 dark:text-rose-400',
        amber: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400',
        emerald: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
