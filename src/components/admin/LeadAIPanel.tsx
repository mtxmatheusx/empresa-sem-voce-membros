"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageCircle, Copy, Check, ExternalLink, Send, RotateCcw, FileText, ChevronDown } from "lucide-react";
import { Lead, LeadStatus, MessageTemplate, STATUS_LABELS } from "@/types/lead";
import { applyTemplateVariables } from "@/lib/templates";

function buildWhatsAppLink(whatsapp: string, message: string): string | null {
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

interface Analysis {
  diagnostico: string;
  sinais_verdes: string[];
  sinais_vermelhos: string[];
  fit_score: number;
  proxima_acao: string;
  pergunta_chave_call: string;
}

const ADVANCE_OPTIONS: { label: string; status: LeadStatus }[] = [
  { label: "Marcar enviada (Triagem)", status: "triagem" },
  { label: "Enviada + Diagnóstico Agendado", status: "diag-agendado" },
  { label: "Enviada + Diagnóstico Realizado", status: "diag-feito" },
  { label: "Enviada + Proposta Enviada", status: "proposta" },
];

export function LeadAIPanel({
  lead,
}: {
  lead: Lead;
}) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [message, setMessage] = useState<string>("");
  const [originalMessage, setOriginalMessage] = useState<string>("");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [showAdvanceMenu, setShowAdvanceMenu] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingM, setLoadingM] = useState(false);
  const [logging, setLogging] = useState(false);
  const [contactLogged, setContactLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch templates uma vez
  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []))
      .catch(() => {});
  }, []);

  async function runAnalysis() {
    setLoadingA(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${lead.id}/analyze`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro");
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoadingA(false);
    }
  }

  async function generateMessage() {
    setLoadingM(true);
    setError(null);
    setContactLogged(false);
    try {
      const res = await fetch(`/api/leads/${lead.id}/generate-message`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro");
      setMessage(data.message);
      setOriginalMessage(data.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoadingM(false);
    }
  }

  function applyTemplate(template: MessageTemplate) {
    const filled = applyTemplateVariables(template.body, lead);
    setMessage(filled);
    setOriginalMessage(filled);
    setContactLogged(false);
  }

  function copyMessage() {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function logContact(targetStatus: LeadStatus) {
    setLogging(true);
    setShowAdvanceMenu(false);
    try {
      const res = await fetch(`/api/leads/${lead.id}/log-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: "whatsapp", message, auto_advance: false }),
      });
      if (!res.ok) throw new Error("Erro ao registrar contato");

      // Avança status manualmente pro alvo escolhido
      if (targetStatus !== lead.status) {
        await fetch(`/api/leads/${lead.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: targetStatus }),
        });
      }
      setContactLogged(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setLogging(false);
    }
  }

  function resetMessage() {
    setMessage(originalMessage);
  }

  const isEdited = message !== originalMessage && originalMessage !== "";
  const whatsappLink = message ? buildWhatsAppLink(lead.whatsapp, message) : null;

  return (
    <section>
      <header className="mb-6">
        <p className="t-eyebrow mb-2">Inteligência</p>
        <h2 className="t-h3 text-[#0F0E0C]">Análise por IA</h2>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button onClick={runAnalysis} disabled={loadingA} size="sm">
            <Sparkles size={14} className="mr-2" strokeWidth={2} />
            {loadingA ? "Analisando…" : analysis ? "Reanalisar" : "Analisar lead"}
          </Button>
          <Button onClick={generateMessage} disabled={loadingM} size="sm" variant="outline">
            <MessageCircle size={14} className="mr-2" strokeWidth={2} />
            {loadingM ? "Gerando…" : message ? "Gerar com IA" : "Gerar mensagem com IA"}
          </Button>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={13} className="text-[#B8902A]" strokeWidth={2} />
              <p className="t-label">Templates rápidos</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  title={t.description || t.name}
                  className="px-3 py-1.5 text-[12px] font-medium bg-[#F4F2EC] hover:bg-[#EAE6DC] text-[#0F0E0C] rounded-full transition-colors cursor-pointer"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 border-l-2 border-[#C24842] bg-[#C24842]/5 rounded-r-lg text-[13px] text-[#0F0E0C]">
            {error}
          </div>
        )}

        {analysis && (
          <article className="card-elevated p-7 space-y-6 anim-fade-up">
            <div className="flex items-baseline justify-between border-b border-[#EAE6DC] pb-5">
              <div>
                <p className="t-label mb-1">Fit score</p>
                <p
                  className={`font-display font-bold text-[40px] leading-none tracking-[-0.025em] ${
                    analysis.fit_score >= 70
                      ? "text-[#2D7A4E]"
                      : analysis.fit_score >= 40
                      ? "text-[#B8902A]"
                      : "text-[#C24842]"
                  }`}
                >
                  {analysis.fit_score}
                  <span className="text-[18px] text-[#A09C92] ml-1">/100</span>
                </p>
              </div>
              <p className="t-label">
                {analysis.fit_score >= 70
                  ? "Alto fit"
                  : analysis.fit_score >= 40
                  ? "Médio"
                  : "Baixo fit"}
              </p>
            </div>

            <div>
              <p className="t-label mb-3">Diagnóstico</p>
              <p className="text-[15px] leading-[1.65] text-[#0F0E0C]">
                {analysis.diagnostico}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {analysis.sinais_verdes?.length > 0 && (
                <div>
                  <p className="t-label mb-3 text-[#2D7A4E]">Sinais verdes</p>
                  <ul className="space-y-2">
                    {analysis.sinais_verdes.map((s, i) => (
                      <li key={i} className="text-[13px] leading-[1.55] text-[#0F0E0C] flex gap-2">
                        <span className="text-[#2D7A4E] mt-0.5">+</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.sinais_vermelhos?.length > 0 && (
                <div>
                  <p className="t-label mb-3 text-[#C24842]">Sinais vermelhos</p>
                  <ul className="space-y-2">
                    {analysis.sinais_vermelhos.map((s, i) => (
                      <li key={i} className="text-[13px] leading-[1.55] text-[#0F0E0C] flex gap-2">
                        <span className="text-[#C24842] mt-0.5">−</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-[#EAE6DC] pt-5">
              <p className="t-label mb-3">Próxima ação sugerida</p>
              <p className="font-serif italic text-[17px] leading-[1.4] text-[#B8902A]">
                {analysis.proxima_acao}
              </p>
            </div>

            <div>
              <p className="t-label mb-3">Pergunta-chave pra call</p>
              <p className="text-[14px] leading-[1.55] text-[#0F0E0C] border-l-2 border-[#B8902A] pl-4">
                {analysis.pergunta_chave_call}
              </p>
            </div>
          </article>
        )}

        {message && (
          <article className="card-elevated p-7 anim-fade-up">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="t-label">Mensagem WhatsApp</p>
                {isEdited && (
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#B8902A]">
                    · Editada
                  </span>
                )}
                {contactLogged && (
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#2D7A4E] flex items-center gap-1">
                    <Check size={11} strokeWidth={2.5} />
                    Registrada
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isEdited && (
                  <button
                    onClick={resetMessage}
                    className="flex items-center gap-1.5 text-[11px] text-[#A09C92] hover:text-[#0F0E0C] transition-colors cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    Restaurar
                  </button>
                )}
                <button
                  onClick={copyMessage}
                  className="flex items-center gap-1.5 text-[12px] text-[#6B6862] hover:text-[#B8902A] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={12} />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </header>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={Math.max(5, message.split("\n").length + 1)}
              className="w-full bg-[#FAFAF7] border border-[#EAE6DC] focus:border-[#B8902A] rounded-lg px-4 py-3 text-[14px] leading-[1.65] text-[#0F0E0C] font-sans resize-y transition-colors focus:outline-none"
            />

            <p className="t-label mt-3 text-[#A09C92]">
              Edite livremente. A versão final é o que vai pro WhatsApp.
            </p>

            <div className="mt-5 pt-5 border-t border-[#EAE6DC] flex flex-wrap items-center gap-3">
              {whatsappLink ? (
                <>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill bg-[#25D366] text-white px-5 h-10 text-[13px] font-medium hover:bg-[#1FB855] inline-flex items-center gap-2"
                  >
                    <MessageCircle size={14} strokeWidth={2} />
                    Abrir no WhatsApp
                    <ExternalLink size={11} strokeWidth={2} />
                  </a>

                  {/* Dropdown de avançar status */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAdvanceMenu(!showAdvanceMenu)}
                      disabled={logging || contactLogged}
                      className="inline-flex items-center gap-2 h-10 px-5 text-[13px] font-medium rounded-full bg-[#0F0E0C] text-white hover:bg-[#1F1D1B] transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Send size={13} strokeWidth={2} />
                      {logging
                        ? "Registrando…"
                        : contactLogged
                        ? "Já registrado"
                        : "Marcar como enviada"}
                      {!contactLogged && <ChevronDown size={12} strokeWidth={2} />}
                    </button>
                    {showAdvanceMenu && !contactLogged && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#EAE6DC] rounded-xl shadow-lg overflow-hidden z-20 anim-fade-up">
                        {ADVANCE_OPTIONS.map((opt) => (
                          <button
                            key={opt.status}
                            onClick={() => logContact(opt.status)}
                            className="w-full px-4 py-3 text-left text-[13px] text-[#0F0E0C] hover:bg-[#FAFAF7] transition-colors border-b border-[#EAE6DC] last:border-0 cursor-pointer flex items-center justify-between gap-3"
                          >
                            <span>{opt.label}</span>
                            <span className="text-[10px] uppercase tracking-[0.12em] text-[#A09C92] flex-shrink-0">
                              → {STATUS_LABELS[opt.status]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="t-label">→ {lead.whatsapp}</p>
                </>
              ) : (
                <p className="t-label text-[#C24842]">
                  WhatsApp do lead não cadastrado
                </p>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
