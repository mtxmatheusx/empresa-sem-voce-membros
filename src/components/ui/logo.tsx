import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const PX = { sm: 32, md: 46, lg: 66, xl: 100 } as const;
const NAME = {
  sm: "text-[11px]",
  md: "text-[13px]",
  lg: "text-[15px]",
  xl: "text-[17px]",
} as const;
const ROLE = {
  sm: "text-[9px]",
  md: "text-[10px]",
  lg: "text-[11px]",
  xl: "text-[12px]",
} as const;

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const px = PX[size];
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-esv.png"
        alt="Empresa Sem Você"
        width={px}
        height={px}
        style={{ width: px, height: px }}
        className="object-contain shrink-0"
      />
      {showText && (
        <div className="flex flex-col leading-none gap-1.5">
          <span
            className={cn("font-serif italic tracking-tight", NAME[size])}
            style={{ color: "var(--color-text)" }}
          >
            Matheus Martins
          </span>
          <span
            className={cn("font-sans uppercase tracking-[0.18em]", ROLE[size])}
            style={{ color: "var(--color-text-faint)" }}
          >
            Estrategista do Dono
          </span>
        </div>
      )}
    </div>
  );
}
