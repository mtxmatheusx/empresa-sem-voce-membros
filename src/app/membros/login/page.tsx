"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Mail } from "lucide-react";

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

  const errorBox = error && (
    <div className="esv-alert" role="alert">
      {error}
    </div>
  );

  return (
    <div className="esv-auth">
      <div className="esv-auth__glow" aria-hidden />
      <div className="esv-auth__glow esv-auth__glow--2" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-esv-mark.png" alt="" className="esv-auth__mark" aria-hidden />

      <div className="esv-auth__col">
        <header className="esv-auth__head esv-rise">
          <span className="esv-brand__mark esv-auth__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-esv-mark.png" alt="Empresa Sem Você" />
          </span>
          <p className="t-eyebrow">Área de membros</p>
          <h1 className="esv-auth__title">
            Programa <em>Empresa Sem Você</em>
          </h1>
        </header>

        <div className="esv-auth__card esv-glass esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
          {sent ? (
            <div className="esv-auth__sent">
              <span className="esv-locked__icon">
                <Mail size={24} strokeWidth={1.8} />
              </span>
              <p className="esv-auth__h">Verifique sua caixa de entrada</p>
              <p className="esv-auth__p">
                Mandamos um link para <strong>{email}</strong>. Clique nele para definir sua
                senha. O link vale por 1 hora.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setMode("login");
                }}
                className="esv-auth__alt"
              >
                Voltar ao login
              </button>
            </div>
          ) : mode === "login" ? (
            <form onSubmit={handleLogin} className="esv-auth__form">
              <label className="esv-field">
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="esv-input"
                />
              </label>
              <label className="esv-field">
                <span>Senha</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="esv-input"
                />
              </label>
              {errorBox}
              <button type="submit" className="esv-btn esv-btn--block" disabled={loading}>
                {loading ? "Entrando…" : "Entrar"}
                {!loading && <ArrowRight size={17} strokeWidth={2.2} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("reset");
                  setError(null);
                }}
                className="esv-auth__alt is-gold"
              >
                Primeiro acesso ou esqueci a senha
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="esv-auth__form">
              <p className="esv-auth__p">
                Digite seu e-mail cadastrado. Enviamos um link para você definir (ou redefinir)
                sua senha.
              </p>
              <label className="esv-field">
                <span>E-mail cadastrado</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="esv-input"
                />
              </label>
              {errorBox}
              <button type="submit" className="esv-btn esv-btn--block" disabled={loading}>
                {loading ? "Enviando…" : "Enviar link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="esv-auth__alt"
              >
                Voltar ao login
              </button>
            </form>
          )}
        </div>

        <p className="esv-auth__foot esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
          Acesso exclusivo para clientes ativos do programa
        </p>
      </div>
    </div>
  );
}
