import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Neumorphism: soften surface, blend backgrounds, layered shadows.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.2rem] text-sm font-medium ring-offset-background transition select-none shadow-[var(--neu-shadow-low)] active:shadow-[var(--neu-inset)] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-border/50 hover:bg-[hsl(var(--background))] hover:shadow-[var(--neu-shadow-high)] active:scale-98 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "", // Neumorphism built-in.
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[var(--neu-shadow-low)]",
        outline: "border border-border bg-background text-foreground hover:bg-[hsl(var(--accent))] hover:shadow-[var(--neu-shadow-high)]",
        secondary: "bg-secondary text-secondary-foreground border border-secondary hover:shadow-[var(--neu-shadow-high)]",
        ghost: "bg-transparent shadow-none hover:shadow-[var(--neu-shadow-low)]",
        link: "underline text-primary underline-offset-4 bg-transparent shadow-none hover:text-primary/80",
      },
      size: {
        default: "h-11 px-7 py-2 rounded-[1.2rem]",
        sm: "h-9 px-4 rounded-md",
        lg: "h-14 px-10 rounded-[1.6rem]",
        icon: "h-11 w-11",
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
