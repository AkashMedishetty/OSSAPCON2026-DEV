import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-ocean-600 to-sapphire-600 text-white hover:from-ocean-700 hover:to-sapphire-700 shadow-lg hover:shadow-xl hover:shadow-ocean-500/25 active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 shadow-lg hover:shadow-xl hover:shadow-coral-500/25 active:scale-[0.98]",
        outline:
          "border-2 border-ocean-200 bg-background hover:bg-ocean-50 hover:border-ocean-300 text-ocean-700 hover:text-ocean-800 active:scale-[0.98]",
        secondary:
          "bg-gradient-to-r from-midnight-100 to-midnight-200 text-midnight-800 hover:from-midnight-200 hover:to-midnight-300 shadow-md hover:shadow-lg active:scale-[0.98]",
        ghost: "hover:bg-ocean-50 hover:text-ocean-700 active:scale-[0.98]",
        link: "text-ocean-600 underline-offset-4 hover:underline hover:text-ocean-700",
        glass: "glass text-ocean-700 hover:bg-white/80 hover:shadow-lg active:scale-[0.98]",
        gradient: "bg-gradient-to-r from-emerald-500 to-ocean-500 text-white hover:from-emerald-600 hover:to-ocean-600 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 active:scale-[0.98]",
        coral: "bg-gradient-to-r from-coral-400 to-amber-500 text-white hover:from-coral-500 hover:to-amber-600 shadow-lg hover:shadow-xl hover:shadow-coral-400/25 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-13 w-13 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
