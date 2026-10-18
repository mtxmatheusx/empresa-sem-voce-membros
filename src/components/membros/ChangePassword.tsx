"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, KeyRound } from "lucide-react";

const MIN = 8;

export function ChangePassword() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < MIN) {
      setMsg({ ok: false, text: `A senha precisa ter pelo menos ${MIN} caracteres.` });
      return;
    }
    if (pw !== confirm) {
      setMsg({ ok: false, text: "As senhas não conferem." });
      return;
    }
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) {
      setMsg({ ok: false, text: "Não deu para trocar agora. Tente de novo em instantes." });
      return;
    }
    setMsg({ ok: true, text: "Senha alterada. Vale a partir do próximo login." });
    setPw("");
    setConfirm("");
  }

  return (
    <form onSubmit={submit} className="esv-pwform">
      <p className="esv-panel__kicker">
        <KeyRound size={15} strokeWidth={2} /> Trocar senha
      </p>
      <label className="esv-field">
        <span>Nova senha</span>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder={`Mínimo ${MIN} caracteres`}
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
          autoComplete="new-password"
          className="esv-input"
        />
      </label>
      {msg && (
        <p className={msg.ok ? "esv-ok" : "esv-alert"} role="status">
          {msg.ok && <Check size={15} strokeWidth={2.6} />} {msg.text}
        </p>
      )}
      <button type="submit" className="esv-btn esv-btn--block" disabled={loading}>
        {loading ? "Salvando…" : "Salvar nova senha"}
      </button>
    </form>
  );
}
