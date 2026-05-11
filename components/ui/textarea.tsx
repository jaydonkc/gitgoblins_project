import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "focus-ring min-h-28 w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm shadow-sm",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
