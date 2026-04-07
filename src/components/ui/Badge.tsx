import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "rose" | "gold" | "green" | "red" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-[#2C2C2A] text-white",
    rose: "bg-[#C9A6A6] text-[#2C2C2A]",
    gold: "bg-[#BA7517] text-white",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-body",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
