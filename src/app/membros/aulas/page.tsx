import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Catalog } from "@/components/membros/Catalog";
import { Client, Lesson, LessonProgress } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function AulasCatalogPage() {
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

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("pillar_number")
      .order("order_in_pillar"),
    supabase.from("lesson_progress").select("*").eq("client_id", typedClient.id),
  ]);

  const allLessons = (lessons || []) as Lesson[];
  const allProgress = (progress || []) as LessonProgress[];
  const progressByLesson = new Map(allProgress.map((p) => [p.lesson_id, p]));

  return (
    <MembrosShell>
      <Catalog
        firstName={typedClient.name?.split(" ")[0] ?? ""}
        lessons={allLessons}
        progressByLesson={progressByLesson}
      />
    </MembrosShell>
  );
}
