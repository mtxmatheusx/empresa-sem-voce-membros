import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function shortLabel(l: Lesson) {
  if (l.pillar_number === 0) return "Onb";
  return `P${l.pillar_number}`;
}

export default async function ProgressoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/membros/login");

  const { data: isAdmin } = await supabase.rpc("esv_is_admin");
  if (isAdmin !== true) redirect("/membros/dashboard");

  const [{ data: clients }, { data: lessons }, { data: progress }] =
    await Promise.all([
      supabase.from("clients").select("*").order("name"),
      supabase
        .from("lessons")
        .select("*")
        .eq("is_published", true)
        .order("pillar_number")
        .order("order_in_pillar"),
      supabase.from("lesson_progress").select("*"),
    ]);

  const allClients = (clients || []) as Client[];
  const allLessons = (lessons || []) as Lesson[];
  const allProgress = (progress || []) as LessonProgress[];

  // índice: client_id -> lesson_id -> progresso
  const idx = new Map<string, Map<string, LessonProgress>>();
  for (const p of allProgress) {
    if (!idx.has(p.client_id)) idx.set(p.client_id, new Map());
    idx.get(p.client_id)!.set(p.lesson_id, p);
  }

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-10 max-w-[1100px] relative">
        <div className="esv-aura" />
        <header className="mb-8 relative">
          <p className="t-eyebrow">Administração · só você</p>
          <h1 className="t-h1 mt-3 text-[#F4F0E6]">Progresso dos alunos</h1>
          <p className="text-[14px] text-[#A39E93] mt-3 max-w-2xl">
            Quem assistiu e concluiu cada aula. Atualiza sozinho conforme os alunos
            avançam.
          </p>
        </header>

        {/* Legenda */}
        <div className="flex flex-wrap items-center gap-5 mb-5 text-[12px] text-[#A39E93]">
          <span className="flex items-center gap-2">
            <Dot kind="done" /> Concluiu
          </span>
          <span className="flex items-center gap-2">
            <Dot kind="watched" /> Assistiu
          </span>
          <span className="flex items-center gap-2">
            <Dot kind="none" /> Não iniciou
          </span>
        </div>

        {allClients.length === 0 ? (
          <div className="card-elevated p-8 text-center text-[14px] text-[#A39E93]">
            Nenhum aluno cadastrado ainda.
          </div>
        ) : (
          <div className="card-elevated p-2 md:p-4 overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left px-3 py-3 text-[11px] uppercase tracking-[0.12em] text-[#77726A] font-medium">
                    Aluno
                  </th>
                  {allLessons.map((l) => (
                    <th
                      key={l.id}
                      className="px-2 py-3 text-[11px] uppercase tracking-[0.08em] text-[#77726A] font-medium text-center"
                      title={l.title}
                    >
                      {shortLabel(l)}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-[11px] uppercase tracking-[0.1em] text-[#77726A] font-medium text-center">
                    %
                  </th>
                  <th className="px-3 py-3 text-[11px] uppercase tracking-[0.1em] text-[#77726A] font-medium text-right">
                    Última atividade
                  </th>
                </tr>
              </thead>
              <tbody>
                {allClients.map((c) => {
                  const pmap = idx.get(c.id) ?? new Map<string, LessonProgress>();
                  const done = allLessons.filter(
                    (l) => pmap.get(l.id)?.completed_at != null
                  ).length;
                  const pct =
                    allLessons.length > 0
                      ? Math.round((done / allLessons.length) * 100)
                      : 0;
                  const lastActs = [...pmap.values()]
                    .map((p) => p.last_watched_at)
                    .filter(Boolean) as string[];
                  const lastAct =
                    lastActs.length > 0
                      ? lastActs.sort().slice(-1)[0]
                      : null;

                  return (
                    <tr
                      key={c.id}
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <td className="px-3 py-3">
                        <p className="text-[14px] text-[#F4F0E6] leading-tight">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-[#77726A] truncate max-w-[180px]">
                          {c.email}
                        </p>
                      </td>
                      {allLessons.map((l) => {
                        const p = pmap.get(l.id);
                        const kind = p?.completed_at
                          ? "done"
                          : p?.last_watched_at
                          ? "watched"
                          : "none";
                        return (
                          <td key={l.id} className="px-2 py-3 text-center">
                            <span className="inline-flex justify-center">
                              <Dot kind={kind as DotKind} />
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-center">
                        <span className="text-[13px] font-semibold text-[#C9A227]">
                          {pct}%
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-[12px] text-[#A39E93] whitespace-nowrap">
                        {lastAct ? formatDate(lastAct) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Referência dos pilares */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#77726A]">
          <span>Onb · Boas-vindas</span>
          {[1, 2, 3, 4, 5].map((p) => (
            <span key={p}>
              P{p} · {PILLAR_INFO[p]?.name}
            </span>
          ))}
        </div>
      </div>
    </MembrosShell>
  );
}

type DotKind = "done" | "watched" | "none";

function Dot({ kind }: { kind: DotKind }) {
  const styles: Record<DotKind, React.CSSProperties> = {
    done: { background: "#5FB98A", boxShadow: "0 0 0 3px rgba(95,185,138,0.15)" },
    watched: { background: "#C9A227", boxShadow: "0 0 0 3px rgba(201,162,39,0.15)" },
    none: { background: "transparent", border: "1px solid rgba(255,255,255,0.22)" },
  };
  return (
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        display: "inline-block",
        ...styles[kind],
      }}
    />
  );
}
