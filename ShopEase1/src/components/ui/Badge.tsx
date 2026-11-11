import type { HTMLAttributes } from "react";

type BadgeVariant = "primary" | "neutral" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
  success: "bg-green-50 text-green-700 ring-green-600/20",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
};

function Badge({
  variant = "neutral",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const classes = [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

export default Badge;
