"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadEvent, LeadNote, LeadStatus, Product, STATUS_LABELS, STATUS_ORDER } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Trash2 } from "lucide-react";
import { LeadAIPanel } from "@/components/admin/LeadAIPanel";

export function LeadDetail({
  lead: initialLead,
  events: initialEvents,
  notes: initialNotes,
  products,
}: {
  lead: Lead;
  events: LeadEvent[];
  notes: LeadNote[];
  products: Product[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function changeStatus(newStatus: LeadStatus) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", lead.id);
    if (!error) {
      setLead({ ...lead, status: newStatus });
      router.refresh();
    }
    setSaving(false);
  }

  async function updateProduct(field: "proposed_product_id" | "final_product_id", value: string | null) {
    setSaving(true);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setLead({ ...lead, [field]: value });
    router.refresh();
    setSaving(false);
  }

  async function updateClosedValue(value: number | null) {
    setSaving(true);
    await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closed_value: value }),
    });
    setLead({ ...lead, closed_value: value });
    router.refresh();
    setSaving(false);
  }

  async function deleteLead() {
    const confirmed = window.confirm(
      `Excluir o lead de ${lead.name}? Essa ação não pode ser desfeita e remove o histórico (notas + timeline).`
    );
    if (!confirmed) return;
    setDeleting(true);
    const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/kanban");
      router.refresh();
    } else {
      setDeleting(false);
      alert("Erro ao excluir lead");
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: lead.id, content: newNote.trim() })
      .select()
      .single();
    if (!error && data) {
      setNotes([data, ...notes]);
      setNewNote("");
    }
    setSaving(false);
  }

  return (
    <div className="px-10 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-10">
        <Link
          href="/admin/kanban"
          className="inline-flex items-center gap-2 text-[13px] text-[#6B6862] hover:text-[#0F0E0C] transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar ao Pipeline
        </Link>
        <button
          onClick={deleteLead}
          disabled={deleting}
          className="inline-flex items-center gap-2 text-[13px] text-[#A09C92] hover:text-[#C24842] transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 size={14} />
          {deleting ? "Excluindo…" : "Excluir lead"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-16">
          <header>
            <p className="t-eyebrow">Lead</p>
            <h1 className="t-h1 mt-3 text-balance">{lead.name}</h1>
            <p className="t-body-lg mt-4">
              {lead.company_name}
              {lead.company_sector && (
                <span className="text-[#A09C92]"> · {lead.company_sector}</span>
              )}
            </p>
          </header>

          <LeadAIPanel lead={lead} />

          <Section title="Identificação" eyebrow="Contato">
            <Field label="WhatsApp" value={lead.whatsapp} copyable />
            <Field label="Email" value={lead.email} copyable />
            {lead.instagram && <Field label="Instagram" value={lead.instagram} />}
          </Section>

          <Section title="Empresa" eyebrow="Contexto">
            <Field label="Setor" value={lead.company_sector} />
            <Field label="Funcionários" value={lead.employees_range} />
            <Field label="Faturamento mensal" value={lead.revenue_range} />
            <Field label="Anos de operação" value={lead.years_in_business?.toString()} />
          </Section>

          <Section title="Dor" eyebrow="Diagnóstico">
            <Field label="O que mais suga energia hoje" value={lead.energy_suck} block />
            <Field label="Empresa rodaria 30 dias sem ele?" value={lead.thirty_days_test} />
            <Field label="% tempo em operacional tático" value={lead.tactical_time_pct} />
          </Section>

          <Section title="Compromisso" eyebrow="Horizonte">
            <Field label="Desejo 120 dias" value={lead.desire_120d} block />
            <Field label="Investimento R$28k–R$36k" value={lead.investment_ready} />
          </Section>

          <Section title="Produto" eyebrow="Comercial">
            <div className="grid grid-cols-[200px_1fr] gap-6 items-center py-1.5">
              <p className="t-label">Produto proposto</p>
              <select
                value={lead.proposed_product_id || ""}
                onChange={(e) => updateProduct("proposed_product_id", e.target.value || null)}
                disabled={saving}
                className="bg-white border border-[#EAE6DC] hover:border-[#D4CFC0] focus:border-[#B8902A] rounded-lg px-3 py-2 text-[14px] text-[#0F0E0C] focus:outline-none transition-colors cursor-pointer max-w-xs"
              >
                <option value="">— Nenhum —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (R${" "}{Number(p.price).toLocaleString("pt-BR")})
                  </option>
                ))}
              </select>
            </div>

            {lead.status === "fechou" && (
              <>
                <div className="grid grid-cols-[200px_1fr] gap-6 items-center py-1.5">
                  <p className="t-label">Produto fechado</p>
                  <select
                    value={lead.final_product_id || ""}
                    onChange={(e) => updateProduct("final_product_id", e.target.value || null)}
                    disabled={saving}
                    className="bg-white border border-[#EAE6DC] hover:border-[#D4CFC0] focus:border-[#B8902A] rounded-lg px-3 py-2 text-[14px] text-[#0F0E0C] focus:outline-none transition-colors cursor-pointer max-w-xs"
                  >
                    <option value="">— Nenhum —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (R${" "}{Number(p.price).toLocaleString("pt-BR")})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-6 items-center py-1.5">
                  <p className="t-label">Valor fechado (R$)</p>
                  <input
                    type="number"
                    value={lead.closed_value || ""}
                    onChange={(e) =>
                      updateClosedValue(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="36000"
                    className="bg-white border border-[#EAE6DC] hover:border-[#D4CFC0] focus:border-[#B8902A] rounded-lg px-3 py-2 text-[14px] text-[#0F0E0C] focus:outline-none transition-colors max-w-xs"
                  />
                </div>
              </>
            )}
          </Section>

          {/* Notas */}
          <Section title="Notas" eyebrow="Observações">
            <div className="space-y-4 mb-6">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Anote algo sobre essa lead (diagnóstico, observação, próxima ação)…"
                rows={3}
              />
              <Button onClick={addNote} disabled={!newNote.trim() || saving} size="sm">
                {saving ? "Salvando…" : "Adicionar nota"}
              </Button>
            </div>
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="font-serif italic text-[#A09C92] text-[15px]">
                  Nenhuma nota ainda.
                </p>
              ) : (
                notes.map((note) => (
                  <article
                    key={note.id}
                    className="card-elevated p-5 border-l-2 border-l-[#B8902A]"
                  >
                    <p className="text-[14px] text-[#0F0E0C] whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                    <p className="t-label mt-3">{formatDateTime(note.created_at)}</p>
                  </article>
                ))
              )}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Status */}
          <div className="card-elevated p-6">
            <p className="t-label mb-3">Status atual</p>
            <p className="font-serif italic text-[#B8902A] text-[22px] leading-tight mb-6">
              {STATUS_LABELS[lead.status]}
            </p>
            <label className="t-label block mb-3">Mover para</label>
            <select
              value={lead.status}
              onChange={(e) => changeStatus(e.target.value as LeadStatus)}
              disabled={saving}
              className="w-full bg-[#FAFAF7] border border-[#EAE6DC] hover:border-[#D4CFC0] focus:border-[#B8902A] rounded-lg px-3.5 py-2.5 text-[14px] text-[#0F0E0C] focus:outline-none transition-colors cursor-pointer"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Timeline */}
          <div className="card-elevated p-6">
            <p className="t-label mb-4">Timeline</p>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {initialEvents.length === 0 && (
                <p className="font-serif italic text-[#A09C92] text-sm">
                  Sem eventos registrados.
                </p>
              )}
              {initialEvents.map((event) => (
                <div
                  key={event.id}
                  className="text-[13px] border-l border-[#D4CFC0] pl-4 py-1"
                >
                  <p className="text-[#0F0E0C] font-medium tracking-[-0.01em]">
                    {eventLabel(event)}
                  </p>
                  <p className="text-[#A09C92] text-[11px] mt-1 uppercase tracking-[0.1em]">
                    {formatDateTime(event.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="px-6 pt-2 space-y-1.5">
            <p className="t-label">Criado · {formatDateTime(lead.created_at)}</p>
            <p className="t-label">Atualizado · {formatDateTime(lead.updated_at)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-6">
        <p className="t-eyebrow mb-2">{eyebrow}</p>
        <h2 className="t-h3">{title}</h2>
      </header>
      <div className="space-y-4 border-l border-[#EAE6DC] pl-6 py-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  block,
  copyable,
}: {
  label: string;
  value?: string | null;
  block?: boolean;
  copyable?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={block ? "" : "grid grid-cols-[200px_1fr] gap-6 items-baseline py-1.5"}>
      <p className="t-label">{label}</p>
      <div className="text-[15px] text-[#0F0E0C] flex items-center gap-3 tracking-[-0.005em]">
        <span className={block ? "whitespace-pre-wrap leading-relaxed" : ""}>
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-[10px] uppercase tracking-[0.15em] text-[#A09C92] hover:text-[#B8902A] cursor-pointer transition-colors"
          >
            copiar
          </button>
        )}
      </div>
    </div>
  );
}

function eventLabel(event: LeadEvent) {
  switch (event.event_type) {
    case "form_submitted":
      return "Aplicação enviada";
    case "status_changed":
      const p = event.payload as { from?: string; to?: string } | null;
      return `${STATUS_LABELS[(p?.from ?? "recebida") as LeadStatus] || p?.from} → ${
        STATUS_LABELS[(p?.to ?? "recebida") as LeadStatus] || p?.to
      }`;
    case "note_added":
      return "Nota adicionada";
    case "ai_analysis":
      const ai = event.payload as { fit_score?: number } | null;
      return `Análise IA (fit ${ai?.fit_score ?? "?"}/100)`;
    case "contact_sent":
      const c = event.payload as { channel?: string } | null;
      return `Contato enviado via ${c?.channel || "whatsapp"}`;
    default:
      return event.event_type;
  }
}
