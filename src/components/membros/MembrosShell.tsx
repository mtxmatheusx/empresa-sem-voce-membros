"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome,
  IconLessons,
  IconProfile,
  IconManage,
  IconStudents,
  IconProgress,
} from "@/components/membros/icons";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: (p: { size?: number; active?: boolean }) => React.ReactElement;
};

const NAV: NavItem[] = [
  { href: "/membros/dashboard", label: "Início", icon: IconHome },
  { href: "/membros/aulas", label: "Aulas", icon: IconLessons },
  { href: "/membros/perfil", label: "Perfil", icon: IconProfile },
];

const ADMIN_ITEMS: NavItem[] = [
  { href: "/membros/gerenciar", label: "Gerenciar", icon: IconManage },
  { href: "/membros/alunos", label: "Alunos", icon: IconStudents },
  { href: "/membros/progresso", label: "Progresso", icon: IconProgress },
];

// Marca em texto, no padrão editorial: serifa com o "Sem" em itálico dourado.
function Mark() {
  return (
    <span className="ed-mark">
      Empresa <i>Sem</i> Você
    </span>
  );
}

export function MembrosShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("esv_is_admin").then(({ data }) => setIsAdmin(data === true));
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/membros/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/membros/dashboard"
      ? pathname === href
      : !!pathname?.startsWith(href);

  const items = isAdmin ? [...NAV, ...ADMIN_ITEMS] : NAV;

  return (
    <div className="ed-shell">
      <header className="ed-nav">
        <div className="ed-wrap ed-nav__in">
          <Link href="/membros/dashboard" aria-label="Início">
            <Mark />
          </Link>
          <nav className="ed-nav__links" aria-label="Seções">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {isAdmin && <li className="ed-nav__sep" aria-hidden />}
              {isAdmin &&
                ADMIN_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          <button onClick={logout} className="ed-nav__out">
            Sair
          </button>
        </div>
      </header>

      <main className="ed-main">{children}</main>

      {/* Celular: barra de seções no rodapé, com filete dourado no item ativo */}
      <nav className="ed-tabbar" aria-label="Navegação">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("ed-tabbar__item", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={19} active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
