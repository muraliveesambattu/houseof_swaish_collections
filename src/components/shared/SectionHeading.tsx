import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <h2 className="font-heading text-3xl md:text-4xl text-[#2C2C2A] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 font-body text-sm md:text-base max-w-lg">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-1 h-px w-12 bg-[#BA7517]",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
