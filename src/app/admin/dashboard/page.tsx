import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Lead, STATUS_LABELS } from "@/types/lead";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LeadsByDayChart } from "@/components/admin/LeadsByDayChart";
import { HotLeads } from "@/components/admin/HotLeads";
import { StaleLeads } from "@/components/admin/StaleLeads";
import { InvestmentReadyDonut } from "@/components/admin/InvestmentReadyDonut";
import { ContactConversionCard } from "@/components/admin/ContactConversionCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const allLeads: Lead[] = leads || [];
  const total = allLeads.length;
  const last7Days = allLeads.filter(
    (l) => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const last30Days = allLeads.filter(
    (l) => new Date(l.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const qualified = allLeads.filter((l) =>
    ["diag-agendado", "diag-feito", "proposta", "negociacao", "fechou"].includes(l.status)
  ).length;
  const fechou = allLeads.filter((l) => l.status === "fechou").length;
  const qualificationRate = total > 0 ? Math.round((qualified / total) * 100) : 0;
  const conversionRate = qualified > 0 ? Math.round((fechou / qualified) * 100) : 0;

  // Trend vs prev period
  const prev7Days = allLeads.filter((l) => {
    const d = new Date(l.created_at).getTime();
    return d > Date.now() - 14 * 86400000 && d <= Date.now() - 7 * 86400000;
  }).length;
  const trend7d = prev7Days > 0 ? Math.round(((last7Days - prev7Days) / prev7Days) * 100) : null;

  const byStatus = Object.fromEntries(
    Object.keys(STATUS_LABELS).map((s) => [s, allLeads.filter((l) => l.status === s).length])
  );

  const recentLeads = allLeads.slice(0, 6);

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-[1400px]">
        <header className="mb-16">
          <p className="t-eyebrow">Visão geral</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Dashboard</h1>
        </header>

        {/* Métricas */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric label="Total de leads" value={total} />
            <Metric label="Últimos 7 dias" value={last7Days} accent trend={trend7d} />
            <Metric label="Taxa qualificação" value={`${qualificationRate}%`} />
            <Metric label="Taxa conversão" value={`${conversionRate}%`} />
          </div>
        </section>

        {/* Charts row 1 */}
        <section className="mb-8">
          <LeadsByDayChart leads={allLeads} />
        </section>

        {/* Hot + Stale row */}
        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <HotLeads leads={allLeads} />
          <StaleLeads leads={allLeads} />
        </section>

        {/* WhatsApp conversion + donut */}
        <section className="grid md:grid-cols-2 gap-4 mb-8">
          <ContactConversionCard />
          <InvestmentReadyDonut leads={allLeads} />
        </section>

        {/* Funnel */}
        <section className="mb-8">
          <div className="card-elevated p-8">
            <header className="mb-6">
              <p className="t-label mb-2">Pipeline</p>
              <h3 className="t-h4 text-[#0F0E0C]">Funil de qualificação</h3>
            </header>
            <div className="space-y-2">
              {Object.entries(STATUS_LABELS).map(([status, label]) => {
                const count = byStatus[status] || 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={status} className="flex items-center gap-4">
                    <div className="w-40 text-[12px] text-[#6B6862] font-medium tracking-[-0.005em]">
                      {label}
                    </div>
                    <div className="flex-1 h-8 bg-[#F4F2EC] rounded-md relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B8902A]/30 to-[#B8902A]/10 border-r border-[#B8902A] transition-all duration-700"
                        style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-3 text-[12px] text-[#0F0E0C] font-medium tracking-tight">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Últimos leads */}
        <section>
          <header className="flex items-center justify-between mb-8">
            <div>
              <p className="t-eyebrow mb-2">Atividade recente</p>
              <h2 className="t-h3 text-[#0F0E0C]">Últimas aplicações</h2>
            </div>
            <Link
              href="/admin/kanban"
              className="flex items-center gap-2 text-[14px] text-[#B8902A] hover:opacity-70 transition-opacity"
            >
              Ver kanban
              <ArrowRight size={14} />
            </Link>
          </header>

          <div className="card-elevated overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#FAFAF7] border-b border-[#EAE6DC]">
                <tr>
                  <th className="text-left t-label py-4 px-6">Nome</th>
                  <th className="text-left t-label py-4 px-6">Empresa</th>
                  <th className="text-left t-label py-4 px-6">Status</th>
                  <th className="text-left t-label py-4 px-6">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 px-6 text-center">
                      <p className="font-serif italic text-[#A09C92] text-lg">
                        Nenhuma aplicação ainda.
                      </p>
                      <p className="t-body text-sm mt-2">
                        As primeiras vão aparecer aqui.
                      </p>
                    </td>
                  </tr>
                )}
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#EAE6DC] last:border-0 hover:bg-[#FAFAF7] transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-[#0F0E0C] hover:text-[#B8902A] font-medium text-[15px] tracking-[-0.01em] transition-colors"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-[#6B6862]">
                      {lead.company_name || "—"}
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 bg-[#F4F2EC] text-[#6B6862] rounded-full">
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-[13px] text-[#A09C92]">
                      {formatDateTime(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function Metric({
  label,
  value,
  accent,
  trend,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  trend?: number | null;
}) {
  return (
    <div className="card-elevated p-7">
      <p className="t-label mb-5">{label}</p>
      <div className="flex items-baseline gap-3">
        <p
          className={`font-display font-bold text-[44px] leading-none tracking-[-0.03em] ${
            accent ? "text-[#B8902A]" : "text-[#0F0E0C]"
          }`}
        >
          {value}
        </p>
        {trend !== null && trend !== undefined && (
          <span
            className={`text-[12px] font-medium tracking-[-0.01em] ${
              trend > 0
                ? "text-[#2D7A4E]"
                : trend < 0
                ? "text-[#C24842]"
                : "text-[#6B6862]"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
    </div>
  );
}
