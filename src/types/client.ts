export type ClientStatus = "ativo" | "pausado" | "concluido" | "cancelado";

export interface Client {
  id: string;
  lead_id: string | null;
  name: string;
  email: string;
  whatsapp: string | null;
  product_id: string | null;
  started_at: string;
  ends_at: string | null;
  status: ClientStatus;
  current_pillar: number;
  completion_pct: number;
  onboarded_at?: string | null;
  health_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  pillar_number: number;
  order_in_pillar: number;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  video_url: string | null;
  pdf_url: string | null;
  templates_urls: string[];
  is_published: boolean;
  // extensões ESV (área de membros)
  cover_url: string | null;
  task: string | null;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  client_id: string;
  lesson_id: string;
  watched_pct: number;
  last_position_seconds?: number;
  completed_at: string | null;
  last_watched_at: string | null;
  created_at: string;
}

export type TaskStatus = "pendente" | "em-execucao" | "concluida";

export interface ClientTask {
  id: string;
  client_id: string;
  lesson_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
}

export interface ClientSelfNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  ativo: "Ativo",
  pausado: "Pausado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: "Pendente",
  "em-execucao": "Em execução",
  concluida: "Concluída",
};

export const PILLAR_INFO: Record<number, { name: string; tese: string; accent: string }> = {
  0: { name: "Boas-vindas", tese: "Antes de começar, o contexto.", accent: "#B8902A" },
  1: { name: "Calibração do Gestor", tese: "Sua empresa não tá travada. Você tá travado nela.", accent: "#B8902A" },
  2: { name: "Hierarquia & Liderança", tese: "Equipe que não pode decidir nunca cresce com você.", accent: "#B8902A" },
  3: { name: "Processos & Cultura", tese: "Tudo que mora só na sua cabeça morre quando você sai.", accent: "#B8902A" },
  4: { name: "Eficiência com IA", tese: "A maioria dos donos contrata gente quando deveria automatizar tarefas.", accent: "#B8902A" },
  5: { name: "Marketing & Vendas", tese: "Vender mais sem virar gerente comercial.", accent: "#B8902A" },
};

export interface LessonNote {
  id: string;
  client_id: string;
  lesson_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
