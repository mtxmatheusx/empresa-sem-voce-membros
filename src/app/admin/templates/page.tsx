import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { TemplateManager } from "@/components/admin/TemplateManager";
import { MessageTemplate } from "@/types/lead";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("message_templates")
    .select("*")
    .order("display_order");

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-4xl">
        <header className="mb-12">
          <p className="t-eyebrow">Comunicação</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Templates de mensagem</h1>
          <p className="t-body-lg mt-4 max-w-2xl">
            Modelos pré-configurados que você aplica em qualquer lead. As variáveis entre chaves duplas são substituídas automaticamente com os dados do lead.
          </p>
        </header>

        <TemplateManager initial={(data || []) as MessageTemplate[]} />
      </div>
    </AdminShell>
  );
}
