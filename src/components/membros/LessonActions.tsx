"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Props {
  lessonId: string;
  clientId: string;
  alreadyCompleted: boolean;
}

export function MarkLessonComplete({ lessonId, clientId, alreadyCompleted }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(alreadyCompleted);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    const supabase = createClient();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        {
          client_id: clientId,
          lesson_id: lessonId,
          watched_pct: 100,
          completed_at: now,
          last_watched_at: now,
        },
        { onConflict: "client_id,lesson_id" }
      );

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    startTransition(() => router.refresh());
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 text-[14px] text-[#2D7A4E]">
        <CheckCircle2 size={18} />
        Aula concluída
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={pending}>
        {pending ? "Salvando…" : "Marcar como assistida"}
      </Button>
      {error && (
        <p className="text-[12px] text-[#C24842] mt-2">{error}</p>
      )}
    </div>
  );
}
