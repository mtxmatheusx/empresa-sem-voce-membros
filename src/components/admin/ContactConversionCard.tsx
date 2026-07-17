import { createClient } from "@/lib/supabase/server";
import { MessageCircle } from "lucide-react";

export async function ContactConversionCard() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("lead_events")
    .select("lead_id, event_type")
    .eq("event_type", "contact_sent");

  const contactedIds = Array.from(new Set((events || []).map((e) => e.lead_id)));

  if (contactedIds.length === 0) {
    return (
      <div className="card-elevated p-8">
        <header className="mb-6 flex items-baseline justify-between">
          <div>
            <p className="t-label mb-2 flex items-center gap-2">
              <MessageCircle size={11} className="text-[#25D366]" strokeWidth={2} />
              WhatsApp
            </p>
            <h3 className="t-h4 text-[#0F0E0C]">Taxa de resposta</h3>
          </div>
        </header>
        <p className="font-serif italic text-[#A09C92] text-[15px]">
          Nenhum contato enviado ainda.
        </p>
      </div>
    );
  }

  const { data: contactedLeads } = await supabase
    .from("leads")
    .select("id, status")
    .in("id", contactedIds);

  const total = contactedIds.length;
  const advanced = (contactedLeads || []).filter((l) =>
    ["diag-agendado", "diag-feito", "proposta", "negociacao", "fechou"].includes(l.status)
  ).length;
  const fechou = (contactedLeads || []).filter((l) => l.status === "fechou").length;

  const responseRate = total > 0 ? Math.round((advanced / total) * 100) : 0;
  const closeRate = total > 0 ? Math.round((fechou / total) * 100) : 0;

  return (
    <div className="card-elevated p-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="t-label mb-2 flex items-center gap-2">
            <MessageCircle size={11} className="text-[#25D366]" strokeWidth={2} />
            WhatsApp
          </p>
          <h3 className="t-h4 text-[#0F0E0C]">Taxa de resposta</h3>
        </div>
        <p className="font-display font-bold text-[28px] text-[#2D7A4E] leading-none tracking-tight">
          {responseRate}%
        </p>
      </header>

      <div className="space-y-3">
        <Row label="Contatos enviados" value={total} />
        <Row label="Avançaram após contato" value={advanced} accent="green" />
        <Row label="Fecharam após contato" value={fechou} accent="gold" />
        <div className="pt-3 mt-3 border-t border-[#EAE6DC]">
          <Row label="Taxa de fechamento por contato" value={`${closeRate}%`} accent="gold" />
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: "green" | "gold";
}) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-[#6B6862]">{label}</span>
      <span
        className={`font-medium tracking-[-0.005em] ${
          accent === "green"
            ? "text-[#2D7A4E]"
            : accent === "gold"
            ? "text-[#B8902A]"
            : "text-[#0F0E0C]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
