import { cn } from "@/lib/utils";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export default function PriceDisplay({
  price,
  comparePrice,
  className,
  size = "md",
  showBadge = false,
}: PriceDisplayProps) {
  const discount = comparePrice ? getDiscountPercent(price, comparePrice) : 0;

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <span
        className={cn(
          "font-semibold text-[#2C2C2A] font-body",
          textSizes[size]
        )}
      >
        {formatPrice(price)}
      </span>
      {comparePrice && comparePrice > price && (
        <>
          <span
            className={cn(
              "text-gray-400 line-through font-body",
              size === "lg" ? "text-base" : "text-sm"
            )}
          >
            {formatPrice(comparePrice)}
          </span>
          {showBadge && discount > 0 && (
            <Badge variant="gold">{discount}% off</Badge>
          )}
        </>
      )}
    </div>
  );
}
