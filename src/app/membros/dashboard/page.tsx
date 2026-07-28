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
import { ArrowRight, Circle, PlayCircle } from "lucide-react";

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
        <div className="px-6 md:px-10 py-12 max-w-[1100px] relative">
          <div className="esv-aura" />
          <header className="mb-16 relative">
            <p className="t-eyebrow">Conta não ativada</p>
            <h1 className="t-h1 mt-3 text-[#F5F5F5]">Acesso pendente</h1>
          </header>
          <div className="card-elevated p-10 max-w-2xl relative">
            <p className="font-serif italic text-[24px] text-[#F5F5F5] leading-tight mb-4">
              Você está autenticado, mas ainda não tem perfil de cliente ativo.
            </p>
            <p className="text-[15px] text-[#A0A0A0] leading-relaxed mb-6">
              Isso costuma acontecer quando o cadastro ainda não foi finalizado pelo
              time. Me chama no WhatsApp que ativo seu acesso na hora.
            </p>
            <p className="t-label">Email autenticado</p>
            <p className="text-[14px] text-[#F5F5F5] mt-2">{user.email}</p>
          </div>
        </div>
      </MembrosShell>
    );
  }

  const typedClient = client as Client;

  const [{ data: lessons }, { data: progress }, { data: tasks }] =
    await Promise.all([
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

  const pillars = [1, 2, 3, 4, 5].map((p) => {
    const pillarLessons = allLessons.filter((l) => l.pillar_number === p);
    const completed = pillarLessons.filter(
      (l) => progressByLesson.get(l.id)?.completed_at != null
    ).length;
    return { number: p, info: PILLAR_INFO[p], total: pillarLessons.length, completed };
  });

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[1200px] relative">
        <div className="esv-aura" />
        <header className="mb-12 relative">
          <p className="t-eyebrow">Seu painel</p>
          <h1 className="t-h1 mt-3 text-[#F5F5F5]">
            Olá, <span className="font-serif italic text-[#C9A227]">{firstName}</span>
          </h1>
        </header>

        {/* Pilar atual + progresso */}
        <section className="mb-10 relative">
          <div className="card-elevated p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <p className="t-eyebrow mb-3">Pilar atual</p>
                <h2 className="font-display font-bold text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.05] tracking-[-0.025em] text-[#F5F5F5]">
                  {typedClient.current_pillar}. {currentPillar.name}
                </h2>
                <p className="font-serif italic text-[18px] text-[#A0A0A0] mt-3 max-w-xl">
                  {currentPillar.tese}
                </p>
              </div>
              <Link
                href="/membros/aulas"
                className="inline-flex items-center gap-2 text-[14px] text-[#C9A227] hover:opacity-70 transition-opacity self-start md:self-auto"
              >
                Ver aulas
                <ArrowRight size={14} />
              </Link>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="t-label">Progresso geral</p>
                <p className="font-display font-bold text-[22px] text-[#C9A227] tracking-[-0.02em]">
                  {typedClient.completion_pct}%
                </p>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${typedClient.completion_pct}%`,
                    background: "linear-gradient(90deg,#C9A227,#D4AF37)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Retomar + tarefas */}
        <section className="grid md:grid-cols-2 gap-6 mb-12 relative">
          <div className="card-elevated p-8">
            <p className="t-eyebrow mb-4">Retomar</p>
            {lastWatchedLesson ? (
              <div>
                <p className="font-serif italic text-[20px] text-[#F5F5F5] leading-tight mb-2">
                  {lastWatchedLesson.title}
                </p>
                <p className="t-label mb-6">
                  Pilar {lastWatchedLesson.pillar_number} ·{" "}
                  {PILLAR_INFO[lastWatchedLesson.pillar_number]?.name}
                </p>
                <Link
                  href={`/membros/aulas/${lastWatchedLesson.id}`}
                  className="inline-flex items-center gap-2 text-[14px] text-[#C9A227] hover:opacity-70"
                >
                  <PlayCircle size={16} />
                  Continuar de onde parou
                </Link>
              </div>
            ) : (
              <p className="font-serif italic text-[18px] text-[#6E6E6E] leading-relaxed">
                Você ainda não começou nenhuma aula. Quando começar, ela aparece aqui.
              </p>
            )}
          </div>

          <div className="card-elevated p-8">
            <p className="t-eyebrow mb-4">Suas tarefas</p>
            {pendingTasks.length === 0 ? (
              <p className="font-serif italic text-[18px] text-[#6E6E6E] leading-relaxed">
                Nada pendente agora. Bom momento pra avançar uma aula.
              </p>
            ) : (
              <ul className="space-y-3">
                {pendingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 py-2"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    <Circle size={16} className="text-[#C9A227] mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[14px] text-[#F5F5F5] leading-tight">
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

        {/* Os 5 pilares */}
        <section className="relative">
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Método completo</p>
            <h2 className="t-h3 text-[#F5F5F5]">Os 5 pilares</h2>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p) => {
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              const isCurrent = typedClient.current_pillar === p.number;
              return (
                <Link
                  key={p.number}
                  href="/membros/aulas"
                  className="card-elevated p-7"
                  style={
                    isCurrent
                      ? { boxShadow: "inset 0 0 0 1px rgba(201,162,39,0.4)" }
                      : undefined
                  }
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-display font-bold text-[42px] leading-none text-[#C9A227] tracking-[-0.03em]">
                      {p.number}
                    </span>
                    {p.total > 0 && (
                      <span className="t-label">
                        {p.completed}/{p.total}
                      </span>
                    )}
                  </div>
                  <p className="font-serif italic text-[17px] text-[#F5F5F5] leading-tight mb-2">
                    {p.info.name}
                  </p>
                  <p className="text-[13px] text-[#A0A0A0] leading-relaxed mb-5 min-h-[2.5em]">
                    {p.info.tese}
                  </p>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C9A227,#D4AF37)" }}
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
