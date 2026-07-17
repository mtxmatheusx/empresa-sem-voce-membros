import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function PilaresIndexPage() {
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
    supabase.from("lessons").select("*").eq("is_published", true),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
  ]);

  const allLessons = (lessons || []) as Lesson[];
  const progressByLesson = new Map(
    ((progress || []) as LessonProgress[]).map((p) => [p.lesson_id, p])
  );

  const pillars = [1, 2, 3, 4, 5].map((p) => {
    const pillarLessons = allLessons.filter((l) => l.pillar_number === p);
    const completed = pillarLessons.filter(
      (l) => progressByLesson.get(l.id)?.completed_at != null
    ).length;
    return { number: p, info: PILLAR_INFO[p], total: pillarLessons.length, completed };
  });

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[1200px]">
        <header className="mb-12">
          <p className="t-eyebrow">Método completo</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Os 5 pilares</h1>
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
      </div>
    </MembrosShell>
  );
}
