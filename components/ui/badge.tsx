import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-ocean-600 to-sapphire-600 text-white shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-gradient-to-r from-midnight-100 to-midnight-200 text-midnight-800 hover:from-midnight-200 hover:to-midnight-300",
        destructive:
          "border-transparent bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-sm hover:shadow-md",
        outline: "border-ocean-200 text-ocean-700 hover:bg-ocean-50",
        glass: "glass border-white/20 text-ocean-700",
        success: "border-transparent bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm hover:shadow-md",
        warning: "border-transparent bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm hover:shadow-md",
        coral: "border-transparent bg-gradient-to-r from-coral-400 to-amber-500 text-white shadow-sm hover:shadow-md",
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
