"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function DefinirSenhaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setHasSession(!!data.user);
      setReady(true);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/membros/dashboard");
      router.refresh();
    }, 1300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 relative overflow-hidden">
      <div className="esv-aura" />
      <div className="w-full max-w-md relative z-10 anim-fade-up">
        <div className="mb-12 text-center">
          <Logo size="lg" showText={false} className="justify-center mb-8" />
          <p className="t-eyebrow">Definir senha</p>
        </div>

        {done ? (
          <div className="card-elevated px-6 py-8 text-center">
            <p className="font-serif italic text-[20px] text-[#F5F5F5] mb-2">
              Senha definida!
            </p>
            <p className="text-[14px] text-[#A0A0A0]">Entrando na plataforma…</p>
          </div>
        ) : ready && !hasSession ? (
          <div className="card-elevated px-6 py-8 text-center">
            <p className="font-serif italic text-[20px] text-[#F5F5F5] mb-3">
              Link inválido ou expirado
            </p>
            <p className="text-[14px] text-[#A0A0A0] mb-6">
              Peça um novo link em &quot;Primeiro acesso ou esqueci a senha&quot;.
            </p>
            <a
              href="/membros/login"
              className="text-[14px] text-[#C9A227] hover:opacity-70"
            >
              Ir para o login →
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="t-label block mb-3">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
                className="esv-input"
              />
            </div>
            <div>
              <label className="t-label block mb-3">Confirmar senha</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                required
                autoComplete="new-password"
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
                {loading ? "Salvando…" : "Definir senha e entrar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
