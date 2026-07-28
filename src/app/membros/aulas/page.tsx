import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { LessonCard } from "@/components/membros/LessonCard";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { Play } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AulasCatalogPage() {
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
      .eq("is_published", true)
      .order("pillar_number")
      .order("order_in_pillar"),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
  ]);

  const allLessons = (lessons || []) as Lesson[];
  const progressByLesson = new Map(
    ((progress || []) as LessonProgress[]).map((p) => [p.lesson_id, p])
  );

  // primeiro conteúdo desbloqueado — pro botão do hero
  const firstPlayable = allLessons.find((l) => !l.is_locked);

  // agrupa por pilar (0 = boas-vindas)
  const pillarOrder = [0, 1, 2, 3, 4, 5];
  const rows = pillarOrder
    .map((p) => ({
      number: p,
      info: PILLAR_INFO[p],
      lessons: allLessons.filter((l) => l.pillar_number === p),
    }))
    .filter((r) => r.lessons.length > 0 && r.info);

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-10 max-w-[1400px]">
        {/* Hero destaque */}
        <section className="esv-hero mb-12 anim-fade-in">
          <div className="esv-hero__veil" />
          <div className="relative p-8 md:p-12 max-w-2xl">
            <p className="t-eyebrow mb-3">Programa Empresa Sem Você</p>
            <h1 className="font-display font-bold text-[clamp(1.9rem,1.5rem+1.8vw,3rem)] leading-[1.05] tracking-[-0.03em] text-[#F5F5F5]">
              Sua empresa rodando
              <br />
              <span className="font-serif italic text-[#C9A227]">sem você no operacional.</span>
            </h1>
            <p className="text-[15px] md:text-[16px] text-[#A0A0A0] leading-relaxed mt-4 max-w-lg">
              Método completo em 5 pilares. Assista no seu ritmo, aplique e acompanhe
              seu progresso.
            </p>
            {firstPlayable && (
              <Link
                href={`/membros/aulas/${firstPlayable.id}`}
                className="inline-flex items-center gap-2 mt-7 px-7 h-12 rounded-full font-semibold text-[15px] text-[#0C0C0C]"
                style={{ background: "linear-gradient(135deg,#C9A227,#D4AF37)" }}
              >
                <Play size={18} fill="#0C0C0C" />
                Começar por aqui
              </Link>
            )}
          </div>
        </section>

        {/* Prateleiras por pilar */}
        <div className="space-y-4">
          {rows.map((row, i) => (
            <section
              key={row.number}
              className="esv-row"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="flex items-baseline gap-3 mb-1 px-1">
                <h2 className="text-[18px] md:text-[20px] font-semibold text-[#F5F5F5] tracking-[-0.01em]">
                  {row.number === 0
                    ? row.info.name
                    : `${row.number}. ${row.info.name}`}
                </h2>
                <span className="t-label hidden sm:block">{row.info.tese}</span>
              </div>
              <div className="esv-rail">
                {row.lessons.map((lesson) => {
                  const prog = progressByLesson.get(lesson.id);
                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      pillarLabel={
                        row.number === 0 ? "Boas-vindas" : `Pilar ${row.number}`
                      }
                      watchedPct={prog?.watched_pct ?? 0}
                      completed={prog?.completed_at != null}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </MembrosShell>
  );
}
