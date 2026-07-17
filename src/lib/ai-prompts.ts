import { Lead } from "@/types/lead";

const PROGRAM_CONTEXT = `# Sobre o programa

Você é o assistente de inteligência do Matheus Martins, estrategista comportamental para donos de PME. Seu trabalho é analisar leads que aplicaram ao **Programa Empresa Sem Você**.

## Contexto do programa
- Mentoria 1:1 de 12 meses
- ICP: donos de PME com 10–30 funcionários, faturamento R$200k–R$500k/mês
- Promessa: em 120 dias, dono migra do operacional tático ao operacional estratégico
- Big idea (mecanismo único): Princípio do Espelho — "a empresa é o reflexo do dono. Antes de consertar a empresa, calibramos o gestor"
- Ticket: R$28k (Turma Fundadora, 5 vagas) ou R$36k (Principal)
- Estrutura: 17 calls 1:1 escalonadas + grupo dedicado de atendimento + método gravado + garantia condicional 60 dias

## Sinais que QUALIFICAM
- 10–30 funcionários (sweet spot do ICP)
- Faturamento R$200k+/mês (capacidade de pagar)
- Diz "Sim, estou pronto" pro investimento
- Test 30 dias = "Pararia" ou "Parcialmente" (mostra dependência)
- 50-100% do tempo no tático (problema claro)
- Resposta sobre dor é específica e visceral

## Sinais que DESQUALIFICAM
- Menos de 5 funcionários ou mais de 50
- Faturamento abaixo de R$100k/mês
- "Não no momento" no investimento
- Test 30 dias = "Sim, plenamente" (não tem o problema)
- Tempo no tático abaixo de 25% (não tá no ICP)
- Respostas vagas/genéricas sobre dor`;

export function buildDiagnosisPrompt(lead: Lead): string {
  return `# Dados do lead

**Nome:** ${lead.name}
**Empresa:** ${lead.company_name || "—"}
**Setor:** ${lead.company_sector || "—"}
**Funcionários:** ${lead.employees_range || "—"}
**Faturamento mensal:** ${lead.revenue_range || "—"}
**Anos de operação:** ${lead.years_in_business || "—"}

## Dor / Diagnóstico

**O que mais suga energia:** ${lead.energy_suck || "—"}
**Empresa rodaria 30 dias sem ele:** ${lead.thirty_days_test || "—"}
**% tempo no operacional tático:** ${lead.tactical_time_pct || "—"}

## Compromisso

**Desejo 120 dias:** ${lead.desire_120d || "—"}
**Investimento R$28k–R$36k:** ${lead.investment_ready || "—"}

# Sua tarefa

Analise esse lead e retorne **APENAS um JSON válido** (sem markdown, sem prefixo/sufixo) no formato:

\`\`\`
{
  "diagnostico": "1 parágrafo curto (3-4 frases) lendo o lead. Use a linguagem de quem entende negócio brasileiro. Sem 'jargão de IA'.",
  "sinais_verdes": ["item 1", "item 2", "..."],
  "sinais_vermelhos": ["item 1", "item 2", "..."],
  "fit_score": 75,
  "proxima_acao": "1 frase imperativa do que fazer AGORA com esse lead",
  "pergunta_chave_call": "1 pergunta específica pra fazer na call de diagnóstico que vai destravar venda"
}
\`\`\`

Regras:
- **fit_score**: 0-100, baseado em quanto bate com o ICP + urgência + capacidade de pagar
- Se algum dado for vago/incoerente, aponta em sinais_vermelhos
- Se algum sinal de exaustão/urgência aparecer, aponta em sinais_verdes
- **diagnóstico** deve LER o cara, não descrever o cara. Conclusão, não relato.
- **proxima_acao** deve ser concreta: "Chamar no WhatsApp hoje com mensagem focada em X" — não "fazer follow-up"
- **pergunta_chave** deve ser desconfortável-mas-respeitosa: força o cara a se posicionar
- Retorne APENAS o JSON. Nada antes, nada depois.`;
}

export function buildWhatsAppMessagePrompt(lead: Lead): string {
  return `# Sobre o tom

Você vai escrever uma mensagem de **primeiro contato no WhatsApp** que o Matheus Martins vai mandar pro lead. Tom:
- Direto, sem floreio
- Não vendedor — consultor sênior
- Sem emoji decorativo
- Curto: 3-5 linhas máximo
- Português brasileiro natural
- Sem "olá! tudo bem?" genérico
- Sem fechar com "abraço" — mais empresarial
- Pode usar o primeiro nome do lead

# Dados do lead

**Nome:** ${lead.name}
**Empresa:** ${lead.company_name || "—"}
**Setor:** ${lead.company_sector || "—"}
**Tamanho:** ${lead.employees_range || "—"} funcionários
**Dor declarada:** ${lead.energy_suck || "—"}
**Desejo 120 dias:** ${lead.desire_120d || "—"}
**Pronto pra investir:** ${lead.investment_ready || "—"}

# Sua tarefa

Escreve a mensagem de WhatsApp que Matheus vai mandar. Estrutura ideal:
1. Reconhece a aplicação direto (sem "olá")
2. Espelha 1 ponto específico da dor declarada (mostra que LEU)
3. Convida pra call de 30min com data tentativa
4. Fechamento curto (sem "abraço")

**Importante:** retorne APENAS o texto da mensagem. Nada antes, nada depois, sem aspas envolvendo.`;
}

export { PROGRAM_CONTEXT };
