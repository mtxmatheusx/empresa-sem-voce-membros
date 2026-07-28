"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lesson, PILLAR_INFO } from "@/types/client";
import { lessonCover, isYoutube } from "@/lib/youtube";
import {
  Plus,
  Pencil,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Youtube,
  X,
} from "lucide-react";

type Form = {
  id: string | null;
  pillar_number: number;
  order_in_pillar: number;
  title: string;
  video_url: string;
  description: string;
  task: string;
  pdf_url: string;
  cover_url: string;
  is_published: boolean;
  is_locked: boolean;
};

const EMPTY: Form = {
  id: null,
  pillar_number: 1,
  order_in_pillar: 1,
  title: "",
  video_url: "",
  description: "",
  task: "",
  pdf_url: "",
  cover_url: "",
  is_published: true,
  is_locked: false,
};

export function LessonManager({ initialLessons }: { initialLessons: Lesson[] }) {
  const supabase = createClient();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [form, setForm] = useState<Form>(EMPTY);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editing = form.id !== null;

  async function refetch() {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .order("pillar_number")
      .order("order_in_pillar");
    if (data) setLessons(data as Lesson[]);
  }

  function startNew(pillar: number) {
    const inPillar = lessons.filter((l) => l.pillar_number === pillar);
    const nextOrder =
      inPillar.reduce((m, l) => Math.max(m, l.order_in_pillar), 0) + 1;
    setForm({ ...EMPTY, pillar_number: pillar, order_in_pillar: nextOrder });
    setError(null);
    setOpen(true);
  }

  function startEdit(l: Lesson) {
    setForm({
      id: l.id,
      pillar_number: l.pillar_number,
      order_in_pillar: l.order_in_pillar,
      title: l.title,
      video_url: l.video_url ?? "",
      description: l.description ?? "",
      task: l.task ?? "",
      pdf_url: l.pdf_url ?? "",
      cover_url: l.cover_url ?? "",
      is_published: l.is_published,
      is_locked: l.is_locked,
    });
    setError(null);
    setOpen(true);
  }

  async function handleCover(file: File) {
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("esv-covers")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      setError("Falha ao subir a capa: " + upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("esv-covers").getPublicUrl(path);
    setForm((f) => ({ ...f, cover_url: data.publicUrl }));
    setUploading(false);
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Dá um título pra aula.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      pillar_number: Number(form.pillar_number),
      order_in_pillar: Number(form.order_in_pillar),
      title: form.title.trim(),
      video_url: form.video_url.trim() || null,
      description: form.description.trim() || null,
      task: form.task.trim() || null,
      pdf_url: form.pdf_url.trim() || null,
      cover_url: form.cover_url.trim() || null,
      is_published: form.is_published,
      is_locked: form.is_locked,
    };
    const res = form.id
      ? await supabase.from("lessons").update(payload).eq("id", form.id)
      : await supabase.from("lessons").insert(payload);
    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }
    await refetch();
    setSaving(false);
    setOpen(false);
    setForm(EMPTY);
  }

  async function remove(l: Lesson) {
    if (!confirm(`Excluir a aula "${l.title}"? Isso não tem volta.`)) return;
    const { error: delErr } = await supabase
      .from("lessons")
      .delete()
      .eq("id", l.id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    await refetch();
  }

  const pillars = [0, 1, 2, 3, 4, 5];
  const previewCover = lessonCover({
    cover_url: form.cover_url || null,
    video_url: form.video_url || null,
  });

  return (
    <div className="relative">
      {error && (
        <div
          className="mb-6 px-5 py-4 rounded-lg text-[13px] text-[#F5F5F5]"
          style={{ borderLeft: "2px solid #E0736B", background: "rgba(224,115,107,0.08)" }}
        >
          {error}
        </div>
      )}

      {/* Lista por pilar */}
      <div className="space-y-8">
        {pillars.map((p) => {
          const info = PILLAR_INFO[p];
          const items = lessons.filter((l) => l.pillar_number === p);
          if (!info) return null;
          return (
            <section key={p} className="card-elevated p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="t-label">{p === 0 ? "Boas-vindas" : `Pilar ${p}`}</p>
                  <h3 className="text-[17px] font-semibold text-[#F5F5F5] mt-1">
                    {info.name}
                  </h3>
                </div>
                <button
                  onClick={() => startNew(p)}
                  className="inline-flex items-center gap-2 text-[13px] text-[#C9A227] hover:opacity-70"
                >
                  <Plus size={15} /> Nova aula
                </button>
              </div>

              {items.length === 0 ? (
                <p className="text-[13px] text-[#6E6E6E]">Nenhuma aula ainda.</p>
              ) : (
                <ul className="space-y-1">
                  {items.map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center gap-3 py-2.5"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <span className="text-[13px] text-[#6E6E6E] w-6 shrink-0">
                        {String(l.order_in_pillar).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[14px] text-[#F5F5F5] truncate">
                        {l.title}
                      </span>
                      {isYoutube(l.video_url) && (
                        <Youtube size={15} className="text-[#C9A227] shrink-0" />
                      )}
                      {l.is_locked && <Lock size={13} className="text-[#6E6E6E] shrink-0" />}
                      {l.is_published ? (
                        <Eye size={14} className="text-[#5FB98A] shrink-0" />
                      ) : (
                        <EyeOff size={14} className="text-[#6E6E6E] shrink-0" />
                      )}
                      <button
                        onClick={() => startEdit(l)}
                        className="text-[#A0A0A0] hover:text-[#F5F5F5] p-1"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(l)}
                        className="text-[#A0A0A0] hover:text-[#E0736B] p-1"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Editor (drawer) */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg h-full overflow-y-auto p-7"
            style={{ background: "#111", borderLeft: "1px solid var(--color-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-[#F5F5F5]">
                {editing ? "Editar aula" : "Nova aula"}
              </h3>
              <button onClick={() => setOpen(false)} className="text-[#A0A0A0] hover:text-[#F5F5F5]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="t-label block mb-2">Pilar</label>
                  <select
                    className="esv-input"
                    value={form.pillar_number}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, pillar_number: Number(e.target.value) }))
                    }
                  >
                    {[0, 1, 2, 3, 4, 5].map((p) => (
                      <option key={p} value={p}>
                        {p === 0 ? "0 · Boas-vindas" : `${p} · ${PILLAR_INFO[p]?.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="t-label block mb-2">Ordem</label>
                  <input
                    type="number"
                    className="esv-input"
                    value={form.order_in_pillar}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, order_in_pillar: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="t-label block mb-2">Título</label>
                <input
                  className="esv-input"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Como parar de ser o gargalo"
                />
              </div>

              <div>
                <label className="t-label block mb-2">Link do YouTube</label>
                <input
                  className="esv-input"
                  value={form.video_url}
                  onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                  placeholder="https://youtu.be/..."
                />
                {form.video_url && !isYoutube(form.video_url) && (
                  <p className="text-[12px] text-[#E0736B] mt-1">
                    Não parece um link do YouTube (também aceita .mp4 direto).
                  </p>
                )}
              </div>

              {/* Capa */}
              <div>
                <label className="t-label block mb-2">Capa (pôster vertical)</label>
                <div className="flex items-start gap-4">
                  <div
                    className="w-24 rounded-lg overflow-hidden shrink-0"
                    style={{ aspectRatio: "2/3", background: "#1a1a1a", border: "1px solid var(--color-border)" }}
                  >
                    {previewCover.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewCover.url}
                        alt="capa"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="esv-chip cursor-pointer inline-flex">
                      <Upload size={15} />
                      {uploading ? "Subindo…" : "Subir imagem"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCover(file);
                        }}
                      />
                    </label>
                    <input
                      className="esv-input"
                      value={form.cover_url}
                      onChange={(e) => setForm((f) => ({ ...f, cover_url: e.target.value }))}
                      placeholder="ou cole a URL da imagem"
                    />
                    <p className="text-[11px] text-[#6E6E6E]">
                      Sem capa, usamos a thumb do YouTube automaticamente.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="t-label block mb-2">Descrição</label>
                <textarea
                  className="esv-input"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Sobre o que é essa aula…"
                />
              </div>

              <div>
                <label className="t-label block mb-2">Tarefa</label>
                <textarea
                  className="esv-input"
                  value={form.task}
                  onChange={(e) => setForm((f) => ({ ...f, task: e.target.value }))}
                  placeholder="O que o aluno deve fazer depois de assistir…"
                />
              </div>

              <div>
                <label className="t-label block mb-2">Link de documento (PDF/planilha) — opcional</label>
                <input
                  className="esv-input"
                  value={form.pdf_url}
                  onChange={(e) => setForm((f) => ({ ...f, pdf_url: e.target.value }))}
                  placeholder="https://…"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-[14px] text-[#F5F5F5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                  />
                  Publicada
                </label>
                <label className="flex items-center gap-2 text-[14px] text-[#F5F5F5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_locked}
                    onChange={(e) => setForm((f) => ({ ...f, is_locked: e.target.checked }))}
                  />
                  Bloqueada (cadeado)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 h-12 rounded-full font-semibold text-[15px] text-[#0C0C0C] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#C9A227,#D4AF37)" }}
                >
                  {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar aula"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 h-12 rounded-full text-[14px] text-[#A0A0A0]"
                  style={{ border: "1px solid var(--color-border-strong)" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
