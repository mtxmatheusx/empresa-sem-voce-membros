"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

type Mode = "login" | "reset";

export default function MembrosLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
      setLoading(false);
      return;
    }
    router.push("/membros/dashboard");
    router.refresh();
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/membros/auth/callback?next=/membros/definir-senha`
        : "https://empresa-sem-voce-membros.vercel.app/membros/auth/callback?next=/membros/definir-senha";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
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
        <div className="mb-12 text-center">
          <Logo size="lg" showText={false} className="justify-center mb-8" />
          <p className="t-eyebrow">Área de Membros</p>
          <p className="font-serif italic text-[22px] text-[#A0A0A0] mt-4 leading-tight">
            Programa Empresa Sem Você
          </p>
        </div>

        {sent ? (
          <div className="space-y-6 text-center">
            <div className="card-elevated px-6 py-8">
              <p className="t-eyebrow mb-3">E-mail enviado</p>
              <p className="font-serif italic text-[20px] text-[#F5F5F5] leading-tight mb-4">
                Verifique sua caixa de entrada
              </p>
              <p className="text-[14px] text-[#A0A0A0] leading-relaxed">
                Mandamos um link pra{" "}
                <span className="text-[#F5F5F5] font-medium">{email}</span>. Clique
                nele pra definir sua senha — válido por 1 hora.
              </p>
            </div>
            <button
              onClick={() => {
                setSent(false);
                setMode("login");
              }}
              className="text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        ) : mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="t-label block mb-3">E-mail</label>
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
            <div>
              <label className="t-label block mb-3">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="esv-input"
              />
            </div>

            {error && (
              <div
                className="px-5 py-4 rounded-r-lg text-[13px] text-[#F5F5F5]"
                style={{ borderLeft: "2px solid #E0736B", background: "rgba(224,115,107,0.08)" }}
              >
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode("reset");
                setError(null);
              }}
              className="w-full text-center text-[13px] text-[#C9A227] hover:opacity-70 pt-1"
            >
              Primeiro acesso ou esqueci a senha
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <p className="text-[14px] text-[#A0A0A0] leading-relaxed text-center">
              Digite seu e-mail cadastrado. Enviamos um link pra você definir (ou
              redefinir) sua senha.
            </p>
            <div>
              <label className="t-label block mb-3">E-mail cadastrado</label>
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
              <div
                className="px-5 py-4 rounded-r-lg text-[13px] text-[#F5F5F5]"
                style={{ borderLeft: "2px solid #E0736B", background: "rgba(224,115,107,0.08)" }}
              >
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Enviando…" : "Enviar link"}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className="w-full text-center text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] pt-1"
            >
              Voltar ao login
            </button>
          </form>
        )}

        <p className="t-label text-center mt-14">
          Acesso exclusivo · Clientes ativos do programa
        </p>
      </div>
    </div>
  );
}
