import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 14,
  className,
  showCount,
  count,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(rating)
              ? "fill-[#BA7517] text-[#BA7517]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-500 ml-1 font-body">({count})</span>
      )}
    </div>
  );
}
