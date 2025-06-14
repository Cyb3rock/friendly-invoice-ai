
import * as React from "react"

import { cn } from "@/lib/utils"

// Neumorphism: soften surface, inset for pressed look, lighter bg
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[1.25rem] border border-input/70 bg-card px-4 py-2 text-base placeholder:text-muted-foreground/80 shadow-[var(--neu-inset)] focus-visible:shadow-[var(--neu-shadow-high)] focus-visible:ring-2 focus-visible:ring-primary/12 focus-visible:ring-offset-2 transition shadow-md disabled:cursor-not-allowed disabled:opacity-45 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
