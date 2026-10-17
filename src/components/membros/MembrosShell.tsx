"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  IconHome,
  IconLessons,
  IconProfile,
  IconManage,
  IconStudents,
  IconProgress,
  IconLogout,
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

const SPRING = { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.9 };

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

  const renderLink = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn("esv-nav__item", active && "is-active")}
        aria-current={active ? "page" : undefined}
      >
        {active && (
          <motion.span layoutId="esv-nav-pill" className="esv-nav__pill" transition={SPRING} />
        )}
        <span className="esv-nav__icon">
          <Icon size={19} active={active} />
        </span>
        <span className="relative">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="esv-shell">
      <div className="esv-shell__aura" aria-hidden />

      {/* Sidebar desktop: painel de vidro flutuante */}
      <aside className="esv-side esv-glass hidden md:flex">
        <Link href="/membros/dashboard" className="esv-side__brand">
          <span className="esv-brand">
            <span className="esv-brand__mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-esv-mark.png" alt="Empresa Sem Você" />
            </span>
            <span className="esv-brand__txt">
              <strong>Matheus Martins</strong>
              <small>Estrategista do Dono</small>
            </span>
          </span>
        </Link>

        <LayoutGroup id="side">
          <nav className="esv-nav">
            <p className="esv-nav__label">Programa</p>
            {NAV.map(renderLink)}

            {isAdmin && (
              <>
                <p className="esv-nav__label mt-5">Administração</p>
                {ADMIN_ITEMS.map(renderLink)}
              </>
            )}
          </nav>
        </LayoutGroup>

        <div className="flex-1" />

        <button onClick={logout} className="esv-nav__item esv-nav__item--quiet">
          <span className="esv-nav__icon">
            <IconLogout size={18} />
          </span>
          Sair
        </button>
      </aside>

      {/* Barra de topo mobile, com dobra de desfoque */}
      <header className="esv-topbar md:hidden">
        <div className="esv-fold" aria-hidden>
          <span /><span /><span />
        </div>
        <div className="esv-topbar__in">
          <Link href="/membros/dashboard">
            <span className="esv-brand">
            <span className="esv-brand__mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-esv-mark.png" alt="Empresa Sem Você" />
            </span>
            <span className="esv-brand__txt">
              <strong>Matheus Martins</strong>
              <small>Estrategista do Dono</small>
            </span>
          </span>
          </Link>
          <button onClick={logout} className="esv-iconbtn esv-glass" aria-label="Sair">
            <IconLogout size={17} />
          </button>
        </div>
      </header>

      <main className="esv-main">{children}</main>

      {/* Doca mobile: cápsula de vidro flutuante */}
      <LayoutGroup id="dock">
        <nav className="esv-dock esv-glass md:hidden" aria-label="Navegação">
          {items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("esv-dock__item", active && "is-active")}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                {active && (
                  <motion.span layoutId="esv-dock-pill" className="esv-dock__pill" transition={SPRING} />
                )}
                <span className="relative">
                  <Icon size={21} active={active} />
                </span>
                {items.length <= 4 && <span className="relative esv-dock__txt">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
    </div>
  );
}
