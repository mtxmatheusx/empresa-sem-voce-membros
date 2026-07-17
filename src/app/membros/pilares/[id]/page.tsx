import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { ArrowLeft, CheckCircle2, Circle, PlayCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDuration(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}min${s > 0 ? ` ${s}s` : ""}`;
}

export default async function PilarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pillarNum = parseInt(id, 10);

  if (isNaN(pillarNum) || pillarNum < 0 || pillarNum > 5) notFound();

  const info = PILLAR_INFO[pillarNum];
  if (!info) notFound();

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

  if (!client) redirect("/membros/dashboard");

  const typedClient = client as Client;

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("pillar_number", pillarNum)
      .eq("is_published", true)
      .order("order_in_pillar"),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
  ]);

  const allLessons = (lessons || []) as Lesson[];
  const progressByLesson = new Map(
    ((progress || []) as LessonProgress[]).map((p) => [p.lesson_id, p])
  );

  const completed = allLessons.filter(
    (l) => progressByLesson.get(l.id)?.completed_at != null
  ).length;
  const pct = allLessons.length > 0 ? Math.round((completed / allLessons.length) * 100) : 0;

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[1100px]">
        <Link
          href="/membros/pilares"
          className="inline-flex items-center gap-2 text-[13px] text-[#A09C92] hover:text-[#0F0E0C] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Todos os pilares
        </Link>

        <header className="mb-10">
          <p className="t-eyebrow">Pilar {pillarNum}</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">{info.name}</h1>
          <p className="font-serif italic text-[20px] text-[#6B6862] mt-4 max-w-2xl leading-tight">
            {info.tese}
          </p>
        </header>

        {/* Progresso do pilar */}
        <section className="mb-12 card-elevated p-7 bg-gradient-to-br from-white to-[#FAF7EE]">
          <div className="flex items-baseline justify-between mb-3">
            <p className="t-label">Progresso do pilar</p>
            <p className="font-display font-bold text-[20px] text-[#B8902A] tracking-[-0.02em]">
              {completed}/{allLessons.length} ({pct}%)
            </p>
          </div>
          <div className="h-2 bg-[#F4F2EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B8902A] rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </section>

        {/* Lista de aulas */}
        <section>
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Conteúdo</p>
            <h2 className="t-h3 text-[#0F0E0C]">Aulas</h2>
          </header>

          {allLessons.length === 0 ? (
            <div className="card-elevated p-10 text-center">
              <p className="font-serif italic text-[20px] text-[#A09C92] leading-relaxed">
                As aulas deste pilar serão liberadas em breve.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {allLessons.map((lesson, idx) => {
                const prog = progressByLesson.get(lesson.id);
                const isComplete = prog?.completed_at != null;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/membros/aulas/${lesson.id}`}
                      className="card-elevated p-5 flex items-center gap-5 hover:translate-x-[2px] transition-transform"
                    >
                      <span className="font-display font-bold text-[24px] text-[#A09C92] tracking-[-0.02em] w-8 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-[#0F0E0C] font-medium tracking-[-0.01em] leading-tight">
                          {lesson.title}
                        </p>
                        <p className="t-label mt-1">
                          {formatDuration(lesson.duration_seconds)}
                          {lesson.pdf_url && " · PDF disponível"}
                          {lesson.templates_urls?.length > 0 &&
                            ` · ${lesson.templates_urls.length} template(s)`}
                        </p>
                      </div>
                      {isComplete ? (
                        <CheckCircle2 size={20} className="text-[#2D7A4E] shrink-0" />
                      ) : prog ? (
                        <PlayCircle size={20} className="text-[#B8902A] shrink-0" />
                      ) : (
                        <Circle size={20} className="text-[#D4CFC0] shrink-0" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </MembrosShell>
  );
}
