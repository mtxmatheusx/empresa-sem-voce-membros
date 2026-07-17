import { z } from "zod";

export const applicationSchema = z.object({
  // Etapa 1 — Identificação
  name: z.string().min(3, "Nome muito curto"),
  whatsapp: z.string().min(14, "WhatsApp inválido"),
  email: z.string().email("Email inválido"),
  instagram: z.string().optional(),

  // Etapa 2 — Empresa
  company_name: z.string().min(2, "Nome da empresa obrigatório"),
  company_sector: z.string().min(2, "Setor obrigatório"),
  employees_range: z.enum(["10-15", "16-20", "21-30", "30+"]),
  revenue_range: z.enum(["ate-200k", "200-300k", "300-500k", "500k+"]),
  years_in_business: z.coerce.number().min(0).max(100),

  // Etapa 3 — Dor
  energy_suck: z.string().min(10, "Conta com mais detalhes"),
  thirty_days_test: z.enum([
    "Sim, plenamente",
    "Parcialmente",
    "Pararia",
  ]),
  tactical_time_pct: z.enum(["0-25%", "25-50%", "50-75%", "75-100%"]),

  // Etapa 4 — Compromisso
  desire_120d: z.string().min(10, "Conta o que você quer alcançar"),
  investment_ready: z.enum([
    "Sim, estou pronto",
    "Preciso entender mais",
    "Não no momento",
  ]),
  preferred_call_time: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type ApplicationData = z.infer<typeof applicationSchema>;
