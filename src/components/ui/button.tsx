import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-sans font-medium tracking-[-0.01em] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap rounded-full hover:scale-[1.02] active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#B8902A] text-white hover:bg-[#A37F22]",
      dark:
        "bg-[#0F0E0C] text-white hover:bg-[#1F1D1B]",
      outline:
        "border border-[#D4CFC0] text-[#0F0E0C] hover:border-[#0F0E0C] bg-white hover:bg-[#FAFAF7]",
      ghost:
        "text-[#6B6862] hover:text-[#0F0E0C] bg-transparent hover:scale-100",
      danger:
        "bg-[#C24842] text-white hover:bg-[#D35850]",
    };

    const sizes = {
      sm: "h-9 px-5 text-[13px]",
      md: "h-11 px-6 text-[14px]",
      lg: "h-14 px-9 text-[15px]",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
