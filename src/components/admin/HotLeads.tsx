import Link from "next/link";
import { Lead, STATUS_LABELS } from "@/types/lead";
import { formatDate } from "@/lib/utils";
import { Flame } from "lucide-react";

export function HotLeads({ leads }: { leads: Lead[] }) {
  const hot = leads
    .filter(
      (l) =>
        l.investment_ready === "Sim, estou pronto" &&
        !["fechou", "perdeu"].includes(l.status)
    )
    .slice(0, 6);

  return (
    <div className="card-elevated p-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="t-label mb-2 flex items-center gap-2">
            <Flame size={11} className="text-[#C24842]" strokeWidth={2} />
            Prioridade
          </p>
          <h3 className="t-h4 text-[#0F0E0C]">Leads quentes</h3>
        </div>
        <span className="font-display font-bold text-[24px] text-[#C24842] leading-none tracking-tight">
          {hot.length}
        </span>
      </header>

      {hot.length === 0 ? (
        <p className="font-serif italic text-[#A09C92] text-[15px]">
          Nenhum lead pronto pra investir aguardando.
        </p>
      ) : (
        <ul className="space-y-3">
          {hot.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="flex items-center justify-between gap-4 py-3 border-b border-[#EAE6DC] last:border-0 hover:bg-[#F4F2EC]/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[#0F0E0C] truncate tracking-[-0.01em]">
                    {lead.name}
                  </p>
                  <p className="text-[12px] text-[#6B6862] truncate font-serif italic">
                    {lead.company_name || "—"}
                    {lead.employees_range && ` · ${lead.employees_range} func`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#6B6862]">
                    {STATUS_LABELS[lead.status]}
                  </p>
                  <p className="text-[10px] text-[#A09C92] mt-1">
                    {formatDate(lead.created_at)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
