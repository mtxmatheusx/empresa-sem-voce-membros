"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Lead, Product } from "@/types/lead";
import { X } from "lucide-react";

interface Props {
  availableLeads: Pick<Lead, "id" | "name" | "email" | "whatsapp" | "company_name">[];
  products: Product[];
}

export function ConvertLeadButton({ availableLeads, products }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!leadId) return;

    setLoading(true);
    setError(null);

    const lead = availableLeads.find((l) => l.id === leadId);
    if (!lead) {
      setError("Lead não encontrado");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("clients").insert({
      lead_id: lead.id,
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp,
      product_id: productId || null,
      status: "ativo",
      current_pillar: 1,
      completion_pct: 0,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOpen(false);
    setLeadId("");
    setProductId("");
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={availableLeads.length === 0}>
        Converter lead em cliente
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0F0E0C]/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-lg w-full p-8 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-[#A09C92] hover:text-[#0F0E0C] transition-colors"
            >
              <X size={18} />
            </button>

            <header className="mb-8">
              <p className="t-eyebrow">Pós-venda</p>
              <h2 className="t-h3 text-[#0F0E0C] mt-2">Converter lead em cliente</h2>
              <p className="text-[14px] text-[#6B6862] mt-3 leading-relaxed">
                Cria o perfil de cliente ativo na plataforma. Eles vão acessar
                via magic link no email cadastrado.
              </p>
            </header>

            <form onSubmit={handleConvert} className="space-y-6">
              <div>
                <label className="t-label block mb-3">Lead (status: Fechou)</label>
                <select
                  value={leadId}
                  onChange={(e) => setLeadId(e.target.value)}
                  required
                  className="w-full h-12 px-0 py-3 bg-transparent border-0 border-b border-[#D4CFC0] hover:border-[#6B6862] text-[15px] text-[#0F0E0C] focus:outline-none focus:border-[#B8902A] font-sans"
                >
                  <option value="">Selecione um lead</option>
                  {availableLeads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.company_name ? `· ${l.company_name}` : ""} ({l.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="t-label block mb-3">Produto (opcional)</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full h-12 px-0 py-3 bg-transparent border-0 border-b border-[#D4CFC0] hover:border-[#6B6862] text-[15px] text-[#0F0E0C] focus:outline-none focus:border-[#B8902A] font-sans"
                >
                  <option value="">Sem produto vinculado</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="px-5 py-4 border-l-2 border-[#C24842] bg-[#C24842]/5 rounded-r-lg text-[13px] text-[#0F0E0C]">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !leadId}>
                  {loading ? "Criando…" : "Criar cliente"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
