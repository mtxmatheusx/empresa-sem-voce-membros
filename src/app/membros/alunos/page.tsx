import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { StudentManager } from "@/components/membros/StudentManager";
import { Client } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/membros/login");

  const { data: isAdmin } = await supabase.rpc("esv_is_admin");
  if (isAdmin !== true) redirect("/membros/dashboard");

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-10 max-w-[720px] relative">
        <div className="esv-aura" />
        <header className="mb-8 relative">
          <p className="t-eyebrow">Administração · só você</p>
          <h1 className="t-h1 mt-3 text-[#F4F0E6]">Alunos</h1>
          <p className="text-[14px] text-[#A39E93] mt-3 max-w-2xl">
            Cadastre o cliente com nome + e-mail e clique em convidar. Ele recebe um
            e-mail pra definir a própria senha e passa a acessar com e-mail + senha.
          </p>
        </header>
        <StudentManager initial={(clients || []) as Client[]} />
      </div>
    </MembrosShell>
  );
}
