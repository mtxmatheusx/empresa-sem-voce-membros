import { GoogleGenAI, Type } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGemini() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY não configurada");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// Schema estruturado pra resposta da análise
export const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    diagnostico: {
      type: Type.STRING,
      description: "Diagnóstico em 1 parágrafo curto (3-4 frases) que LÊ o lead.",
    },
    sinais_verdes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de sinais que qualificam o lead.",
    },
    sinais_vermelhos: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de sinais de alerta / desqualificação.",
    },
    fit_score: {
      type: Type.INTEGER,
      description: "Score 0-100 de fit com o ICP.",
    },
    proxima_acao: {
      type: Type.STRING,
      description: "Frase imperativa concreta do que fazer com esse lead AGORA.",
    },
    pergunta_chave_call: {
      type: Type.STRING,
      description: "Pergunta específica pra usar na call de diagnóstico.",
    },
  },
  required: [
    "diagnostico",
    "sinais_verdes",
    "sinais_vermelhos",
    "fit_score",
    "proxima_acao",
    "pergunta_chave_call",
  ],
  propertyOrdering: [
    "fit_score",
    "diagnostico",
    "sinais_verdes",
    "sinais_vermelhos",
    "proxima_acao",
    "pergunta_chave_call",
  ],
};
