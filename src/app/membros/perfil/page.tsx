import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { ProfileView } from "@/components/membros/ProfileView";
import { Client, LessonProgress } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
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

  // progresso real, contado pelas aulas publicadas
  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("lessons").select("id").eq("is_published", true),
    supabase.from("lesson_progress").select("lesson_id, completed_at").eq("client_id", typedClient.id),
  ]);
  const ids = new Set((lessons || []).map((l: { id: string }) => l.id));
  const done = ((progress || []) as Pick<LessonProgress, "lesson_id" | "completed_at">[]).filter(
    (p) => p.completed_at && ids.has(p.lesson_id)
  ).length;
  const total = ids.size;

  return (
    <MembrosShell>
      <ProfileView
        client={typedClient}
        done={done}
        total={total}
        pct={total ? (done / total) * 100 : 0}
      />
    </MembrosShell>
  );
}
