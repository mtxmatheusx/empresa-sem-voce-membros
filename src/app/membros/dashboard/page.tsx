import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import {
  Client,
  ClientTask,
  Lesson,
  LessonProgress,
  PILLAR_INFO,
} from "@/types/client";
import { ArrowRight, CheckCircle2, Circle, PlayCircle } from "lucide-react";

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
        <div className="px-6 md:px-10 py-12 max-w-[1100px]">
          <header className="mb-16">
            <p className="t-eyebrow">Conta não ativada</p>
            <h1 className="t-h1 mt-3 text-[#0F0E0C]">Acesso pendente</h1>
          </header>
          <div className="card-elevated p-10 max-w-2xl">
            <p className="font-serif italic text-[24px] text-[#0F0E0C] leading-tight mb-4">
              Você está autenticado, mas ainda não tem perfil de cliente ativo.
            </p>
            <p className="text-[15px] text-[#6B6862] leading-relaxed mb-6">
              Isso costuma acontecer quando o cadastro do cliente ainda não foi finalizado pelo time. Me chama no WhatsApp que ativo o seu acesso na hora.
            </p>
            <p className="t-label">Email autenticado</p>
            <p className="text-[14px] text-[#0F0E0C] mt-2">{user.email}</p>
          </div>
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
      .limit(5),
  ]);

  const allLessons = (lessons || []) as Lesson[];
  const allProgress = (progress || []) as LessonProgress[];
  const pendingTasks = (tasks || []) as ClientTask[];

  const progressByLesson = new Map(allProgress.map((p) => [p.lesson_id, p]));

  // Última aula assistida (mais recente last_watched_at não-null)
  const lastWatchedProgress = [...allProgress]
    .filter((p) => p.last_watched_at)
    .sort(
      (a, b) =>
        new Date(b.last_watched_at!).getTime() -
        new Date(a.last_watched_at!).getTime()
    )[0];
  const lastWatchedLesson = lastWatchedProgress
    ? allLessons.find((l) => l.id === lastWatchedProgress.lesson_id)
    : undefined;

  const firstName = typedClient.name.split(" ")[0];
  const currentPillar = PILLAR_INFO[typedClient.current_pillar] || PILLAR_INFO[1];

  // Contagem de aulas por pilar e completas
  const pillars = [1, 2, 3, 4, 5].map((p) => {
    const pillarLessons = allLessons.filter((l) => l.pillar_number === p);
    const completed = pillarLessons.filter((l) => {
      const prog = progressByLesson.get(l.id);
      return prog?.completed_at != null;
    }).length;
    return {
      number: p,
      info: PILLAR_INFO[p],
      total: pillarLessons.length,
      completed,
    };
  });

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[1200px]">
        <header className="mb-12">
          <p className="t-eyebrow">Seu painel</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">
            Olá, <span className="font-serif italic">{firstName}</span>
          </h1>
        </header>

        {/* Pilar atual + progresso */}
        <section className="mb-10">
          <div className="card-elevated p-8 md:p-10 bg-gradient-to-br from-white to-[#FAF7EE]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <p className="t-eyebrow mb-3">Pilar atual</p>
                <h2 className="font-display font-bold text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.05] tracking-[-0.025em] text-[#0F0E0C]">
                  {typedClient.current_pillar}. {currentPillar.name}
                </h2>
                <p className="font-serif italic text-[18px] text-[#6B6862] mt-3 max-w-xl">
                  {currentPillar.tese}
                </p>
              </div>
              <Link
                href={`/membros/pilares/${typedClient.current_pillar}`}
                className="inline-flex items-center gap-2 text-[14px] text-[#B8902A] hover:opacity-70 transition-opacity self-start md:self-auto"
              >
                Ver aulas
                <ArrowRight size={14} />
              </Link>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="t-label">Progresso geral</p>
                <p className="font-display font-bold text-[22px] text-[#B8902A] tracking-[-0.02em]">
                  {typedClient.completion_pct}%
                </p>
              </div>
              <div className="h-2 bg-[#F4F2EC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B8902A] rounded-full transition-all duration-700"
                  style={{ width: `${typedClient.completion_pct}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Última aula + tarefas */}
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Retomar aula */}
          <div className="card-elevated p-8">
            <p className="t-eyebrow mb-4">Retomar</p>
            {lastWatchedLesson ? (
              <div>
                <p className="font-serif italic text-[20px] text-[#0F0E0C] leading-tight mb-2">
                  {lastWatchedLesson.title}
                </p>
                <p className="t-label mb-6">
                  Pilar {lastWatchedLesson.pillar_number} ·{" "}
                  {PILLAR_INFO[lastWatchedLesson.pillar_number]?.name}
                </p>
                <Link
                  href={`/membros/aulas/${lastWatchedLesson.id}`}
                  className="inline-flex items-center gap-2 text-[14px] text-[#B8902A] hover:opacity-70"
                >
                  <PlayCircle size={16} />
                  Continuar de onde parou
                </Link>
              </div>
            ) : (
              <p className="font-serif italic text-[18px] text-[#A09C92] leading-relaxed">
                Você ainda não começou nenhuma aula. Quando começar, ela aparece aqui.
              </p>
            )}
          </div>

          {/* Tarefas pendentes */}
          <div className="card-elevated p-8">
            <p className="t-eyebrow mb-4">Suas tarefas</p>
            {pendingTasks.length === 0 ? (
              <p className="font-serif italic text-[18px] text-[#A09C92] leading-relaxed">
                Nada pendente agora. Bom momento pra avançar uma aula.
              </p>
            ) : (
              <ul className="space-y-3">
                {pendingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 py-2 border-b border-[#EAE6DC] last:border-0"
                  >
                    <Circle size={16} className="text-[#B8902A] mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[14px] text-[#0F0E0C] leading-tight">
                        {task.title}
                      </p>
                      {task.due_date && (
                        <p className="t-label mt-1">
                          Pra {new Date(task.due_date).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Cards dos 5 pilares */}
        <section>
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Método completo</p>
            <h2 className="t-h3 text-[#0F0E0C]">Os 5 pilares</h2>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p) => {
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              const isCurrent = typedClient.current_pillar === p.number;
              return (
                <Link
                  key={p.number}
                  href={`/membros/pilares/${p.number}`}
                  className={`card-elevated p-7 transition-all hover:translate-y-[-2px] ${
                    isCurrent ? "ring-1 ring-[#B8902A]/40" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-display font-bold text-[42px] leading-none text-[#B8902A] tracking-[-0.03em]">
                      {p.number}
                    </span>
                    {p.total > 0 && (
                      <span className="t-label">
                        {p.completed}/{p.total}
                      </span>
                    )}
                  </div>
                  <p className="font-serif italic text-[17px] text-[#0F0E0C] leading-tight mb-2">
                    {p.info.name}
                  </p>
                  <p className="text-[13px] text-[#6B6862] leading-relaxed mb-5 min-h-[2.5em]">
                    {p.info.tese}
                  </p>
                  <div className="h-1 bg-[#F4F2EC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B8902A] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </MembrosShell>
  );
}

// Suppress unused warning — kept for future "completed" badge
void CheckCircle2;
