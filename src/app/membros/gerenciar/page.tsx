import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { LessonManager } from "@/components/membros/LessonManager";
import { Lesson } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function GerenciarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/membros/login");

  const { data: isAdmin } = await supabase.rpc("esv_is_admin");
  if (isAdmin !== true) redirect("/membros/dashboard");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .order("pillar_number")
    .order("order_in_pillar");

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-10 max-w-[1100px] relative">
        <div className="esv-aura" />
        <header className="mb-8 relative">
          <p className="t-eyebrow">Administração · só você</p>
          <h1 className="t-h1 mt-3 text-[#F4F0E6]">Gerenciar aulas</h1>
          <p className="text-[14px] text-[#A39E93] mt-3 max-w-2xl">
            Cole o link do YouTube de cada aula, defina o pilar e a ordem, suba a capa
            (pôster) e escreva a tarefa. Publique ou deixe bloqueada com cadeado.
          </p>
        </header>
        <LessonManager initialLessons={(lessons || []) as Lesson[]} />
      </div>
    </MembrosShell>
  );
}
