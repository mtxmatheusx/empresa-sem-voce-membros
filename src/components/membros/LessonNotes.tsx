"use client";

// Anotações do aluno nesta aula. Salva sozinho enquanto ele escreve
// (espera ~1s sem digitar) e também ao sair do campo ou da página.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NotebookPen } from "lucide-react";

type Status = "idle" | "saving" | "saved" | "error";

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export function LessonNotes({
  lessonId,
  clientId,
  initialContent,
  initialUpdatedAt,
}: {
  lessonId: string;
  clientId: string;
  initialContent: string;
  initialUpdatedAt: string | null;
}) {
  const [text, setText] = useState(initialContent);
  const [status, setStatus] = useState<Status>(initialUpdatedAt ? "saved" : "idle");
  const [savedAt, setSavedAt] = useState<string | null>(initialUpdatedAt);
  const saved = useRef(initialContent);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  // altura acompanha o texto
  const grow = () => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(140, el.scrollHeight)}px`;
  };
  useEffect(grow, []);

  const save = async (value: string) => {
    if (value === saved.current) return;
    setStatus("saving");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("lesson_notes")
      .upsert(
        { client_id: clientId, lesson_id: lessonId, content: value },
        { onConflict: "client_id,lesson_id" }
      )
      .select("updated_at")
      .maybeSingle();
    if (error) {
      setStatus("error");
      return;
    }
    saved.current = value;
    setSavedAt(data?.updated_at ?? new Date().toISOString());
    setStatus("saved");
  };

  const onChange = (v: string) => {
    setText(v);
    grow();
    if (pending.current) clearTimeout(pending.current);
    pending.current = setTimeout(() => save(v), 900);
  };

  // garante o último trecho ao trocar de aula ou fechar a aba
  const latest = useRef(text);
  latest.current = text;
  useEffect(() => {
    const flush = () => {
      if (pending.current) clearTimeout(pending.current);
      save(latest.current);
    };
    const onHide = () => document.hidden && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const label =
    status === "saving"
      ? "Salvando…"
      : status === "error"
        ? "Não salvou. Tente de novo em instantes."
        : status === "saved" && savedAt
          ? `Salvo às ${hhmm(savedAt)}`
          : "Salva sozinho enquanto você escreve";

  return (
    <section className="esv-panel esv-notes esv-glass">
      <div className="esv-notes__head">
        <p className="esv-panel__kicker">
          <NotebookPen size={15} strokeWidth={2} /> Suas anotações
        </p>
        <Link href="/membros/anotacoes" className="esv-notes__all">
          Ver todas
        </Link>
      </div>
      <textarea
        ref={area}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (pending.current) clearTimeout(pending.current);
          save(text);
        }}
        placeholder="O que desta aula você vai aplicar na empresa? Quem, o quê e até quando."
        maxLength={20000}
        className="esv-notes__area"
        aria-label="Anotações desta aula"
      />
      <p className={`esv-notes__status is-${status}`} aria-live="polite">
        {label}
      </p>
    </section>
  );
}
