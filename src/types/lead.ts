export type LeadStatus =
  | "recebida"
  | "triagem"
  | "diag-agendado"
  | "diag-feito"
  | "proposta"
  | "negociacao"
  | "fechou"
  | "perdeu";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  recebida: "Aplicação Recebida",
  triagem: "Triagem",
  "diag-agendado": "Diagnóstico Agendado",
  "diag-feito": "Diagnóstico Realizado",
  proposta: "Proposta Enviada",
  negociacao: "Negociação",
  fechou: "Fechou",
  perdeu: "Perdeu",
};

export const STATUS_ORDER: LeadStatus[] = [
  "recebida",
  "triagem",
  "diag-agendado",
  "diag-feito",
  "proposta",
  "negociacao",
  "fechou",
  "perdeu",
];

// Pipeline-stage probability for forecasting
export const STATUS_PROBABILITY: Record<LeadStatus, number> = {
  recebida: 0.05,
  triagem: 0.1,
  "diag-agendado": 0.2,
  "diag-feito": 0.35,
  proposta: 0.5,
  negociacao: 0.75,
  fechou: 1,
  perdeu: 0,
};

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  instagram: string | null;
  company_name: string | null;
  company_sector: string | null;
  employees_range: string | null;
  revenue_range: string | null;
  years_in_business: number | null;
  energy_suck: string | null;
  thirty_days_test: string | null;
  tactical_time_pct: string | null;
  desire_120d: string | null;
  investment_ready: string | null;
  preferred_call_time: string | null;
  status: LeadStatus;
  source: string | null;
  proposed_product_id: string | null;
  final_product_id: string | null;
  closed_value: number | null;
  lost_reason: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  event_type: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  content: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description: string | null;
  body: string;
  category: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
