import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "focus-ring w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm",
      className,
    )}
    {...props}
  />
));
Select.displayName = "Select";
