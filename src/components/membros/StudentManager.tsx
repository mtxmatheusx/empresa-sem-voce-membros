"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Client, PILLAR_INFO, CLIENT_STATUS_LABELS } from "@/types/client";
import { formatDate } from "@/lib/utils";
import { UserPlus, Send, Trash2, CalendarDays, Check } from "lucide-react";

export function StudentManager({ initial }: { initial: Client[] }) {
  const supabase = createClient();
  const [students, setStudents] = useState<Client[]>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [months, setMonths] = useState(12);
  const [pillar, setPillar] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);

  async function refetch() {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setStudents(data as Client[]);
  }

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMsg({ ok: false, text: "Preencha nome e e-mail." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/membros/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        months,
        current_pillar: pillar,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: json.error || "Erro ao criar o acesso." });
      return;
    }
    setMsg({
      ok: true,
      text: json.warning
        ? json.warning
        : `Acesso criado! Convite enviado para ${email.trim()}.`,
    });
    setName("");
    setEmail("");
    await refetch();
  }

  async function resend(c: Client) {
    setRowBusy(c.id);
    setMsg(null);
    const res = await fetch("/api/membros/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: c.email, resend: true }),
    });
    const json = await res.json();
    setRowBusy(null);
    setMsg(
      res.ok
        ? { ok: true, text: `Convite reenviado para ${c.email}.` }
        : { ok: false, text: json.error || "Falha ao reenviar." }
    );
  }

  async function setStatus(c: Client, status: Client["status"]) {
    setRowBusy(c.id);
    await supabase.from("clients").update({ status }).eq("id", c.id);
    await refetch();
    setRowBusy(null);
  }

  async function remove(c: Client) {
    if (!confirm(`Remover o acesso de ${c.name} (${c.email})?`)) return;
    setRowBusy(c.id);
    await supabase.from("clients").delete().eq("id", c.id);
    await refetch();
    setRowBusy(null);
  }

  const statusColor: Record<string, string> = {
    ativo: "#5FB98A",
    pausado: "#C9A227",
    concluido: "#8AB4F8",
    cancelado: "#E0736B",
  };

  return (
    <div className="relative">
      {msg && (
        <div
          className="mb-6 px-5 py-4 rounded-lg text-[13px] text-[#F5F5F5]"
          style={{
            borderLeft: `2px solid ${msg.ok ? "#5FB98A" : "#E0736B"}`,
            background: msg.ok ? "rgba(95,185,138,0.08)" : "rgba(224,115,107,0.08)",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Adicionar aluno */}
      <section className="card-elevated p-6 md:p-7 mb-8">
        <p className="t-eyebrow mb-5 flex items-center gap-2">
          <UserPlus size={14} /> Novo aluno
        </p>
        <form onSubmit={addStudent} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="t-label block mb-2">Nome</label>
              <input
                className="esv-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <label className="t-label block mb-2">E-mail</label>
              <input
                className="esv-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="t-label block mb-2">Tempo de acesso</label>
              <select
                className="esv-input"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                <option value={3}>3 meses</option>
                <option value={6}>6 meses</option>
                <option value={12}>1 ano</option>
                <option value={24}>2 anos</option>
              </select>
            </div>
            <div>
              <label className="t-label block mb-2">Pilar inicial</label>
              <select
                className="esv-input"
                value={pillar}
                onChange={(e) => setPillar(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    {p} · {PILLAR_INFO[p]?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-full font-semibold text-[15px] text-[#0C0C0C] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#C9A227,#D4AF37)" }}
          >
            <Send size={16} />
            {busy ? "Criando…" : "Criar acesso e convidar"}
          </button>
          <p className="text-[12px] text-[#6E6E6E]">
            O aluno recebe um e-mail pra definir a própria senha. Depois entra com
            e-mail + senha.
          </p>
        </form>
      </section>

      {/* Lista de alunos */}
      <section className="card-elevated p-6 md:p-7">
        <p className="t-eyebrow mb-5">
          Alunos cadastrados · {students.length}
        </p>
        {students.length === 0 ? (
          <p className="text-[13px] text-[#6E6E6E]">Nenhum aluno ainda.</p>
        ) : (
          <ul className="space-y-1">
            {students.map((c) => (
              <li
                key={c.id}
                className="flex flex-col md:flex-row md:items-center gap-3 py-3.5"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#F5F5F5] font-medium truncate">
                    {c.name}
                  </p>
                  <p className="text-[12px] text-[#A0A0A0] truncate">{c.email}</p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#6E6E6E]">
                  <CalendarDays size={13} />
                  {c.ends_at ? `até ${formatDate(c.ends_at)}` : "sem validade"}
                </div>

                <span
                  className="text-[11px] px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    color: statusColor[c.status] ?? "#A0A0A0",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${statusColor[c.status] ?? "#333"}40`,
                  }}
                >
                  {CLIENT_STATUS_LABELS[c.status]}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => resend(c)}
                    disabled={rowBusy === c.id}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#C9A227] hover:opacity-70 px-2 py-1 disabled:opacity-40"
                    title="Reenviar convite / link de senha"
                  >
                    <Send size={13} />
                    {rowBusy === c.id ? "…" : "Convite"}
                  </button>
                  {c.status === "ativo" ? (
                    <button
                      onClick={() => setStatus(c, "pausado")}
                      disabled={rowBusy === c.id}
                      className="text-[12px] text-[#A0A0A0] hover:text-[#F5F5F5] px-2 py-1"
                    >
                      Pausar
                    </button>
                  ) : (
                    <button
                      onClick={() => setStatus(c, "ativo")}
                      disabled={rowBusy === c.id}
                      className="inline-flex items-center gap-1 text-[12px] text-[#5FB98A] hover:opacity-70 px-2 py-1"
                    >
                      <Check size={13} /> Ativar
                    </button>
                  )}
                  <button
                    onClick={() => remove(c)}
                    disabled={rowBusy === c.id}
                    className="text-[#A0A0A0] hover:text-[#E0736B] p-1.5"
                    title="Remover acesso"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
