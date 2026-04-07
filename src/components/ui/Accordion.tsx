"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
  className?: string;
}

export default function Accordion({
  items,
  defaultOpen,
  className,
}: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen ?? null
  );

  return (
    <div className={cn("divide-y divide-gray-100", className)}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-[#2C2C2A] hover:text-[#BA7517] transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-body">{item.title}</span>
            <ChevronDown
              size={16}
              className={cn(
                "flex-shrink-0 transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-200",
              openIndex === i ? "max-h-[2000px] pb-4" : "max-h-0"
            )}
          >
            <div className="text-sm text-gray-600 font-body leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
