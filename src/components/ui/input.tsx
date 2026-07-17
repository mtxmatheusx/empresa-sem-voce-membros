import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-12 px-0 py-3 bg-transparent border-0 border-b text-[15px] text-[#0F0E0C] placeholder:text-[#A09C92] transition-all duration-200 input-focus font-sans",
          error ? "border-b-[#C24842]" : "border-b-[#D4CFC0] hover:border-b-[#6B6862]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-0 py-3 bg-transparent border-0 border-b text-[15px] text-[#0F0E0C] placeholder:text-[#A09C92] transition-all duration-200 input-focus font-sans resize-none leading-relaxed",
          error ? "border-b-[#C24842]" : "border-b-[#D4CFC0] hover:border-b-[#6B6862]",
          className
        )}
        rows={3}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
