"use client";

// Primeiro acesso: três telas curtas explicando como o programa funciona.
// Ao terminar (ou pular), grava clients.onboarded_at e não aparece mais.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays, MessageCircle, NotebookPen } from "lucide-react";

type Step = { icon: React.ReactNode; kicker: string; title: string; body: string };

export function Onboarding({
  firstName,
  totalDays,
}: {
  firstName: string;
  totalDays: number;
}) {
  const [open, setOpen] = useState(true);
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  const steps: Step[] = [
    {
      icon: <CalendarDays size={26} strokeWidth={1.8} />,
      kicker: firstName ? `${firstName}, boas-vindas` : "Boas-vindas",
      title: `${totalDays} dias, cinco pilares.`,
      body: "O programa segue uma ordem: cada pilar prepara o seguinte. No Início você vê em que dia está e qual é a próxima aula.",
    },
    {
      icon: <NotebookPen size={26} strokeWidth={1.8} />,
      kicker: "Nas aulas",
      title: "Assista, anote, aplique.",
      body: "O vídeo continua de onde você parou, e a aula conta como concluída quando você assiste quase tudo. Embaixo de cada aula há um campo para anotar o que vai aplicar; tudo fica reunido em Anotações.",
    },
    {
      icon: <MessageCircle size={26} strokeWidth={1.8} />,
      kicker: "Acompanhamento",
      title: "Você não faz isso sozinho.",
      body: "As tarefas da semana aparecem no Início, com prazo. Se travar em algum ponto, fale comigo direto pelo WhatsApp.",
    },
  ];
  const last = i === steps.length - 1;

  useEffect(() => {
    const d = dialog.current;
    if (d && !d.open) d.showModal();
  }, []);

  const finish = async () => {
    setOpen(false);
    dialog.current?.close();
    const supabase = createClient();
    await supabase.rpc("esv_mark_onboarded");
  };

  if (!open) return null;
  const s = steps[i];

  return (
    <dialog
      ref={dialog}
      className="esv-onb"
      aria-labelledby="esv-onb-title"
      onCancel={(e) => {
        e.preventDefault();
        finish();
      }}
    >
      <div className="esv-onb__card esv-glass">
        <button type="button" className="esv-onb__skip" onClick={finish}>
          Pular
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="esv-onb__body"
          >
            <span className="esv-onb__icon">{s.icon}</span>
            <p className="t-eyebrow">{s.kicker}</p>
            <h2 id="esv-onb-title" className="esv-onb__title">
              {s.title}
            </h2>
            <p className="esv-onb__text">{s.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="esv-onb__foot">
          <div className="esv-onb__dots" aria-label={`Passo ${i + 1} de ${steps.length}`}>
            {steps.map((_, k) => (
              <span key={k} className={k === i ? "is-on" : ""} />
            ))}
          </div>
          <div className="esv-onb__nav">
            {i > 0 && (
              <button type="button" className="esv-btn esv-btn--ghost esv-glass" onClick={() => setI(i - 1)}>
                Voltar
              </button>
            )}
            <button
              type="button"
              className="esv-btn esv-onb__next"
              onClick={() => (last ? finish() : setI(i + 1))}
              autoFocus
            >
              {last ? "Começar" : "Próximo"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
