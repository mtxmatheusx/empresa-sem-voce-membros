"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageTemplate } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { AVAILABLE_VARIABLES } from "@/lib/templates";
import { Trash2, Plus, X } from "lucide-react";

export function TemplateManager({ initial }: { initial: MessageTemplate[] }) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", body: "" });
  const [saving, setSaving] = useState(false);

  async function startEdit(t: MessageTemplate) {
    setEditing(t.id);
    setCreating(false);
    setForm({ name: t.name, description: t.description || "", body: t.body });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ name: "", description: "", body: "" });
  }

  function cancel() {
    setEditing(null);
    setCreating(false);
    setForm({ name: "", description: "", body: "" });
  }

  async function save() {
    if (!form.name.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/templates/${editing}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Erro ao salvar");
        setTemplates(
          templates.map((t) =>
            t.id === editing
              ? { ...t, name: form.name, description: form.description, body: form.body }
              : t
          )
        );
      } else {
        const res = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Erro ao criar");
        const data = await res.json();
        setTemplates([...templates, data.template]);
      }
      cancel();
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir esse template?")) return;
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTemplates(templates.filter((t) => t.id !== id));
      router.refresh();
    }
  }

  function insertVariable(variable: string) {
    setForm((prev) => ({ ...prev, body: prev.body + variable }));
  }

  const isFormOpen = editing !== null || creating;

  return (
    <div className="space-y-6">
      {!isFormOpen && (
        <Button onClick={startCreate} size="sm">
          <Plus size={14} className="mr-2" strokeWidth={2} />
          Novo template
        </Button>
      )}

      {/* Form criar/editar */}
      {isFormOpen && (
        <article className="card-elevated p-7 anim-fade-up">
          <header className="flex items-center justify-between mb-6">
            <p className="t-label">
              {editing ? "Editando template" : "Novo template"}
            </p>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 text-[12px] text-[#6B6862] hover:text-[#0F0E0C] transition-colors cursor-pointer"
            >
              <X size={12} />
              Cancelar
            </button>
          </header>

          <div className="space-y-5">
            <div>
              <label className="t-label block mb-2">Nome</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Primeiro contato"
              />
            </div>

            <div>
              <label className="t-label block mb-2">Descrição (opcional)</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Quando usar esse template"
              />
            </div>

            <div>
              <label className="t-label block mb-2">Mensagem</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={10}
                placeholder="Escreva a mensagem usando variáveis como {{primeiro_nome}}, {{empresa}}..."
                className="w-full bg-[#FAFAF7] border border-[#EAE6DC] focus:border-[#B8902A] rounded-lg px-4 py-3 text-[14px] leading-[1.65] text-[#0F0E0C] font-sans resize-y transition-colors focus:outline-none"
              />
            </div>

            <div>
              <p className="t-label mb-3">Variáveis disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#F4F2EC] hover:bg-[#EAE6DC] text-[#6B6862] hover:text-[#0F0E0C] rounded-full transition-colors cursor-pointer"
                    title={v.label}
                  >
                    {v.key}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <Button onClick={save} disabled={saving || !form.name.trim() || !form.body.trim()}>
                {saving ? "Salvando…" : "Salvar template"}
              </Button>
              <Button variant="ghost" onClick={cancel}>
                Cancelar
              </Button>
            </div>
          </div>
        </article>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {templates.length === 0 && !isFormOpen && (
          <p className="font-serif italic text-[#A09C92] text-[15px] py-8 text-center">
            Nenhum template ainda. Cria o primeiro acima.
          </p>
        )}
        {templates.map((t) => (
          <article key={t.id} className="card-elevated p-6">
            <header className="flex items-start justify-between mb-3 gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-[16px] tracking-[-0.012em] text-[#0F0E0C]">
                  {t.name}
                </h3>
                {t.description && (
                  <p className="text-[12.5px] text-[#6B6862] mt-1 font-serif italic">
                    {t.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => startEdit(t)}
                  className="text-[12px] text-[#6B6862] hover:text-[#B8902A] transition-colors cursor-pointer uppercase tracking-[0.1em]"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="text-[#A09C92] hover:text-[#C24842] transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </header>
            <pre className="text-[13px] leading-[1.6] text-[#0F0E0C] whitespace-pre-wrap font-sans bg-[#FAFAF7] border border-[#EAE6DC] rounded-md p-4">
              {t.body}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
