import Link from "next/link";
import { Lead, STATUS_LABELS } from "@/types/lead";
import { Clock } from "lucide-react";

export function StaleLeads({ leads }: { leads: Lead[] }) {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const stale = leads
    .filter(
      (l) =>
        ["recebida", "triagem", "diag-agendado", "diag-feito", "proposta", "negociacao"].includes(l.status) &&
        new Date(l.updated_at) < threeDaysAgo
    )
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
    .slice(0, 6);

  function daysSince(date: string) {
    const ms = Date.now() - new Date(date).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="card-elevated p-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="t-label mb-2 flex items-center gap-2">
            <Clock size={11} className="text-[#6B6862]" strokeWidth={2} />
            Sem movimento
          </p>
          <h3 className="t-h4 text-[#0F0E0C]">Precisam de atenção</h3>
        </div>
        <span className="font-display font-bold text-[24px] text-[#0F0E0C] leading-none tracking-tight">
          {stale.length}
        </span>
      </header>

      {stale.length === 0 ? (
        <p className="font-serif italic text-[#A09C92] text-[15px]">
          Nenhum lead parado. Bom trabalho.
        </p>
      ) : (
        <ul className="space-y-3">
          {stale.map((lead) => {
            const days = daysSince(lead.updated_at);
            return (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between gap-4 py-3 border-b border-[#EAE6DC] last:border-0 hover:bg-[#F4F2EC]/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-[#0F0E0C] truncate tracking-[-0.01em]">
                      {lead.name}
                    </p>
                    <p className="text-[12px] text-[#6B6862] truncate">
                      {STATUS_LABELS[lead.status]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[11px] font-medium tracking-[-0.01em] ${
                        days >= 7 ? "text-[#C24842]" : "text-[#6B6862]"
                      }`}
                    >
                      {days}d parado
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
