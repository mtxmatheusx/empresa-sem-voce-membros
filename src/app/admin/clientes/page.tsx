import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Client, CLIENT_STATUS_LABELS, PILLAR_INFO } from "@/types/client";
import { Lead } from "@/types/lead";
import { Product } from "@/types/lead";
import { formatDate } from "@/lib/utils";
import { ConvertLeadButton } from "@/components/admin/ConvertLeadButton";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const supabase = await createClient();

  const [{ data: clients }, { data: leadsFechou }, { data: products }] = await Promise.all([
    supabase
      .from("clients")
      .select("*, lead:leads(company_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, name, email, whatsapp, company_name")
      .eq("status", "fechou")
      .order("closed_at", { ascending: false }),
    supabase.from("products").select("*").eq("is_active", true).order("display_order"),
  ]);

  type ClientWithLead = Client & { lead: { company_name: string | null } | null };
  const allClients = (clients || []) as ClientWithLead[];
  const eligibleLeads = (leadsFechou || []) as Pick<Lead, "id" | "name" | "email" | "whatsapp" | "company_name">[];

  // Filtrar leads que ainda não viraram clientes
  const existingLeadIds = new Set(allClients.map((c) => c.lead_id).filter(Boolean));
  const availableLeads = eligibleLeads.filter((l) => !existingLeadIds.has(l.id));

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-[1400px]">
        <header className="mb-12 flex items-start justify-between gap-6">
          <div>
            <p className="t-eyebrow">Pós-venda</p>
            <h1 className="t-h1 mt-3 text-[#0F0E0C]">Clientes Ativos</h1>
            <p className="font-serif italic text-[18px] text-[#6B6862] mt-3 max-w-xl">
              Quem fechou e está consumindo o programa.
            </p>
          </div>
          <ConvertLeadButton
            availableLeads={availableLeads}
            products={(products || []) as Product[]}
          />
        </header>

        <div className="card-elevated overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FAFAF7] border-b border-[#EAE6DC]">
              <tr>
                <th className="text-left t-label py-4 px-6">Nome</th>
                <th className="text-left t-label py-4 px-6">Empresa</th>
                <th className="text-left t-label py-4 px-6">Pilar atual</th>
                <th className="text-left t-label py-4 px-6">Progresso</th>
                <th className="text-left t-label py-4 px-6">Status</th>
                <th className="text-left t-label py-4 px-6">Iniciado em</th>
              </tr>
            </thead>
            <tbody>
              {allClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 px-6 text-center">
                    <p className="font-serif italic text-[#A09C92] text-lg">
                      Nenhum cliente ativo ainda.
                    </p>
                    <p className="t-body text-sm mt-2">
                      Converta um lead com status &ldquo;Fechou&rdquo; pra começar.
                    </p>
                  </td>
                </tr>
              )}
              {allClients.map((c) => {
                const pillar = PILLAR_INFO[c.current_pillar];
                return (
                  <tr
                    key={c.id}
                    className="border-b border-[#EAE6DC] last:border-0 hover:bg-[#FAFAF7] transition-colors"
                  >
                    <td className="py-5 px-6">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="text-[#0F0E0C] hover:text-[#B8902A] font-medium text-[15px] tracking-[-0.01em] transition-colors"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-5 px-6 text-[14px] text-[#6B6862]">
                      {c.lead?.company_name || "—"}
                    </td>
                    <td className="py-5 px-6 text-[14px] text-[#6B6862]">
                      {c.current_pillar}. {pillar?.name ?? "—"}
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3 w-40">
                        <div className="flex-1 h-1.5 bg-[#F4F2EC] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#B8902A] rounded-full"
                            style={{ width: `${c.completion_pct}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-[#6B6862] tabular-nums">
                          {c.completion_pct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 bg-[#F4F2EC] text-[#6B6862] rounded-full">
                        {CLIENT_STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-[13px] text-[#A09C92]">
                      {formatDate(c.started_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
