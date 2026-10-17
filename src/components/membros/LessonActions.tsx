"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";
import { LESSON_COMPLETE_EVENT } from "@/components/membros/LessonPlayer";
import { cn } from "@/lib/utils";

interface Props {
  lessonId: string;
  clientId: string;
  alreadyCompleted: boolean;
}

export function MarkLessonComplete({ lessonId, clientId, alreadyCompleted }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(alreadyCompleted);
  const [justDone, setJustDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // o player avisa quando o aluno passa de 90% do vídeo
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ lessonId: string }>).detail;
      if (d?.lessonId !== lessonId) return;
      setDone(true);
      setJustDone(true);
      startTransition(() => router.refresh());
    };
    window.addEventListener(LESSON_COMPLETE_EVENT, on);
    return () => window.removeEventListener(LESSON_COMPLETE_EVENT, on);
  }, [lessonId, router]);

  async function handleClick() {
    if (done || saving) return;
    setError(null);
    setSaving(true);
    const supabase = createClient();
    const now = new Date().toISOString();

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        client_id: clientId,
        lesson_id: lessonId,
        watched_pct: 100,
        completed_at: now,
        last_watched_at: now,
      },
      { onConflict: "client_id,lesson_id" }
    );
    setSaving(false);

    if (error) {
      setError("Não deu para salvar agora. Tente de novo em instantes.");
      return;
    }

    setDone(true);
    setJustDone(true);
    startTransition(() => router.refresh());
  }

  return (
    <div className="esv-complete-wrap">
      <button
        type="button"
        onClick={handleClick}
        disabled={done || saving || pending}
        className={cn("esv-complete", done && "is-done", justDone && "is-burst")}
        aria-live="polite"
      >
        <span className="esv-complete__check">
          <Check size={16} strokeWidth={3} />
        </span>
        {done ? "Aula concluída" : saving ? "Salvando…" : "Marcar como concluída"}
      </button>
      {error && <p className="esv-complete__err">{error}</p>}
    </div>
  );
}
