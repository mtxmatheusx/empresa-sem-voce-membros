import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { LessonView, LockedLessonView } from "@/components/membros/LessonView";
import { Client, Lesson, LessonProgress } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function AulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/membros/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();
  if (!client) redirect("/membros/dashboard");
  const typedClient = client as Client;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!lesson) notFound();
  const typedLesson = lesson as Lesson;

  // Aula bloqueada — não libera o player
  if (typedLesson.is_locked) {
    return (
      <MembrosShell>
        <LockedLessonView lesson={typedLesson} />
      </MembrosShell>
    );
  }

  // Registra última visualização (best-effort)
  await supabase.from("lesson_progress").upsert(
    {
      client_id: typedClient.id,
      lesson_id: typedLesson.id,
      last_watched_at: new Date().toISOString(),
    },
    { onConflict: "client_id,lesson_id" }
  );

  // Programa inteiro p/ navegação entre aulas e pilares
  const [{ data: lessons }, { data: progress }, { data: note }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("pillar_number")
      .order("order_in_pillar"),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
    supabase
      .from("lesson_notes")
      .select("content, updated_at")
      .eq("client_id", typedClient.id)
      .eq("lesson_id", typedLesson.id)
      .maybeSingle(),
  ]);

  const progressByLesson = new Map(
    ((progress || []) as LessonProgress[]).map((p) => [p.lesson_id, p])
  );

  return (
    <MembrosShell>
      <LessonView
        lesson={typedLesson}
        clientId={typedClient.id}
        allLessons={(lessons || []) as Lesson[]}
        progressByLesson={progressByLesson}
        note={note}
      />
    </MembrosShell>
  );
}
