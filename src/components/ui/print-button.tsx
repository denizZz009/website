"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const printButtonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none position-relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "ink-flow-btn text-white",
        cyan: "bg-cyan text-white hover:bg-cyan/90",
        magenta: "bg-magenta text-white hover:bg-magenta/90",
        yellow: "bg-yellow text-black hover:bg-yellow/90",
        key: "bg-key text-white hover:bg-key/90",
        outline: "cmyk-border bg-background text-foreground",
        paper: "paper-card text-foreground hover:shadow-md",
        ghost: "ink-drop hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10 rounded-md",
      },
      inkEffect: {
        true: "ink-drop",
        false: "",
      },
      printEffect: {
        true: "print-scan",
        false: "",
      },
      animated: {
        true: "transition-transform hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      inkEffect: true,
      animated: true,
    },
  }
);

export interface PrintButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof printButtonVariants> {
  asChild?: boolean;
}

const PrintButton = React.forwardRef<HTMLButtonElement, PrintButtonProps>(
  ({
    className,
    variant,
    size,
    inkEffect,
    printEffect,
    animated,
    ...props
  }, ref) => {
    return (
      <Button
        className={cn(printButtonVariants({
          variant,
          size,
          inkEffect,
          printEffect,
          animated,
          className
        }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PrintButton.displayName = "PrintButton";

export { PrintButton, printButtonVariants };
