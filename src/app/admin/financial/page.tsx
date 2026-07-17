import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Lead, LeadStatus, STATUS_LABELS, STATUS_PROBABILITY, Product } from "@/types/lead";

export const dynamic = "force-dynamic";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function FinancialPage() {
  const supabase = await createClient();
  const [{ data: leads }, { data: products }, { data: events }] = await Promise.all([
    supabase.from("leads").select("*"),
    supabase.from("products").select("*").eq("is_active", true),
    supabase.from("lead_events").select("lead_id, event_type, payload"),
  ]);

  const allLeads = (leads || []) as Lead[];
  const allProducts = (products || []) as Product[];
  const allEvents = events || [];

  const productById = new Map(allProducts.map((p) => [p.id, p]));

  // Helper: pega ticket esperado de um lead (proposed, ou produto principal default)
  const expectedValue = (l: Lead): number => {
    if (l.closed_value) return Number(l.closed_value);
    if (l.final_product_id) return Number(productById.get(l.final_product_id)?.price || 0);
    if (l.proposed_product_id) return Number(productById.get(l.proposed_product_id)?.price || 0);
    // fallback: Principal R$36k
    const principal = allProducts.find((p) => p.slug === "principal");
    return Number(principal?.price || 36000);
  };

  // Fechou (faturamento real)
  const fechouLeads = allLeads.filter((l) => l.status === "fechou");
  const totalFaturado = fechouLeads.reduce((sum, l) => sum + expectedValue(l), 0);

  const now = new Date();
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startYear = new Date(now.getFullYear(), 0, 1);
  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const fatThisMonth = fechouLeads
    .filter((l) => new Date(l.closed_at || l.updated_at) >= startMonth)
    .reduce((sum, l) => sum + expectedValue(l), 0);
  const fatYear = fechouLeads
    .filter((l) => new Date(l.closed_at || l.updated_at) >= startYear)
    .reduce((sum, l) => sum + expectedValue(l), 0);
  const fatPrevMonth = fechouLeads
    .filter((l) => {
      const d = new Date(l.closed_at || l.updated_at);
      return d >= startPrevMonth && d < startMonth;
    })
    .reduce((sum, l) => sum + expectedValue(l), 0);

  const monthTrend =
    fatPrevMonth > 0
      ? Math.round(((fatThisMonth - fatPrevMonth) / fatPrevMonth) * 100)
      : null;

  // Pipeline value (proposta + negociação)
  const pipelineLeads = allLeads.filter((l) =>
    ["proposta", "negociacao"].includes(l.status)
  );
  const pipelineValue = pipelineLeads.reduce((sum, l) => sum + expectedValue(l), 0);

  // Forecast = expected × probability por etapa (excluindo fechou e perdeu)
  const activeLeads = allLeads.filter((l) => !["fechou", "perdeu"].includes(l.status));
  const forecast = activeLeads.reduce(
    (sum, l) => sum + expectedValue(l) * STATUS_PROBABILITY[l.status as LeadStatus],
    0
  );

  // Perdas em R$
  const perdeuLeads = allLeads.filter((l) => l.status === "perdeu");
  const perdidoValue = perdeuLeads.reduce((sum, l) => sum + expectedValue(l), 0);

  // Taxa de fechamento
  const qualifiedLeads = allLeads.filter((l) =>
    ["diag-feito", "proposta", "negociacao", "fechou", "perdeu"].includes(l.status)
  );
  const closeRate =
    qualifiedLeads.length > 0
      ? Math.round((fechouLeads.length / qualifiedLeads.length) * 100)
      : 0;

  // Ticket médio
  const avgTicket =
    fechouLeads.length > 0 ? Math.round(totalFaturado / fechouLeads.length) : 0;

  // Tempo médio funnel (lead criado → closed_at)
  const fechouComData = fechouLeads.filter((l) => l.closed_at);
  const avgDaysToClose =
    fechouComData.length > 0
      ? Math.round(
          fechouComData.reduce((sum, l) => {
            const diff =
              new Date(l.closed_at!).getTime() - new Date(l.created_at).getTime();
            return sum + diff / (1000 * 60 * 60 * 24);
          }, 0) / fechouComData.length
        )
      : null;

  // ============================================
  // Taxas do funil de reunião
  // ============================================

  // Leads que JÁ FORAM contatados (eventos contact_sent)
  const contactedLeadIds = new Set(
    allEvents.filter((e) => e.event_type === "contact_sent").map((e) => e.lead_id)
  );

  // Leads que JÁ PASSARAM por diag-agendado em algum momento
  // (via status_changed where payload.to === 'diag-agendado' OU status atual a partir de diag-agendado)
  const everAgendadoIds = new Set<string>();
  allEvents.forEach((e) => {
    if (e.event_type === "status_changed") {
      const p = e.payload as { to?: string } | null;
      if (p?.to === "diag-agendado") everAgendadoIds.add(e.lead_id);
    }
  });
  // Também conta leads cujo status atual já passou de "diag-agendado"
  allLeads.forEach((l) => {
    if (
      ["diag-agendado", "diag-feito", "proposta", "negociacao", "fechou"].includes(
        l.status
      )
    ) {
      everAgendadoIds.add(l.id);
    }
  });

  // Leads que efetivamente FIZERAM o diagnóstico (avançaram pra diag-feito ou além)
  const everFeitoIds = new Set<string>();
  allLeads.forEach((l) => {
    if (["diag-feito", "proposta", "negociacao", "fechou"].includes(l.status)) {
      everFeitoIds.add(l.id);
    }
  });
  allEvents.forEach((e) => {
    if (e.event_type === "status_changed") {
      const p = e.payload as { to?: string } | null;
      if (p?.to === "diag-feito") everFeitoIds.add(e.lead_id);
    }
  });

  // Leads que avançaram pra proposta após o diagnóstico
  const everPropostaIds = new Set<string>();
  allLeads.forEach((l) => {
    if (["proposta", "negociacao", "fechou"].includes(l.status)) {
      everPropostaIds.add(l.id);
    }
  });

  // Cálculos
  const bookingRate =
    contactedLeadIds.size > 0
      ? Math.round((everAgendadoIds.size / contactedLeadIds.size) * 100)
      : 0;
  const showUpRate =
    everAgendadoIds.size > 0
      ? Math.round((everFeitoIds.size / everAgendadoIds.size) * 100)
      : 0;
  const aproveitamento =
    everFeitoIds.size > 0
      ? Math.round((everPropostaIds.size / everFeitoIds.size) * 100)
      : 0;

  // Breakdown pipeline por status
  const pipelineByStatus = pipelineLeads.reduce(
    (acc, l) => {
      const v = expectedValue(l);
      acc[l.status] = (acc[l.status] || 0) + v;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-[1400px]">
        <header className="mb-16">
          <p className="t-eyebrow">Vendas e receita</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Financeiro</h1>
        </header>

        {/* Métricas principais */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <BigMetric
            label="Faturamento mês"
            value={formatBRL(fatThisMonth)}
            trend={monthTrend}
          />
          <BigMetric
            label="Faturamento ano"
            value={formatBRL(fatYear)}
            accent
          />
          <BigMetric label="Pipeline value" value={formatBRL(pipelineValue)} />
          <BigMetric label="Forecast ponderado" value={formatBRL(forecast)} />
        </section>

        {/* Métricas secundárias */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SmallMetric
            label="Taxa de fechamento"
            value={`${closeRate}%`}
            sub={`${fechouLeads.length} de ${qualifiedLeads.length} qualificados`}
          />
          <SmallMetric
            label="Ticket médio"
            value={fechouLeads.length > 0 ? formatBRL(avgTicket) : "—"}
            sub={`${fechouLeads.length} vendas`}
          />
          <SmallMetric
            label="Tempo médio funil"
            value={avgDaysToClose !== null ? `${avgDaysToClose}d` : "—"}
            sub="Lead → Fechou"
          />
          <SmallMetric
            label="Perdas em R$"
            value={formatBRL(perdidoValue)}
            sub={`${perdeuLeads.length} leads perdidos`}
            danger
          />
        </section>

        {/* Taxas do funil de reunião */}
        <section className="mb-12">
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Reunião</p>
            <h2 className="t-h3 text-[#0F0E0C]">Taxas do funil de call</h2>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FunnelRateCard
              label="Taxa de agendamento"
              value={`${bookingRate}%`}
              from={contactedLeadIds.size}
              to={everAgendadoIds.size}
              fromLabel="contatados"
              toLabel="agendaram diagnóstico"
              note="Quem aceita a call após o contato"
            />
            <FunnelRateCard
              label="Taxa de comparecimento"
              value={`${showUpRate}%`}
              from={everAgendadoIds.size}
              to={everFeitoIds.size}
              fromLabel="agendados"
              toLabel="compareceram à call"
              note="Quem honrou o compromisso (no-show vs show-up)"
              accent={showUpRate >= 70 ? "good" : showUpRate >= 50 ? "neutral" : "bad"}
            />
            <FunnelRateCard
              label="Aproveitamento da call"
              value={`${aproveitamento}%`}
              from={everFeitoIds.size}
              to={everPropostaIds.size}
              fromLabel="diagnósticos"
              toLabel="viraram proposta"
              note="Qualidade da call de diagnóstico"
              accent={aproveitamento >= 60 ? "good" : aproveitamento >= 40 ? "neutral" : "bad"}
            />
          </div>
        </section>

        {/* Pipeline breakdown */}
        <section className="mb-8">
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Pipeline por etapa</p>
            <h2 className="t-h3 text-[#0F0E0C]">Valor potencial em aberto</h2>
          </header>
          <div className="card-elevated p-8">
            {pipelineLeads.length === 0 ? (
              <p className="font-serif italic text-[#A09C92] py-8">
                Nenhum lead em proposta ou negociação no momento.
              </p>
            ) : (
              <div className="space-y-3">
                {(["proposta", "negociacao"] as LeadStatus[]).map((status) => {
                  const value = pipelineByStatus[status] || 0;
                  const max = Math.max(...Object.values(pipelineByStatus), 1);
                  const pct = (value / max) * 100;
                  const count = pipelineLeads.filter((l) => l.status === status).length;
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className="w-40 text-[13px] text-[#6B6862] font-medium">
                        {STATUS_LABELS[status]}
                      </div>
                      <div className="flex-1 h-10 bg-[#F4F2EC] rounded-md relative overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#B8902A]/30 to-[#B8902A]/10 border-r border-[#B8902A] transition-all duration-700"
                          style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-between px-4 text-[13px] font-medium tracking-tight">
                          <span className="text-[#0F0E0C]">{formatBRL(value)}</span>
                          <span className="text-[#A09C92]">{count} leads</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Forecast 30/60/90 */}
        <section>
          <header className="mb-6">
            <p className="t-eyebrow mb-2">Projeção</p>
            <h2 className="t-h3 text-[#0F0E0C]">Forecast por horizonte</h2>
          </header>
          <div className="grid md:grid-cols-3 gap-4">
            <ForecastCard
              label="30 dias"
              note="Negociação + proposta"
              value={
                pipelineLeads
                  .filter((l) => ["negociacao"].includes(l.status))
                  .reduce((s, l) => s + expectedValue(l) * STATUS_PROBABILITY[l.status as LeadStatus], 0) +
                pipelineLeads
                  .filter((l) => ["proposta"].includes(l.status))
                  .reduce((s, l) => s + expectedValue(l) * STATUS_PROBABILITY[l.status as LeadStatus], 0) * 0.6
              }
              formatBRL={formatBRL}
            />
            <ForecastCard
              label="60 dias"
              note="Inclui diagnóstico realizado"
              value={
                pipelineLeads.reduce((s, l) => s + expectedValue(l) * STATUS_PROBABILITY[l.status as LeadStatus], 0) +
                allLeads
                  .filter((l) => l.status === "diag-feito")
                  .reduce((s, l) => s + expectedValue(l) * STATUS_PROBABILITY["diag-feito"], 0)
              }
              formatBRL={formatBRL}
            />
            <ForecastCard
              label="90 dias"
              note="Forecast ponderado total"
              value={forecast}
              accent
              formatBRL={formatBRL}
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function BigMetric({
  label,
  value,
  accent,
  trend,
}: {
  label: string;
  value: string;
  accent?: boolean;
  trend?: number | null;
}) {
  return (
    <div className="card-elevated p-7">
      <p className="t-label mb-5">{label}</p>
      <div className="flex items-baseline gap-3">
        <p
          className={`font-display font-semibold text-[28px] leading-none tracking-[-0.025em] ${
            accent ? "text-[#B8902A]" : "text-[#0F0E0C]"
          }`}
        >
          {value}
        </p>
        {trend !== null && trend !== undefined && (
          <span
            className={`text-[12px] font-medium ${
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

function SmallMetric({
  label,
  value,
  sub,
  danger,
}: {
  label: string;
  value: string;
  sub: string;
  danger?: boolean;
}) {
  return (
    <div className="card-elevated p-5">
      <p className="t-label mb-3">{label}</p>
      <p
        className={`font-display font-semibold text-[22px] leading-none tracking-[-0.02em] mb-2 ${
          danger ? "text-[#C24842]" : "text-[#0F0E0C]"
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-[#A09C92] uppercase tracking-[0.12em]">{sub}</p>
    </div>
  );
}

function FunnelRateCard({
  label,
  value,
  from,
  to,
  fromLabel,
  toLabel,
  note,
  accent,
}: {
  label: string;
  value: string;
  from: number;
  to: number;
  fromLabel: string;
  toLabel: string;
  note: string;
  accent?: "good" | "neutral" | "bad";
}) {
  const color =
    accent === "good"
      ? "text-[#2D7A4E]"
      : accent === "bad"
      ? "text-[#C24842]"
      : accent === "neutral"
      ? "text-[#B8902A]"
      : "text-[#0F0E0C]";

  return (
    <div className="card-elevated p-7">
      <p className="t-label mb-4">{label}</p>
      <p
        className={`font-display font-semibold text-[32px] leading-none tracking-[-0.025em] mb-4 ${color}`}
      >
        {value}
      </p>

      <div className="flex items-center gap-2 mb-3 text-[12px] tracking-[-0.005em]">
        <span className="font-mono text-[#0F0E0C] font-medium">{from}</span>
        <span className="text-[#A09C92]">{fromLabel}</span>
        <span className="text-[#A09C92]">→</span>
        <span className="font-mono text-[#0F0E0C] font-medium">{to}</span>
        <span className="text-[#A09C92]">{toLabel}</span>
      </div>

      <p className="text-[12px] text-[#6B6862] font-serif italic">{note}</p>
    </div>
  );
}

function ForecastCard({
  label,
  value,
  note,
  accent,
  formatBRL,
}: {
  label: string;
  value: number;
  note: string;
  accent?: boolean;
  formatBRL: (v: number) => string;
}) {
  return (
    <div className="card-elevated p-7">
      <p className="t-label mb-4">Próximos {label}</p>
      <p
        className={`font-display font-semibold text-[28px] leading-none tracking-[-0.025em] mb-3 ${
          accent ? "text-[#B8902A]" : "text-[#0F0E0C]"
        }`}
      >
        {formatBRL(value)}
      </p>
      <p className="text-[12px] text-[#6B6862] font-serif italic">{note}</p>
    </div>
  );
}
