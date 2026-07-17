"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center container-x py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06),transparent_60%)]" />
      </div>

      <div className="w-full max-w-md relative z-10 anim-fade-up">
        <div className="mb-14 text-center">
          <Logo size="md" showText={false} className="justify-center mb-8" />
          <p className="t-eyebrow">Painel Administrativo</p>
          <p className="font-serif italic text-[var(--text-xl)] text-[#6B6862] mt-4 leading-tight">
            Princípio do Espelho
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="t-label block mb-3">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="t-label block mb-3">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="px-5 py-4 border-l-2 border-[#C24842] bg-[#C24842]/5 rounded-r-lg text-[13px] text-[#0F0E0C]">
              {error}
            </div>
          )}

          <div className="pt-6">
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </div>
        </form>

        <p className="t-label text-center mt-16">
          Acesso restrito · Administradores autorizados
        </p>
      </div>
    </div>
  );
}
