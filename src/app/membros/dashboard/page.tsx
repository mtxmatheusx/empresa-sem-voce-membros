import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { DashboardView } from "@/components/membros/DashboardView";
import { Client, ClientTask, Lesson, LessonProgress } from "@/types/client";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MembrosDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/membros/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (!client) {
    return (
      <MembrosShell>
        <div className="esv-page">
          <section className="esv-locked esv-glass esv-rise">
            <div className="esv-locked__in">
              <span className="esv-locked__icon">
                <MessageCircle size={24} strokeWidth={1.8} />
              </span>
              <p className="esv-row__kicker">Conta não ativada</p>
              <h1 className="esv-lesson__title">Seu acesso ainda está pendente</h1>
              <p className="esv-lesson__desc">
                Você entrou, mas ainda não tem perfil de cliente ativo. Isso costuma acontecer
                quando o cadastro não foi finalizado pelo time. Me chama no WhatsApp que eu ativo
                seu acesso na hora.
              </p>
              <p className="esv-hero__next" style={{ justifyContent: "center" }}>
                <span>E-mail autenticado</span>
                {user.email}
              </p>
              <Link href="https://wa.me/5551991443171" className="esv-btn" style={{ paddingLeft: 24 }}>
                Falar no WhatsApp
              </Link>
            </div>
          </section>
        </div>
      </MembrosShell>
    );
  }

  const typedClient = client as Client;

  const [{ data: lessons }, { data: progress }, { data: tasks }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("pillar_number")
      .order("order_in_pillar"),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
    supabase
      .from("client_tasks")
      .select("*")
      .eq("client_id", typedClient.id)
      .neq("status", "concluida")
      .order("due_date", { ascending: true, nullsFirst: false })
      .limit(6),
  ]);

  const progressByLesson = new Map(
    ((progress || []) as LessonProgress[]).map((p) => [p.lesson_id, p])
  );

  return (
    <MembrosShell>
      <DashboardView
        client={typedClient}
        lessons={(lessons || []) as Lesson[]}
        progressByLesson={progressByLesson}
        tasks={(tasks || []) as ClientTask[]}
      />
    </MembrosShell>
  );
}
