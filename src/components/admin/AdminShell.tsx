"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Kanban,
  DollarSign,
  Package,
  MessageSquare,
  LogOut,
  Download,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_PRIMARY = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kanban", label: "Pipeline", icon: Kanban },
  { href: "/admin/clientes", label: "Clientes Ativos", icon: Users },
  { href: "/admin/financial", label: "Financeiro", icon: DollarSign },
];

const NAV_CONFIG = [
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/templates", label: "Templates", icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function exportCsv() {
    window.location.href = "/api/leads/export";
  }

  return (
    <div className="min-h-screen flex relative bg-[#FAFAF7]">
      <aside className="w-72 border-r border-[#EAE6DC] bg-[#FFFFFF] flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-7 pt-8 pb-8">
          <Link href="/admin/dashboard" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="px-4 mb-2">
          <p className="t-label px-3">Operação</p>
        </div>

        <nav className="px-4 space-y-1 mb-6">
          {NAV_PRIMARY.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-[14px] font-medium tracking-[-0.01em] rounded-lg transition-all duration-300",
                  active
                    ? "bg-[#F0E8D0] text-[#B8902A]"
                    : "text-[#6B6862] hover:text-[#0F0E0C] hover:bg-[#FAFAF7]"
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mb-2">
          <p className="t-label px-3">Configuração</p>
        </div>

        <nav className="px-4 space-y-1 mb-6">
          {NAV_CONFIG.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-[14px] font-medium tracking-[-0.01em] rounded-lg transition-all duration-300",
                  active
                    ? "bg-[#F0E8D0] text-[#B8902A]"
                    : "text-[#6B6862] hover:text-[#0F0E0C] hover:bg-[#FAFAF7]"
                )}
              >
                <Icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="px-4 pb-3">
          <button
            onClick={exportCsv}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] text-[#6B6862] hover:text-[#0F0E0C] hover:bg-[#FAFAF7] rounded-lg transition-all duration-300 cursor-pointer"
          >
            <Download size={14} strokeWidth={1.75} />
            Exportar leads (CSV)
          </button>
        </div>

        <div className="px-4 pb-6 pt-3 border-t border-[#EAE6DC] mx-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-[13px] text-[#A09C92] hover:text-[#0F0E0C] hover:bg-[#FAFAF7] rounded-lg transition-all duration-300 cursor-pointer"
          >
            <LogOut size={14} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 overflow-auto">{children}</main>
    </div>
  );
}
