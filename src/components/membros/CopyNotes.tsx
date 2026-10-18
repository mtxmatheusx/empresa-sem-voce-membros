"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyNotes({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="esv-btn esv-btn--ghost esv-glass"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 2200);
        } catch {
          /* navegador sem permissão de área de transferência */
        }
      }}
    >
      {ok ? <Check size={16} strokeWidth={2.4} /> : <Copy size={16} strokeWidth={2} />}
      {ok ? "Copiado" : "Copiar tudo"}
    </button>
  );
}
