"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        : "https://membros.mtxestrategia.com.br/membros/auth/callback";

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
    <div className="min-h-screen flex items-center justify-center container-x py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06),transparent_60%)]" />
      </div>

      <div className="w-full max-w-md relative z-10 anim-fade-up">
        <div className="mb-14 text-center">
          <Logo size="md" showText={false} className="justify-center mb-8" />
          <p className="t-eyebrow">Área de Membros</p>
          <p className="font-serif italic text-[var(--text-xl)] text-[#6B6862] mt-4 leading-tight">
            Programa Empresa Sem Você
          </p>
        </div>

        {sent ? (
          <div className="space-y-6 text-center">
            <div className="px-6 py-8 border border-[#EAE6DC] bg-white rounded-lg">
              <p className="t-eyebrow mb-3">Link enviado</p>
              <p className="font-serif italic text-[20px] text-[#0F0E0C] leading-tight mb-4">
                Verifique seu email
              </p>
              <p className="text-[14px] text-[#6B6862] leading-relaxed">
                Mandamos um link mágico pra <span className="text-[#0F0E0C] font-medium">{email}</span>.
                Clique nele pra entrar — válido por 1 hora.
              </p>
            </div>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-[13px] text-[#A09C92] hover:text-[#0F0E0C] transition-colors"
            >
              Usar outro email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="t-label block mb-3">Email cadastrado</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="px-5 py-4 border-l-2 border-[#C24842] bg-[#C24842]/5 rounded-r-lg text-[13px] text-[#0F0E0C]">
                {error}
              </div>
            )}

            <div className="pt-6">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando…" : "Receber link de acesso"}
              </Button>
            </div>

            <p className="text-[12px] text-[#A09C92] leading-relaxed text-center pt-2">
              Sem senha. Você recebe um link único por email pra entrar de qualquer dispositivo.
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
