import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, CLIENT_STATUS_LABELS, PILLAR_INFO } from "@/types/client";
import { LogoutButton } from "@/components/membros/LogoutButton";
import { ChangePassword } from "@/components/membros/ChangePassword";
import { formatDate } from "@/lib/utils";

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
  const pillar = PILLAR_INFO[typedClient.current_pillar];

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[900px] relative">
        <div className="esv-aura" />
        <header className="mb-12 relative">
          <p className="t-eyebrow">Sua conta</p>
          <h1 className="t-h1 mt-3 text-[#F5F5F5]">Perfil</h1>
        </header>

        <div className="card-elevated p-8 md:p-10 mb-10 relative">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <Field label="Nome" value={typedClient.name} />
            <Field label="Email" value={typedClient.email} />
            <Field label="WhatsApp" value={typedClient.whatsapp || "—"} />
            <Field
              label="Status no programa"
              value={CLIENT_STATUS_LABELS[typedClient.status]}
            />
            <Field label="Início" value={formatDate(typedClient.started_at)} />
            <Field
              label="Pilar atual"
              value={`${typedClient.current_pillar}. ${pillar?.name ?? "—"}`}
            />
            <Field
              label="Progresso geral"
              value={`${typedClient.completion_pct}%`}
            />
            {typedClient.ends_at && (
              <Field label="Conclusão prevista" value={formatDate(typedClient.ends_at)} />
            )}
          </div>
        </div>

        <div className="card-elevated p-8 relative mb-8">
          <ChangePassword />
        </div>

        <div className="card-elevated p-8 relative">
          <p className="t-eyebrow mb-4">Sessão</p>
          <p className="text-[14px] text-[#A0A0A0] leading-relaxed mb-6 max-w-xl">
            Pra atualizar seus dados de cadastro, chama o time no WhatsApp.
          </p>
          <LogoutButton />
        </div>
      </div>
    </MembrosShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="t-label mb-2">{label}</p>
      <p className="text-[15px] text-[#F5F5F5] tracking-[-0.01em]">{value}</p>
    </div>
  );
}
