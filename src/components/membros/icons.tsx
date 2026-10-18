// Ícones próprios da área de membros: traço 1.6 + camada de preenchimento
// que acende quando o item está ativo (duotone). Herdam a cor via currentColor.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; active?: boolean };

function Base({ size = 20, active, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-active={active ? "" : undefined}
      className="esv-ico"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <Base {...p}>
      <path className="esv-ico__fill" d="M4 10.4 12 4.2l8 6.2V19a1.6 1.6 0 0 1-1.6 1.6H15v-5.2a1.4 1.4 0 0 0-1.4-1.4h-3.2A1.4 1.4 0 0 0 9 15.4v5.2H5.6A1.6 1.6 0 0 1 4 19z" />
      <path d="M4 10.4 12 4.2l8 6.2V19a1.6 1.6 0 0 1-1.6 1.6H15v-5.2a1.4 1.4 0 0 0-1.4-1.4h-3.2A1.4 1.4 0 0 0 9 15.4v5.2H5.6A1.6 1.6 0 0 1 4 19z" />
    </Base>
  );
}

export function IconLessons(p: IconProps) {
  return (
    <Base {...p}>
      <rect className="esv-ico__fill" x="3" y="7" width="18" height="13" rx="3.2" />
      <rect x="3" y="7" width="18" height="13" rx="3.2" />
      <path d="M6.5 3.8h11" opacity=".55" />
      <path d="M10.4 11.1v4.8l4.1-2.4z" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconProfile(p: IconProps) {
  return (
    <Base {...p}>
      <circle className="esv-ico__fill" cx="12" cy="8.6" r="3.6" />
      <circle cx="12" cy="8.6" r="3.6" />
      <path d="M4.8 20.2c.9-3.7 3.7-5.6 7.2-5.6s6.3 1.9 7.2 5.6" />
    </Base>
  );
}

export function IconManage(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle className="esv-ico__fill" cx="15" cy="7" r="2.2" />
      <circle cx="15" cy="7" r="2.2" />
      <circle className="esv-ico__fill" cx="9" cy="17" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
    </Base>
  );
}

export function IconStudents(p: IconProps) {
  return (
    <Base {...p}>
      <circle className="esv-ico__fill" cx="9.5" cy="8.8" r="3.3" />
      <circle cx="9.5" cy="8.8" r="3.3" />
      <path d="M3.4 19.6c.7-3.2 3.1-4.9 6.1-4.9s5.4 1.7 6.1 4.9" />
      <path d="M15.6 5.8a3.1 3.1 0 0 1 0 6M17.8 14.9c1.5.6 2.5 2.2 2.8 4.7" opacity=".6" />
    </Base>
  );
}

export function IconProgress(p: IconProps) {
  return (
    <Base {...p}>
      <path className="esv-ico__fill" d="M4.5 19.5V15l4.2-4.3 3.3 3.2 6.8-7.1v12.7z" stroke="none" />
      <path d="M4.5 15l4.2-4.3 3.3 3.2 6.8-7.1" />
      <path d="M14.6 6.8h4.2V11" />
      <path d="M4 19.6h16" opacity=".55" />
    </Base>
  );
}

export function IconLogout(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M14 4.5H7.2A2.2 2.2 0 0 0 5 6.7v10.6a2.2 2.2 0 0 0 2.2 2.2H14" />
      <path d="M10.5 12h9.5M16.8 8.6 20.2 12l-3.4 3.4" />
    </Base>
  );
}

export function IconNotes(p: IconProps) {
  return (
    <Base {...p}>
      <path className="esv-ico__fill" d="M6 3.8h9.2L19 7.6V19a1.6 1.6 0 0 1-1.6 1.6H6A1.6 1.6 0 0 1 4.4 19V5.4A1.6 1.6 0 0 1 6 3.8z" />
      <path d="M6 3.8h9.2L19 7.6V19a1.6 1.6 0 0 1-1.6 1.6H6A1.6 1.6 0 0 1 4.4 19V5.4A1.6 1.6 0 0 1 6 3.8z" />
      <path d="M15 3.9v3.9h3.9" opacity=".55" />
      <path d="M8 11.5h7.5M8 15h5" />
    </Base>
  );
}
