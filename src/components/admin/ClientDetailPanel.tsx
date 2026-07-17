"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ClientTask, TASK_STATUS_LABELS, TaskStatus } from "@/types/client";
import { CheckCircle2, Circle, Clock, Trash2 } from "lucide-react";

interface Props {
  clientId: string;
  initialTasks: ClientTask[];
}

export function ClientDetailPanel({ clientId, initialTasks }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("client_tasks")
      .insert({
        client_id: clientId,
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        status: "pendente",
      })
      .select()
      .single();

    if (!error && data) {
      setTasks([data as ClientTask, ...tasks]);
      setTitle("");
      setDescription("");
      setDueDate("");
      router.refresh();
    }
    setSaving(false);
  }

  async function updateStatus(taskId: string, status: TaskStatus) {
    const supabase = createClient();
    const completed_at = status === "concluida" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("client_tasks")
      .update({ status, completed_at })
      .eq("id", taskId);

    if (!error) {
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status, completed_at } : t
        )
      );
      router.refresh();
    }
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Excluir esta tarefa?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("client_tasks").delete().eq("id", taskId);
    if (!error) {
      setTasks(tasks.filter((t) => t.id !== taskId));
      router.refresh();
    }
  }

  return (
    <div className="card-elevated p-7">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="t-eyebrow">Pós-venda</p>
          <h3 className="t-h4 text-[#0F0E0C] mt-1">Tarefas atribuídas</h3>
        </div>
        <span className="t-label">
          {tasks.filter((t) => t.status === "concluida").length}/{tasks.length}
        </span>
      </header>

      {/* Nova tarefa */}
      <form
        onSubmit={addTask}
        className="bg-[#FAFAF7] rounded-lg p-5 mb-6 space-y-4 border border-[#EAE6DC]"
      >
        <div>
          <label className="t-label block mb-2">Título</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Mapear processo de vendas"
            required
          />
        </div>
        <div>
          <label className="t-label block mb-2">Descrição (opcional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes ou orientação pro cliente"
            rows={2}
          />
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="t-label block mb-2">Prazo (opcional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-12 px-0 py-3 bg-transparent border-0 border-b border-[#D4CFC0] text-[15px] text-[#0F0E0C] focus:outline-none focus:border-[#B8902A] font-sans"
            />
          </div>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Adicionando…" : "Adicionar tarefa"}
          </Button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <p className="font-serif italic text-[16px] text-[#A09C92] py-8 text-center">
          Nenhuma tarefa criada ainda.
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => {
            const Icon =
              t.status === "concluida"
                ? CheckCircle2
                : t.status === "em-execucao"
                ? Clock
                : Circle;
            const iconColor =
              t.status === "concluida"
                ? "text-[#2D7A4E]"
                : t.status === "em-execucao"
                ? "text-[#B8902A]"
                : "text-[#A09C92]";

            return (
              <li
                key={t.id}
                className="flex items-start gap-4 p-4 border border-[#EAE6DC] rounded-lg hover:bg-[#FAFAF7] transition-colors"
              >
                <Icon size={18} className={`${iconColor} mt-0.5 shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[14px] font-medium tracking-[-0.01em] ${
                      t.status === "concluida"
                        ? "line-through text-[#A09C92]"
                        : "text-[#0F0E0C]"
                    }`}
                  >
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="text-[13px] text-[#6B6862] leading-relaxed mt-1">
                      {t.description}
                    </p>
                  )}
                  {t.due_date && (
                    <p className="t-label mt-2">
                      Prazo: {new Date(t.due_date).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value as TaskStatus)}
                    className="text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 bg-[#F4F2EC] text-[#6B6862] rounded-full border-0 cursor-pointer"
                  >
                    {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
                      ([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-[#A09C92] hover:text-[#C24842] transition-colors p-1"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
