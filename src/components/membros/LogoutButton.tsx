"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IconLogout } from "@/components/membros/icons";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/membros/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="esv-btn esv-btn--ghost esv-glass">
      <IconLogout size={17} /> Sair da conta
    </button>
  );
}
