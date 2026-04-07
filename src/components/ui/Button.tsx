import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-[#2C2C2A] text-[#FAF7F4] hover:bg-[#444440] focus-visible:outline-[#2C2C2A]",
      secondary:
        "bg-[#C9A6A6] text-[#2C2C2A] hover:bg-[#b8918f] focus-visible:outline-[#C9A6A6]",
      outline:
        "border border-[#2C2C2A] text-[#2C2C2A] bg-transparent hover:bg-[#2C2C2A] hover:text-[#FAF7F4] focus-visible:outline-[#2C2C2A]",
      ghost:
        "text-[#2C2C2A] bg-transparent hover:bg-[#f0ebe6] focus-visible:outline-[#2C2C2A]",
      gold: "bg-[#BA7517] text-white hover:bg-[#D4921E] focus-visible:outline-[#BA7517]",
    };

    const sizes = {
      sm: "text-xs px-4 py-2 rounded-sm",
      md: "text-sm px-6 py-3 rounded-sm",
      lg: "text-base px-8 py-4 rounded-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
