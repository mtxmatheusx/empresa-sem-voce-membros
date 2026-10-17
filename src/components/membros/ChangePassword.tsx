"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export function ChangePassword() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) {
      setMsg({ ok: false, text: "A senha precisa ter pelo menos 6 caracteres." });
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
      setMsg({ ok: false, text: error.message });
      return;
    }
    setMsg({ ok: true, text: "Senha alterada com sucesso!" });
    setPw("");
    setConfirm("");
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-sm">
      <p className="t-eyebrow flex items-center gap-2">
        <KeyRound size={14} /> Trocar senha
      </p>
      <p className="text-[13px] text-[#A39E93] leading-relaxed">
        Defina uma senha só sua. Vale pro próximo login.
      </p>
      <div>
        <label className="t-label block mb-2">Nova senha</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          className="esv-input"
        />
      </div>
      <div>
        <label className="t-label block mb-2">Confirmar senha</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repita a senha"
          autoComplete="new-password"
          className="esv-input"
        />
      </div>

      {msg && (
        <div
          className="px-4 py-3 rounded-lg text-[13px] text-[#F4F0E6]"
          style={{
            borderLeft: `2px solid ${msg.ok ? "#5FB98A" : "#E0736B"}`,
            background: msg.ok ? "rgba(95,185,138,0.08)" : "rgba(224,115,107,0.08)",
          }}
        >
          {msg.text}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
