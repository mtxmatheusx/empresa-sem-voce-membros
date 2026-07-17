"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { applicationSchema, type ApplicationData } from "@/lib/schemas";
import { formatWhatsApp } from "@/lib/utils";

const STEPS = [
  { id: "identificacao", number: "01", title: "Identificação", subtitle: "Como entrar em contato com você" },
  { id: "empresa", number: "02", title: "Sua empresa", subtitle: "Onde você opera hoje" },
  { id: "dor", number: "03", title: "O que aperta", subtitle: "Onde está o real gargalo" },
  { id: "compromisso", number: "04", title: "Para onde vai", subtitle: "Seu horizonte de transformação" },
];

export function MultiStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<ApplicationData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // UTM tracking — captura uma vez na montagem
  const [utm] = useState(() => ({
    utm_source: searchParams.get("utm_source") || searchParams.get("source") || undefined,
    utm_medium: searchParams.get("utm_medium") || undefined,
    utm_campaign: searchParams.get("utm_campaign") || undefined,
  }));

  const update = (field: keyof ApplicationData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateStep = (): boolean => {
    const fieldsByStep: Record<number, (keyof ApplicationData)[]> = {
      0: ["name", "whatsapp", "email"],
      1: ["company_name", "company_sector", "employees_range", "revenue_range", "years_in_business"],
      2: ["energy_suck", "thirty_days_test", "tactical_time_pct"],
      3: ["desire_120d", "investment_ready"],
    };

    const fields = fieldsByStep[step] || [];
    const partial = Object.fromEntries(fields.map((f) => [f, data[f]])) as Partial<ApplicationData>;
    const stepSchema = applicationSchema.pick(
      Object.fromEntries(fields.map((f) => [f, true])) as never
    );
    const result = stepSchema.safeParse(partial);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...utm }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao enviar aplicação");
      }
      router.push("/obrigado");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Erro inesperado");
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="mb-[var(--space-xl)]">
        <div className="flex items-center justify-between mb-4">
          <span className="t-label">
            <span className="text-[#B8902A]">{currentStep.number}</span>
            <span className="mx-2 text-[#D4CFC0]">/</span>
            <span>{STEPS.length}</span>
          </span>
          <span className="t-label">{Math.round(progress)}%</span>
        </div>
        <div className="h-px bg-[#EAE6DC] relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#B8902A]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="t-h2">{currentStep.title}</h2>
          <p className="t-body mt-2 mb-[var(--space-xl)]">{currentStep.subtitle}</p>

          <div className="space-y-[var(--space-md)]">
            {step === 0 && <Step0 data={data} update={update} errors={errors} />}
            {step === 1 && <Step1 data={data} update={update} errors={errors} />}
            {step === 2 && <Step2 data={data} update={update} errors={errors} />}
            {step === 3 && <Step3 data={data} update={update} errors={errors} />}
          </div>
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <div className="mt-[var(--space-md)] p-4 border-l-2 border-[#C24842] bg-[#C24842]/5 text-sm text-[#0F0E0C]">
          {submitError}
        </div>
      )}

      <div className="mt-[var(--space-xl)] flex items-center justify-between border-t border-[#EAE6DC] pt-[var(--space-md)]">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          type="button"
          size="md"
        >
          ← Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next} size="lg" type="button">
            Continuar →
          </Button>
        ) : (
          <Button onClick={submit} size="lg" disabled={submitting} type="button">
            {submitting ? "Enviando…" : "Enviar aplicação"}
          </Button>
        )}
      </div>
    </div>
  );
}

type StepProps = {
  data: Partial<ApplicationData>;
  update: (field: keyof ApplicationData, value: string | number) => void;
  errors: Record<string, string>;
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="t-label block mb-2">{label}</label>
      {children}
      {error && (
        <p className="text-[11px] text-[#C24842] mt-2 tracking-wide uppercase">
          {error}
        </p>
      )}
    </div>
  );
}

function Step0({ data, update, errors }: StepProps) {
  return (
    <>
      <Field label="Nome completo" error={errors.name}>
        <Input
          value={data.name || ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Seu nome"
          error={!!errors.name}
        />
      </Field>
      <Field label="WhatsApp" error={errors.whatsapp}>
        <Input
          value={data.whatsapp || ""}
          onChange={(e) => update("whatsapp", formatWhatsApp(e.target.value))}
          placeholder="(11) 99999-9999"
          error={!!errors.whatsapp}
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          value={data.email || ""}
          onChange={(e) => update("email", e.target.value)}
          placeholder="voce@empresa.com.br"
          error={!!errors.email}
        />
      </Field>
      <Field label="Instagram (opcional)">
        <Input
          value={data.instagram || ""}
          onChange={(e) => update("instagram", e.target.value)}
          placeholder="@seuusuario"
        />
      </Field>
    </>
  );
}

function Step1({ data, update, errors }: StepProps) {
  return (
    <>
      <Field label="Nome da empresa" error={errors.company_name}>
        <Input
          value={data.company_name || ""}
          onChange={(e) => update("company_name", e.target.value)}
          placeholder="Nome ou marca"
          error={!!errors.company_name}
        />
      </Field>
      <Field label="Setor" error={errors.company_sector}>
        <Input
          value={data.company_sector || ""}
          onChange={(e) => update("company_sector", e.target.value)}
          placeholder="Ex: Moda feminina premium, varejo de calçados, restaurante, agência…"
          error={!!errors.company_sector}
        />
      </Field>
      <Field label="Funcionários hoje" error={errors.employees_range}>
        <SelectGrid
          value={data.employees_range}
          onChange={(v) => update("employees_range", v)}
          options={["10-15", "16-20", "21-30", "30+"]}
        />
      </Field>
      <Field label="Faturamento médio mensal" error={errors.revenue_range}>
        <SelectGrid
          value={data.revenue_range}
          onChange={(v) => update("revenue_range", v)}
          options={[
            { value: "ate-200k", label: "Até R$200k" },
            { value: "200-300k", label: "R$200–300k" },
            { value: "300-500k", label: "R$300–500k" },
            { value: "500k+", label: "Acima de R$500k" },
          ]}
        />
      </Field>
      <Field label="Anos de operação" error={errors.years_in_business}>
        <Input
          type="number"
          min={0}
          value={data.years_in_business?.toString() || ""}
          onChange={(e) => update("years_in_business", parseInt(e.target.value) || 0)}
          placeholder="Ex: 12"
          error={!!errors.years_in_business}
        />
      </Field>
    </>
  );
}

function Step2({ data, update, errors }: StepProps) {
  return (
    <>
      <Field
        label="O que mais te suga energia hoje na empresa?"
        error={errors.energy_suck}
      >
        <Textarea
          value={data.energy_suck || ""}
          onChange={(e) => update("energy_suck", e.target.value)}
          placeholder={`Ex: Aprovo cada compra acima de R$500. Equipe não toma decisão sem mim. Já saí de reunião com cliente importante pra resolver problema operacional no depósito.`}
          error={!!errors.energy_suck}
          rows={4}
        />
      </Field>
      <Field
        label="Se você sumisse 30 dias, sua empresa continuaria rodando?"
        error={errors.thirty_days_test}
      >
        <SelectGrid
          value={data.thirty_days_test}
          onChange={(v) => update("thirty_days_test", v)}
          options={["Sim, plenamente", "Parcialmente", "Pararia"]}
          columns={3}
        />
      </Field>
      <Field
        label="Quanto do seu tempo está em operacional tático hoje?"
        error={errors.tactical_time_pct}
      >
        <SelectGrid
          value={data.tactical_time_pct}
          onChange={(v) => update("tactical_time_pct", v)}
          options={["0-25%", "25-50%", "50-75%", "75-100%"]}
        />
      </Field>
    </>
  );
}

function Step3({ data, update, errors }: StepProps) {
  return (
    <>
      <Field
        label="Qual é o seu desejo concreto para os próximos 120 dias?"
        error={errors.desire_120d}
      >
        <Textarea
          value={data.desire_120d || ""}
          onChange={(e) => update("desire_120d", e.target.value)}
          placeholder={`Ex: Acordar segunda e a empresa já estar rodando sem mim. Equipe entregando metas, processos andando, decisões sendo tomadas sem minha aprovação. Quero abrir nova unidade no próximo ano e hoje nem consigo pensar nisso porque tô apagando incêndio o dia inteiro.`}
          error={!!errors.desire_120d}
          rows={4}
        />
      </Field>
      <Field
        label="Está pronto para investir entre R$28k e R$36k no programa?"
        error={errors.investment_ready}
      >
        <SelectGrid
          value={data.investment_ready}
          onChange={(v) => update("investment_ready", v)}
          options={["Sim, estou pronto", "Preciso entender mais", "Não no momento"]}
          columns={3}
        />
      </Field>
      <div className="mt-[var(--space-lg)] border-t border-[#EAE6DC] pt-[var(--space-md)]">
        <p className="t-label mb-3">Próximo passo</p>
        <p className="font-serif italic text-[#0F0E0C] text-[var(--text-lg)] leading-snug">
          Alguém da equipe entra em contato em até <span className="text-[#B8902A]">1 dia útil</span> para agendar a call de 30 minutos.
        </p>
      </div>
    </>
  );
}

function SelectGrid({
  value,
  onChange,
  options,
  columns = 4,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  columns?: number;
}) {
  const cols = columns === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4";
  return (
    <div className={`grid ${cols} gap-px bg-[#EAE6DC] border border-[#EAE6DC]`}>
      {options.map((opt) => {
        const optValue = typeof opt === "string" ? opt : opt.value;
        const optLabel = typeof opt === "string" ? opt : opt.label;
        const selected = value === optValue;
        return (
          <button
            type="button"
            key={optValue}
            onClick={() => onChange(optValue)}
            className={`px-5 py-4 text-sm font-medium transition-all duration-300 ease-out cursor-pointer text-left ${
              selected
                ? "bg-[#B8902A] text-[#FAFAF7]"
                : "bg-[#FAFAF7] text-[#A3A097] hover:bg-[#FFFFFF] hover:text-[#0F0E0C]"
            }`}
          >
            {optLabel}
          </button>
        );
      })}
    </div>
  );
}
