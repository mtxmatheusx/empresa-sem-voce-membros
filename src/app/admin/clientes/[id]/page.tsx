import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  Client,
  ClientTask,
  Lesson,
  LessonProgress,
  CLIENT_STATUS_LABELS,
  PILLAR_INFO,
} from "@/types/client";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ClientDetailPanel } from "@/components/admin/ClientDetailPanel";

export const dynamic = "force-dynamic";

export default async function ClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: client },
    { data: lessons },
    { data: progress },
    { data: tasks },
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("*, lead:leads(company_name, company_sector)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("lessons").select("*").eq("is_published", true),
    supabase.from("lesson_progress").select("*").eq("client_id", id),
    supabase
      .from("client_tasks")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!client) notFound();
  type ClientWithLead = Client & {
    lead: { company_name: string | null; company_sector: string | null } | null;
  };
  const c = client as ClientWithLead;

  const allLessons = (lessons || []) as Lesson[];
  const allProgress = (progress || []) as LessonProgress[];
  const progressByLesson = new Map(allProgress.map((p) => [p.lesson_id, p]));

  const pillars = [1, 2, 3, 4, 5].map((p) => {
    const pillarLessons = allLessons.filter((l) => l.pillar_number === p);
    const completed = pillarLessons.filter(
      (l) => progressByLesson.get(l.id)?.completed_at != null
    ).length;
    return {
      number: p,
      info: PILLAR_INFO[p],
      total: pillarLessons.length,
      completed,
    };
  });

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-[1300px]">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-2 text-[13px] text-[#A09C92] hover:text-[#0F0E0C] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Todos os clientes
        </Link>

        <header className="mb-10">
          <p className="t-eyebrow">Cliente</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">{c.name}</h1>
          <p className="font-serif italic text-[18px] text-[#6B6862] mt-3">
            {c.lead?.company_name || c.email}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {/* Dados principais */}
          <div className="card-elevated p-7 lg:col-span-2">
            <p className="t-eyebrow mb-6">Dados</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Email" value={c.email} />
              <Field label="WhatsApp" value={c.whatsapp || "—"} />
              <Field label="Status" value={CLIENT_STATUS_LABELS[c.status]} />
              <Field
                label="Pilar atual"
                value={`${c.current_pillar}. ${PILLAR_INFO[c.current_pillar]?.name ?? "—"}`}
              />
              <Field label="Início" value={formatDate(c.started_at)} />
              <Field
                label="Progresso"
                value={`${c.completion_pct}%`}
              />
              <Field
                label="Health score"
                value={c.health_score ? `${c.health_score}/5` : "—"}
              />
              <Field label="Setor" value={c.lead?.company_sector || "—"} />
            </div>
          </div>

          {/* Progresso por pilar */}
          <div className="card-elevated p-7">
            <p className="t-eyebrow mb-6">Progresso por pilar</p>
            <ul className="space-y-4">
              {pillars.map((p) => {
                const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                return (
                  <li key={p.number}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-[13px] text-[#0F0E0C] font-medium">
                        {p.number}. {p.info.name}
                      </span>
                      <span className="text-[11px] text-[#6B6862] tabular-nums">
                        {p.completed}/{p.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#F4F2EC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#B8902A] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <ClientDetailPanel
          clientId={c.id}
          initialTasks={(tasks || []) as ClientTask[]}
        />
      </div>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="t-label mb-1.5">{label}</p>
      <p className="text-[14px] text-[#0F0E0C] tracking-[-0.01em]">{value}</p>
    </div>
  );
}
