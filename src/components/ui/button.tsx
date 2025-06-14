
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Modern minimalist: lighter backgrounds, subtlest shadow, calmer outlines.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-background text-foreground", // softer, less contrast
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border border-border hover:bg-accent hover:text-primary/90 active:bg-muted shadow-sm",
        destructive: "bg-destructive text-destructive-foreground border-none hover:bg-destructive/90",
        outline: "border border-border bg-background text-foreground hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground border border-secondary hover:bg-secondary/60",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "underline text-primary underline-offset-4 hover:text-primary/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-12 px-7 rounded-xl",
        icon: "h-10 w-10",
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

