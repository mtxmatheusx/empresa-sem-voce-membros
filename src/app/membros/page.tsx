import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Sem página de apresentação: a entrada da área de membros é o login.
export default async function MembrosIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  redirect(user ? "/membros/dashboard" : "/membros/login");
}
