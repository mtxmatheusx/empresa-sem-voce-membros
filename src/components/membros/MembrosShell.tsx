"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/membros/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/membros/pilares", label: "Pilares", icon: BookOpen },
  { href: "/membros/perfil", label: "Perfil", icon: User },
];

export function MembrosShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/membros/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex relative bg-[#FAFAF7]">
      <aside className="w-72 border-r border-[#EAE6DC] bg-[#FFFFFF] flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
        <div className="px-7 pt-8 pb-8">
          <Link href="/membros/dashboard" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="px-4 mb-2">
          <p className="t-label px-3">Programa</p>
        </div>

        <nav className="px-4 space-y-1 mb-6">
          {NAV.map((item) => {
            const active =
              item.href === "/membros/dashboard"
                ? pathname === item.href
                : pathname?.startsWith(item.href);
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

      <main className="flex-1 md:ml-72 overflow-auto pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#EAE6DC] bg-white">
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const active =
              item.href === "/membros/dashboard"
                ? pathname === item.href
                : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-[10px] tracking-[0.05em] uppercase transition-colors",
                  active ? "text-[#B8902A]" : "text-[#6B6862]"
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center gap-1 py-3 text-[10px] tracking-[0.05em] uppercase text-[#A09C92] cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sair
          </button>
        </div>
      </nav>
    </div>
  );
}
