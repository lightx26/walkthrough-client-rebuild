import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        // Brand-filled (violet). Primary action.
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20",
        // Soft tinted brand button (e.g. comment submit).
        primarySoft:
          "bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft/70",
        // Dark filled neutral (e.g. GitHub login).
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm shadow-secondary/20",
        // Bordered, neutral surface.
        outline:
          "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        // No background until hover. Use for inline icon buttons inside cards/modals.
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        // Text-only color-shift link (no bg). Use for "view all" / nav-style buttons.
        link: "text-primary hover:text-primary-hover underline-offset-4 hover:underline",
        // Muted text that brightens on hover. Use for tertiary text actions.
        muted:
          "text-muted-foreground hover:text-foreground hover:bg-accent",
        // Destructive filled.
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
        // Destructive soft tint.
        destructiveSoft:
          "bg-destructive-soft text-destructive-soft-foreground hover:bg-destructive-soft/70",
        // Destructive ghost (e.g. remove/trash icon buttons).
        destructiveGhost:
          "text-muted-foreground hover:text-destructive hover:bg-destructive-soft",
        // Dashed "add" affordance.
        dashed:
          "border-2 border-dashed border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        xs: "h-7 px-2.5 text-xs",
        lg: "h-11 px-6 text-base",
        // Full-width chunky CTA (login).
        cta: "h-12 w-full px-6 rounded-xl text-sm",
        // Icon-only sizes.
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        iconXs: "h-6 w-6",
        // No sizing — caller controls padding/height entirely.
        none: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
