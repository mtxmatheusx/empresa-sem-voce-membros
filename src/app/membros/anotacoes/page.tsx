import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { NotesView } from "@/components/membros/NotesView";
import { Client, Lesson, LessonNote } from "@/types/client";

export const dynamic = "force-dynamic";

export default async function AnotacoesPage() {
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

  const [{ data: notes }, { data: lessons }] = await Promise.all([
    supabase.from("lesson_notes").select("*").eq("client_id", typedClient.id),
    supabase
      .from("lessons")
      .select("*")
      .eq("is_published", true)
      .order("pillar_number")
      .order("order_in_pillar"),
  ]);

  return (
    <MembrosShell>
      <NotesView notes={(notes || []) as LessonNote[]} lessons={(lessons || []) as Lesson[]} />
    </MembrosShell>
  );
}
