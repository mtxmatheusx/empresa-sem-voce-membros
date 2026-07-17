import { Lead } from "@/types/lead";

export function applyTemplateVariables(body: string, lead: Lead): string {
  const firstName = (lead.name || "").split(" ")[0] || "";
  const replacements: Record<string, string> = {
    "{{nome}}": lead.name || "",
    "{{primeiro_nome}}": firstName,
    "{{empresa}}": lead.company_name || "sua empresa",
    "{{setor}}": lead.company_sector || "",
    "{{funcionarios}}": lead.employees_range || "",
    "{{whatsapp}}": lead.whatsapp || "",
  };

  let result = body;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.split(key).join(value);
  }
  return result;
}

export const AVAILABLE_VARIABLES = [
  { key: "{{primeiro_nome}}", label: "Primeiro nome" },
  { key: "{{nome}}", label: "Nome completo" },
  { key: "{{empresa}}", label: "Empresa" },
  { key: "{{setor}}", label: "Setor" },
  { key: "{{funcionarios}}", label: "Faixa de funcionários" },
  { key: "{{whatsapp}}", label: "WhatsApp" },
];
