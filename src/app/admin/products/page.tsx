import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Product } from "@/types/lead";

export const dynamic = "force-dynamic";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("display_order");

  const list = (products || []) as Product[];

  return (
    <AdminShell>
      <div className="px-10 py-12 max-w-4xl">
        <header className="mb-12">
          <p className="t-eyebrow">Configuração</p>
          <h1 className="t-h1 mt-3 text-[#0F0E0C]">Produtos</h1>
          <p className="t-body-lg mt-4 max-w-2xl">
            Tabela de produtos que você oferece. Cada lead pode ter um produto proposto e, ao fechar, um produto final + valor.
          </p>
        </header>

        <div className="space-y-3">
          {list.map((product) => (
            <article
              key={product.id}
              className="card-elevated p-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center"
            >
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-display font-semibold text-[18px] tracking-[-0.015em] text-[#0F0E0C]">
                    {product.name}
                  </h3>
                  <span className="t-label">{product.slug}</span>
                  {!product.is_active && (
                    <span className="text-[10px] uppercase tracking-[0.12em] px-2 py-0.5 bg-[#F4F2EC] text-[#A09C92] rounded-full">
                      Inativo
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="text-[13.5px] leading-[1.55] text-[#6B6862]">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-[26px] leading-none tracking-[-0.025em] text-[#B8902A]">
                  {formatBRL(Number(product.price))}
                </p>
                <p className="t-label mt-2">/ programa</p>
              </div>
            </article>
          ))}
        </div>

        <p className="text-[12px] text-[#A09C92] mt-8 font-serif italic">
          Para alterar nome, valor ou adicionar novos produtos, use a tabela <code className="bg-[#F4F2EC] px-1.5 py-0.5 rounded text-[#6B6862]">products</code> direto no Supabase (por enquanto). UI de edição vem em breve.
        </p>
      </div>
    </AdminShell>
  );
}
