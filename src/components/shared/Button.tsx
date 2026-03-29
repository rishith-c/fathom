"use client";

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "rounded-full font-medium transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[#fa5d19] text-white",
          "hover:bg-[#e5520f]",
          "focus-visible:ring-[#fa5d19]/60",
          "shadow-[0_0_20px_rgba(250,93,25,0.3)]",
        ],
        secondary: [
          "border border-white/10 bg-white/5 text-white/90 backdrop-blur-xl",
          "hover:bg-white/10 hover:border-white/20",
          "focus-visible:ring-white/30",
        ],
        ghost: [
          "bg-transparent text-white/70",
          "hover:bg-white/5 hover:text-white",
          "focus-visible:ring-white/20",
        ],
        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "focus-visible:ring-red-500/60",
        ],
      },
      size: {
        sm: "min-h-8 px-3 py-1.5 text-sm",
        md: "min-h-10 px-5 py-2.5 text-sm",
        lg: "min-h-12 px-7 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    ButtonVariantProps {
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
}

const MotionButton = motion.create("button");

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      loading = false,
      disabled = false,
      icon,
      iconPosition = "left",
      children,
      className,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <MotionButton
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        whileHover={isDisabled ? undefined : { scale: 1.02, y: -1 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        {...(rest as HTMLMotionProps<"button">)}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          icon && iconPosition === "left" && (
            <span className="shrink-0" aria-hidden="true">
              {icon}
            </span>
          )
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </MotionButton>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
