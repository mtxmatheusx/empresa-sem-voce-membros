import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { letter: "text-[34px]", name: "text-[11px]", role: "text-[9px]" },
    md: { letter: "text-[56px]", name: "text-[13px]", role: "text-[10px]" },
    lg: { letter: "text-[88px]", name: "text-[15px]", role: "text-[11px]" },
    xl: { letter: "text-[128px]", name: "text-[17px]", role: "text-[12px]" },
  };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("logo-m", sizes[size].letter)}>M</span>
      {showText && (
        <div className="flex flex-col leading-none gap-1.5">
          <span
            className={cn(
              "font-serif italic text-[#0F0E0C] tracking-tight",
              sizes[size].name
            )}
          >
            Matheus Martins
          </span>
          <span
            className={cn(
              "font-sans text-[#A09C92] uppercase tracking-[0.18em]",
              sizes[size].role
            )}
          >
            Estrategista do Dono
          </span>
        </div>
      )}
    </div>
  );
}
