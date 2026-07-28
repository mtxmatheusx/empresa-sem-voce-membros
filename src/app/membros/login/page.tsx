"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function MembrosLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/membros/auth/callback`
        : "https://empresa-sem-voce-membros.vercel.app/membros/auth/callback";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 relative overflow-hidden">
      <div className="esv-aura" />

      <div className="w-full max-w-md relative z-10 anim-fade-up">
        <div className="mb-14 text-center">
          <Logo size="lg" showText={false} className="justify-center mb-8" />
          <p className="t-eyebrow">Área de Membros</p>
          <p className="font-serif italic text-[22px] text-[#A0A0A0] mt-4 leading-tight">
            Programa Empresa Sem Você
          </p>
        </div>

        {sent ? (
          <div className="space-y-6 text-center">
            <div className="card-elevated px-6 py-8">
              <p className="t-eyebrow mb-3">Link enviado</p>
              <p className="font-serif italic text-[20px] text-[#F5F5F5] leading-tight mb-4">
                Verifique seu email
              </p>
              <p className="text-[14px] text-[#A0A0A0] leading-relaxed">
                Mandamos um link mágico pra{" "}
                <span className="text-[#F5F5F5] font-medium">{email}</span>. Clique
                nele pra entrar — válido por 1 hora.
              </p>
            </div>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] transition-colors"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="t-label block mb-3">Email cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="esv-input"
              />
            </div>

            {error && (
              <div className="px-5 py-4 rounded-r-lg text-[13px] text-[#F5F5F5]" style={{ borderLeft: "2px solid #E0736B", background: "rgba(224,115,107,0.08)" }}>
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando…" : "Receber link de acesso"}
              </Button>
            </div>

            <p className="text-[12px] text-[#6E6E6E] leading-relaxed text-center pt-2">
              Sem senha. Você recebe um link único por email pra entrar de qualquer
              dispositivo.
            </p>
          </form>
        )}

        <p className="t-label text-center mt-16">
          Acesso exclusivo · Clientes ativos do programa
        </p>
      </div>
    </div>
  );
}
