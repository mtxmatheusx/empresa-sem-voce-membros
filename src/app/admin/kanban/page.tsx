import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
import { Lead } from "@/types/lead";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const supabase = await createClient();
  const [{ data: leads }, { data: events }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
    supabase.from("lead_events").select("lead_id, event_type, created_at"),
  ]);

  const allEvents = events || [];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const leadIdsContactedToday = Array.from(
    new Set(
      allEvents
        .filter(
          (e) =>
            e.event_type === "contact_sent" &&
            new Date(e.created_at) >= todayStart
        )
        .map((e) => e.lead_id)
    )
  );

  const leadIdsContacted = Array.from(
    new Set(
      allEvents
        .filter((e) => e.event_type === "contact_sent")
        .map((e) => e.lead_id)
    )
  );

  const leadIdsAnalyzed = Array.from(
    new Set(
      allEvents.filter((e) => e.event_type === "ai_analysis").map((e) => e.lead_id)
    )
  );

  return (
    <AdminShell>
      <div className="px-10 py-12">
        <header className="mb-12">
          <p className="t-eyebrow">Pipeline</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Kanban</h1>
          <p className="t-body-lg mt-4 max-w-2xl">
            Arraste os cards entre colunas para mover a etapa da venda. Use os filtros para focar no que importa agora.
          </p>
        </header>
        <KanbanBoard
          initialLeads={(leads || []) as Lead[]}
          leadIdsContactedToday={leadIdsContactedToday}
          leadIdsContacted={leadIdsContacted}
          leadIdsAnalyzed={leadIdsAnalyzed}
        />
      </div>
    </AdminShell>
  );
}
