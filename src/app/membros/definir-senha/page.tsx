"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Check, KeyRound, ArrowRight } from "lucide-react";

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
    <div className="esv-auth">
      <div className="esv-auth__glow" aria-hidden />
      <div className="esv-auth__glow esv-auth__glow--2" aria-hidden />

      <div className="esv-auth__col">
        <header className="esv-auth__head esv-rise">
          <span className="esv-brand__mark esv-auth__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-esv-mark.png" alt="Empresa Sem Você" />
          </span>
          <p className="t-eyebrow">Área de membros</p>
          <h1 className="esv-auth__title">
            Defina sua <em>senha</em>
          </h1>
        </header>

        <div className="esv-auth__card esv-glass esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
          {done ? (
            <div className="esv-auth__sent">
              <span className="esv-locked__icon">
                <Check size={24} strokeWidth={2} />
              </span>
              <p className="esv-auth__h">Senha definida</p>
              <p className="esv-auth__p">Entrando na plataforma…</p>
            </div>
          ) : ready && !hasSession ? (
            <div className="esv-auth__sent">
              <span className="esv-locked__icon">
                <KeyRound size={24} strokeWidth={1.8} />
              </span>
              <p className="esv-auth__h">Link inválido ou expirado</p>
              <p className="esv-auth__p">
                Peça um novo link em &quot;Primeiro acesso ou esqueci a senha&quot;, na tela de login.
              </p>
              <Link href="/membros/login" className="esv-auth__alt is-gold">
                Ir para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="esv-auth__form">
              <p className="esv-auth__p">Escolha uma senha só sua. Ela vale para os próximos acessos.</p>
              <label className="esv-field">
                <span>Nova senha</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                  className="esv-input"
                />
              </label>
              <label className="esv-field">
                <span>Confirmar senha</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  autoComplete="new-password"
                  className="esv-input"
                />
              </label>
              {error && (
                <div className="esv-alert" role="alert">
                  {error}
                </div>
              )}
              <button type="submit" className="esv-btn esv-btn--block" disabled={loading || !ready}>
                {loading ? "Salvando…" : "Definir senha e entrar"}
                {!loading && <ArrowRight size={17} strokeWidth={2.2} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
