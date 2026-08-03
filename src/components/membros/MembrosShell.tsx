"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Clapperboard,
  User,
  LogOut,
  SlidersHorizontal,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/membros/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/membros/aulas", label: "Aulas", icon: Clapperboard },
  { href: "/membros/perfil", label: "Perfil", icon: User },
];

const ADMIN_ITEMS = [
  { href: "/membros/gerenciar", label: "Gerenciar", icon: SlidersHorizontal },
  { href: "/membros/alunos", label: "Alunos", icon: Users },
  { href: "/membros/progresso", label: "Progresso", icon: Activity },
];

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

  const items = isAdmin ? [...NAV, ...ADMIN_ITEMS] : NAV;

  const isActive = (href: string) =>
    href === "/membros/dashboard"
      ? pathname === href
      : pathname?.startsWith(href);

  return (
    <div className="min-h-screen flex relative" style={{ background: "var(--color-bg)" }}>
      {/* Sidebar desktop */}
      <aside
        className="w-64 flex-col fixed inset-y-0 left-0 z-30 hidden md:flex"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <div className="px-7 pt-8 pb-8">
          <Link href="/membros/dashboard" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="px-4 mb-2">
          <p className="t-label px-3">Programa</p>
        </div>

        <nav className="px-4 space-y-1 mb-6">
          {items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-[14px] font-medium tracking-[-0.01em] rounded-lg transition-all duration-300",
                  active ? "text-[#0C0C0C]" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
                )}
                style={
                  active
                    ? { background: "linear-gradient(135deg,#C9A227,#D4AF37)" }
                    : undefined
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div
          className="px-4 pb-6 pt-3 mx-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] rounded-lg transition-all duration-300 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 overflow-auto pb-24 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40"
        style={{
          background: "rgba(12,12,12,0.95)",
          borderTop: "1px solid var(--color-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${items.length + 1}, 1fr)` }}
        >
          {items.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-[10px] tracking-[0.05em] uppercase transition-colors",
                  active ? "text-[#C9A227]" : "text-[#A0A0A0]"
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] tracking-[0.05em] uppercase text-[#6E6E6E] cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </nav>
    </div>
  );
}
