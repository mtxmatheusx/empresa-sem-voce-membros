import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/ui/nav";

export const metadata = {
  title: "Briefing Comercial · Programa Empresa Sem Você",
  description: "Material exclusivo para vendedores e parceiros do Programa.",
  robots: { index: false, follow: false },
};

export default function VendedorPage() {
  return (
    <>
      <Nav showCta={false} />

      <main className="relative">
        {/* HERO */}
        <section className="pt-32 pb-20 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl">
              <p className="t-eyebrow">Briefing Comercial · Confidencial</p>
              <h1 className="font-display font-semibold text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] leading-[1.05] tracking-[-0.025em] text-[#0F0E0C] mt-6">
                Tudo o que você precisa saber pra vender o
                <br />
                <span className="t-accent">Programa Empresa Sem Você.</span>
              </h1>
              <p className="text-[17px] leading-[1.55] text-[#6B6862] mt-6 max-w-2xl">
                Documento de briefing pra vendedores e parceiros. Lê em 10 minutos. Tira dúvida com o Matheus direto no WhatsApp se travar em qualquer ponto.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/5551991443171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill bg-[#0F0E0C] text-white px-6 py-3 text-[14px] font-medium hover:bg-[#1F1D1B] inline-flex items-center gap-2"
                >
                  WhatsApp do Matheus →
                </a>
                <Link
                  href="/aplicar"
                  className="btn-pill border border-[#D4CFC0] text-[#0F0E0C] px-6 py-3 text-[14px] font-medium hover:border-[#0F0E0C] inline-flex items-center gap-2"
                >
                  Ver formulário de aplicação →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SUMÁRIO */}
        <section className="py-16 border-b border-[#EAE6DC] bg-[#F4F2EC]/40">
          <div className="container-x">
            <p className="t-eyebrow mb-4">Neste briefing</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
              {[
                "01 · O programa em 1 frase",
                "02 · Perfil de cliente ideal",
                "03 · Quem NÃO é cliente",
                "04 · O método em 5 pilares",
                "05 · Estrutura de entrega",
                "06 · Investimento (3 versões)",
                "07 · Comissão do parceiro",
                "08 · Garantia",
                "09 · Case real",
                "10 · Como qualificar",
                "11 · Pitch sugerido",
                "12 · Objeções comuns",
                "13 · Como aplicar",
              ].map((item) => (
                <p key={item} className="text-[13px] text-[#6B6862] font-medium tracking-[-0.005em]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* 01 · PROGRAMA EM 1 FRASE */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">01</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-6">
              O programa em 1 frase
            </h2>
            <p className="font-serif italic text-[22px] leading-[1.4] text-[#0F0E0C] border-l-2 border-[#B8902A] pl-6">
              Mentoria 1:1 de 12 meses que migra donos de PME do operacional tático ao operacional estratégico em 120 dias.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-5">
                <p className="t-label mb-2">Mentor</p>
                <p className="text-[14px] text-[#0F0E0C]">Matheus Martins · 7 anos empreendendo · Estrategista comportamental pra negócios</p>
              </div>
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-5">
                <p className="t-label mb-2">Big idea</p>
                <p className="text-[14px] text-[#0F0E0C] font-serif italic">
                  O Princípio do Espelho — a empresa é o reflexo do dono.
                </p>
              </div>
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-5">
                <p className="t-label mb-2">Promessa</p>
                <p className="text-[14px] text-[#0F0E0C]">Em 120 dias o dono sai do operacional. Em 12 meses, a empresa cresce sem depender dele na execução.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 · ICP */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">02</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-6">
              Perfil de cliente ideal (ICP)
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="t-label mb-3">Dados objetivos</p>
                <ul className="space-y-3 text-[14px] leading-[1.6] text-[#0F0E0C]">
                  <li><strong>Cargo:</strong> Dono / sócio operacional da empresa</li>
                  <li><strong>Funcionários:</strong> 10 a 30 (sweet spot 15-25)</li>
                  <li><strong>Faturamento:</strong> R$200k a R$500k/mês</li>
                  <li><strong>Tempo de operação:</strong> 5+ anos</li>
                  <li><strong>Setor:</strong> Varejo, moda, serviços, indústria leve</li>
                  <li><strong>Faixa etária:</strong> 35-55 anos</li>
                </ul>
              </div>
              <div>
                <p className="t-label mb-3">Sintomas observáveis</p>
                <ul className="space-y-3 text-[14px] leading-[1.6] text-[#0F0E0C]">
                  <li>Aprova compras pequenas (até R$500-1.000) pessoalmente</li>
                  <li>Trabalha 60+ horas por semana</li>
                  <li>Sai de reuniões importantes pra resolver operacional</li>
                  <li>Equipe não decide nada sem ele</li>
                  <li>Não tira férias há 2+ anos</li>
                  <li>Faturamento estagnado mesmo trabalhando mais</li>
                </ul>
              </div>
            </div>

            <div className="border-l-2 border-[#B8902A] pl-5 bg-[#F4F2EC]/50 py-3">
              <p className="t-label text-[#B8902A] mb-1">Frase típica do ICP perfeito</p>
              <p className="font-serif italic text-[15px] text-[#0F0E0C]">
                &quot;Sei que tenho que soltar, mas toda vez que solto, alguém faz uma cagada que custa caro. É mais fácil eu fazer.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* 03 · QUEM NÃO É */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">03</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-6">
              Quem NÃO é cliente (desqualifica de cara)
            </h2>
            <ul className="space-y-3 text-[14px] leading-[1.65] text-[#0F0E0C]">
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Menos de 5 funcionários</strong> — empresa ainda em validação. Não é o problema dele.</span></li>
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Mais de 50 funcionários</strong> — estrutura corporativa. Precisa de C-level, não de mentoria comportamental.</span></li>
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Faturamento abaixo de R$100k/mês</strong> — não vai conseguir investir R$28k-36k sem comprometer caixa.</span></li>
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Diz que &quot;empresa roda sem ele perfeitamente&quot;</strong> — não tem o problema. Não é ICP.</span></li>
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Quer fórmula pronta / receita de bolo</strong> — não é coach. Não é curso. É calibração.</span></li>
              <li className="flex gap-3"><span className="text-[#C24842]">×</span><span><strong>Procura &quot;quanto tempo demora pra ver resultado?&quot; antes de entender o método</strong> — não tem maturidade pra mentoria de alto ticket.</span></li>
            </ul>
          </div>
        </section>

        {/* 04 · MÉTODO 5 PILARES */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-5xl">
            <p className="t-eyebrow mb-3">04</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              O método em 5 pilares
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              Cinco frentes que destravam o que está segurando o dono. Começa no espelho, termina na operação.
            </p>

            <div className="space-y-5">
              {[
                {
                  n: "01",
                  title: "Calibração do Gestor",
                  thesis: "Sua empresa não tá travada. Você tá travado nela.",
                  result: "Sai do modo bombeiro. Agenda volta a ser sua.",
                  when: "Mês 1 — 4 calls semanais",
                },
                {
                  n: "02",
                  title: "Hierarquia & Liderança",
                  thesis: "Equipe que não pode decidir nunca cresce com você.",
                  result: "Equipe assume o que sempre passou pela sua mesa.",
                  when: "Meses 2-3 — 4 calls quinzenais",
                },
                {
                  n: "03",
                  title: "Processos & Cultura",
                  thesis: "Tudo que mora só na sua cabeça morre quando você sai.",
                  result: "Empresa para de depender da sua memória.",
                  when: "Meses 2-3 — junto com Pilar 2",
                },
                {
                  n: "04",
                  title: "Eficiência com IA",
                  thesis: "Contrata gente quando deveria automatizar tarefas.",
                  result: "Cresce sem inflar folha. Capacidade dobra.",
                  when: "Meses 4-6 — 1 call mensal",
                },
                {
                  n: "05",
                  title: "Marketing & Vendas Estratégicas",
                  thesis: "Vender mais sem virar gerente comercial.",
                  result: "Faturamento cresce sem você em todas as reuniões.",
                  when: "Meses 4-6 — 2 calls mensais",
                },
              ].map((p) => (
                <article key={p.n} className="border-t border-[#EAE6DC] pt-5">
                  <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-3 md:gap-6">
                    <div>
                      <p className="font-serif italic text-[#B8902A] text-[24px] leading-none">{p.n}</p>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-[18px] text-[#0F0E0C] mb-2">{p.title}</h3>
                      <p className="font-serif italic text-[14px] text-[#B8902A] mb-3">{p.thesis}</p>
                      <p className="text-[13.5px] leading-[1.6] text-[#6B6862] mb-2">{p.result}</p>
                      <p className="t-label">{p.when}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 05 · ESTRUTURA DE ENTREGA */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">05</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-8">
              Estrutura de entrega · 12 meses
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-6">
                <p className="t-label mb-3">17 Calls 1:1 escalonadas</p>
                <ul className="space-y-2 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                  <li>Mês 1 (Imersão): 4 calls semanais</li>
                  <li>Meses 2-3 (Implementação): 4 calls quinzenais</li>
                  <li>Meses 4-6 (Operação): 3 calls mensais</li>
                  <li>Meses 7-12 (Conselheiro): 6 calls mensais</li>
                </ul>
              </div>
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-6">
                <p className="t-label mb-3">Grupo dedicado de atendimento</p>
                <p className="text-[13.5px] leading-[1.65] text-[#0F0E0C]">
                  WhatsApp exclusivo: você + Matheus + Gestor de Experiência. Sem grupo com outros mentorados. Resposta em 1 dia útil.
                </p>
              </div>
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-6">
                <p className="t-label mb-3">Método gravado</p>
                <p className="text-[13.5px] leading-[1.65] text-[#0F0E0C]">
                  Plataforma própria com vídeos por pilar, PDFs de guia, templates editáveis e tarefas práticas. Acesso 12 meses.
                </p>
              </div>
              <div className="border border-[#EAE6DC] bg-white rounded-lg p-6">
                <p className="t-label mb-3">Materiais entregues</p>
                <ul className="space-y-1 text-[13.5px] leading-[1.55] text-[#0F0E0C]">
                  <li>· 1 Aula Zero + Mapa Mental + Cronograma</li>
                  <li>· 5 PDFs guia (1 por pilar)</li>
                  <li>· 20+ templates editáveis</li>
                  <li>· Checklists de conclusão</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 06 · INVESTIMENTO */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-5xl">
            <p className="t-eyebrow mb-3">06</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-8">
              Investimento · 3 versões
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <article className="border-2 border-[#B8902A] bg-white rounded-xl p-7">
                <p className="t-label text-[#B8902A]">Turma Fundadora</p>
                <p className="font-display font-semibold text-[32px] text-[#0F0E0C] mt-3 mb-1 tracking-[-0.02em]">
                  R$ 28.000
                </p>
                <p className="text-[12px] text-[#6B6862] mb-5">à vista ou 12x R$ 2.500</p>
                <p className="text-[13px] text-[#0F0E0C] mb-3 font-medium">5 vagas únicas</p>
                <ul className="space-y-2 text-[13px] leading-[1.55] text-[#6B6862]">
                  <li>· Programa completo (12 meses)</li>
                  <li>· Acesso vitalício ao método</li>
                  <li>· 2 calls extras de conselheiro</li>
                  <li>· Reconhecimento como fundador</li>
                </ul>
              </article>

              <article className="border border-[#EAE6DC] bg-white rounded-xl p-7">
                <p className="t-label">Principal</p>
                <p className="font-display font-semibold text-[32px] text-[#0F0E0C] mt-3 mb-1 tracking-[-0.02em]">
                  R$ 36.000
                </p>
                <p className="text-[12px] text-[#6B6862] mb-5">à vista ou 12x R$ 3.000</p>
                <p className="text-[13px] text-[#0F0E0C] mb-3 font-medium">Turmas seguintes</p>
                <ul className="space-y-2 text-[13px] leading-[1.55] text-[#6B6862]">
                  <li>· Programa completo (12 meses)</li>
                  <li>· 17 calls 1:1 escalonadas</li>
                  <li>· Grupo dedicado WhatsApp</li>
                  <li>· Plataforma de membros</li>
                </ul>
              </article>

              <article className="border border-[#EAE6DC] bg-white rounded-xl p-7">
                <p className="t-label">Upsell · Premium</p>
                <p className="font-display font-semibold text-[32px] text-[#0F0E0C] mt-3 mb-1 tracking-[-0.02em]">
                  R$ 60.000
                </p>
                <p className="text-[12px] text-[#6B6862] mb-5">à vista ou 12x R$ 5.000</p>
                <p className="text-[13px] text-[#0F0E0C] mb-3 font-medium">3 vagas/ano</p>
                <ul className="space-y-2 text-[13px] leading-[1.55] text-[#6B6862]">
                  <li>· Tudo do Principal</li>
                  <li>· 4 visitas presenciais/ano</li>
                  <li>· WhatsApp prioridade 4h</li>
                  <li>· Acesso ao network do Matheus</li>
                </ul>
              </article>
            </div>

            <p className="text-[12px] text-[#A09C92] mt-6 font-serif italic">
              Pagamento via Cakto. Parcelamento em até 12x no cartão sem juros pra Matheus (juros do parcelamento no cliente).
            </p>
          </div>
        </section>

        {/* 07 · COMISSÃO DO PARCEIRO */}
        <section className="py-20 border-b border-[#EAE6DC] bg-[#F4F2EC]/40">
          <div className="container-x max-w-5xl">
            <p className="t-eyebrow mb-3">07</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Comissão do parceiro
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              Você recebe <strong className="text-[#0F0E0C]">10% do valor total</strong> de cada venda fechada que você trouxer.
            </p>

            {/* Tabela de comissão — grid responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <article className="bg-white border-2 border-[#B8902A] rounded-xl p-6">
                <p className="t-label text-[#B8902A]">Turma Fundadora</p>
                <p className="text-[13px] text-[#6B6862] mt-2 mb-4">
                  Venda de <span className="tabular-nums">R$ 28.000</span>
                </p>
                <p className="t-label mb-1">Você recebe</p>
                <p className="font-display font-semibold text-[34px] text-[#B8902A] tracking-[-0.025em] leading-none">
                  R$ 2.800
                </p>
              </article>

              <article className="bg-white border border-[#EAE6DC] rounded-xl p-6">
                <p className="t-label">Principal</p>
                <p className="text-[13px] text-[#6B6862] mt-2 mb-4">
                  Venda de <span className="tabular-nums">R$ 36.000</span>
                </p>
                <p className="t-label mb-1">Você recebe</p>
                <p className="font-display font-semibold text-[34px] text-[#0F0E0C] tracking-[-0.025em] leading-none">
                  R$ 3.600
                </p>
              </article>

              <article className="bg-white border border-[#EAE6DC] rounded-xl p-6">
                <p className="t-label">Upsell · Premium</p>
                <p className="text-[13px] text-[#6B6862] mt-2 mb-4">
                  Venda de <span className="tabular-nums">R$ 60.000</span>
                </p>
                <p className="t-label mb-1">Você recebe</p>
                <p className="font-display font-semibold text-[34px] text-[#0F0E0C] tracking-[-0.025em] leading-none">
                  R$ 6.000
                </p>
              </article>
            </div>

            {/* Regras */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6">
                <p className="t-label mb-3">Como funciona</p>
                <ul className="space-y-2.5 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                  <li>· Você indica o lead pelo seu link/contato</li>
                  <li>· Lead aplica pelo formulário oficial</li>
                  <li>· Matheus conduz diagnóstico e fechamento</li>
                  <li>· Cliente quita pagamento (à vista ou 1ª parcela)</li>
                  <li>· Comissão paga via Pix em até 7 dias úteis</li>
                </ul>
              </div>
              <div className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-6">
                <p className="t-label mb-3">Regras importantes</p>
                <ul className="space-y-2.5 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                  <li>· Lead vinculado a você no momento da aplicação</li>
                  <li>· Pagamento parcelado: comissão integral após 1ª parcela compensar</li>
                  <li>· Se cliente acionar garantia (60 dias): comissão estornada</li>
                  <li>· Sem teto de vendas. Quanto mais fechar, mais ganha.</li>
                  <li>· Detalhes contratuais: confirma com Matheus antes de começar</li>
                </ul>
              </div>
            </div>

            <p className="text-[12px] text-[#A09C92] mt-6 font-serif italic">
              Estrutura padrão. Condições especiais (volume, exclusividade regional, etc) tratáveis 1:1 com Matheus.
            </p>
          </div>
        </section>

        {/* 08 · GARANTIA */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">08</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-6">
              Garantia de Performance Calibrada
            </h2>
            <div className="border-l-2 border-[#B8902A] pl-6 mb-6">
              <p className="font-serif italic text-[16px] leading-[1.55] text-[#0F0E0C]">
                Se o cliente cumprir o Protocolo dos Primeiros 60 Dias — completar as 4 calls de imersão, executar as 4 tarefas-chave e implementar o plano de ação acordado — e não houver migração mensurável do operacional tático para o estratégico, devolvemos 100% do valor pago.
              </p>
            </div>
            <p className="text-[14px] text-[#6B6862] leading-[1.6] mb-3">
              <strong className="text-[#0F0E0C]">Critérios mensuráveis:</strong>
            </p>
            <ul className="space-y-2 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
              <li>· Redução de 30%+ no tempo do dono em operacional tático</li>
              <li>· 3+ decisões operacionais delegadas integralmente à equipe</li>
              <li>· Agenda do dono com tempo recorrente em operacional estratégico</li>
            </ul>
            <p className="text-[12px] text-[#A09C92] font-serif italic mt-5">
              Garantia condicional protege Matheus de clientes que assinam e não fazem nada. Protege o cliente de Matheus se ele não entregar.
            </p>
          </div>
        </section>

        {/* 09 · CASES REAIS */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">09</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Cases reais
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              Por respeito aos clientes, cases com nome, marca e números mensuráveis são divulgados <strong className="text-[#0F0E0C]">apenas após autorização escrita do dono</strong>. Para acessar os cases atualizados que podem ser usados em conversa comercial, solicite direto ao Matheus.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <article className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-7">
                <p className="t-label mb-3">Perfil dos clientes atendidos</p>
                <ul className="space-y-2 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                  <li>· Donos de PME com 10–30 funcionários</li>
                  <li>· Faturamento R$200k–R$500k/mês</li>
                  <li>· Setores: varejo, moda, serviços, indústria leve, consultoria</li>
                  <li>· Empresas com 5+ anos de operação</li>
                </ul>
              </article>
              <article className="bg-white border border-[#B8902A]/50 rounded-xl p-5 sm:p-7">
                <p className="t-label text-[#B8902A] mb-3">Resultados típicos em 120 dias</p>
                <ul className="space-y-2 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                  <li>· Redução de 30–50% das horas semanais do dono</li>
                  <li>· Equipe ganha autonomia real de decisão</li>
                  <li>· Empresa para de depender da memória do dono</li>
                  <li>· Faturamento volta a crescer (média dos clientes)</li>
                </ul>
              </article>
            </div>

            <div className="bg-[#F4F2EC]/60 border border-[#EAE6DC] rounded-xl p-5 sm:p-7">
              <p className="t-label mb-3">Como pedir cases para usar em conversa</p>
              <p className="text-[14px] leading-[1.65] text-[#0F0E0C] mb-5">
                Cases reais (com nome, empresa, números e autorização) ficam disponíveis sob demanda. Antes da próxima call com lead que pediu &quot;tem prova social?&quot;, fala com Matheus que ele te passa o case mais alinhado ao setor do lead.
              </p>
              <a
                href="https://wa.me/5551991443171"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] text-[#B8902A] hover:opacity-70 transition-opacity font-medium"
              >
                Pedir case real ao Matheus →
              </a>
            </div>
          </div>
        </section>

        {/* 10 · COMO QUALIFICAR */}
        <section className="py-20 border-b border-[#EAE6DC] bg-[#F4F2EC]/40">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">10</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Como qualificar antes de marcar call
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              5 perguntas no WhatsApp que separam o que é ICP do que não é. Faz em 5 minutos.
            </p>

            <ol className="space-y-6">
              {[
                { q: "Quantos funcionários sua empresa tem hoje?", a: "Qualifica se: 10-30. Próximo." },
                { q: "Qual seu faturamento médio mensal?", a: "Qualifica se: R$200k-R$500k." },
                { q: "Se você sumisse 30 dias, sua empresa continuaria rodando?", a: "Qualifica se: \"Pararia\" ou \"Parcialmente\"." },
                { q: "Quanto do seu tempo está em operacional tático hoje?", a: "Qualifica se: 50%+. Idealmente 75-100%." },
                { q: "Está pronto pra investir entre R$28k e R$36k pra resolver isso?", a: "Qualifica se: \"Sim, estou pronto\"." },
              ].map((item, i) => (
                <li key={i} className="border-t border-[#EAE6DC] pt-5">
                  <div className="grid grid-cols-[32px_1fr] md:grid-cols-[40px_1fr] gap-3 md:gap-4">
                    <p className="font-serif italic text-[#B8902A] text-[20px] leading-none">{String(i + 1).padStart(2, "0")}</p>
                    <div>
                      <p className="text-[15px] font-medium text-[#0F0E0C] mb-2">{item.q}</p>
                      <p className="text-[13px] text-[#6B6862] italic">{item.a}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 p-5 bg-[#F4F2EC] border-l-2 border-[#B8902A] rounded-r-lg">
              <p className="t-label mb-2">Critério</p>
              <p className="text-[14px] text-[#0F0E0C] leading-[1.6]">
                <strong>4 ou 5 perguntas qualificadas → manda link de aplicação + agenda call.</strong>
                <br />
                3 ou menos → não é ICP. Não perde tempo.
              </p>
            </div>
          </div>
        </section>

        {/* 11 · PITCH SUGERIDO */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">11</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Pitch sugerido (30 segundos)
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-8 max-w-2xl">
              Adapta com suas palavras. Mas não foge da estrutura: ICP + problema + promessa + diferencial.
            </p>

            <div className="border-l-2 border-[#B8902A] pl-6 bg-white border border-[#EAE6DC] rounded-r-lg p-6">
              <p className="text-[15px] leading-[1.7] text-[#0F0E0C] font-serif italic">
                &quot;O Matheus trabalha com donos de PME entre 10 e 30 funcionários que viraram reféns do operacional. Sabe quando você decide tudo, aprova tudo, e a empresa não cresce mesmo trabalhando mais? Em 120 dias o programa migra você do tático pro estratégico. Equipe assume execução, você volta a olhar números e direção. Mentoria 1:1 de 12 meses, R$28k a R$36k. O ticket existe porque é high-touch — Matheus atende no máximo 10 clientes simultâneos. Faz sentido a gente conversar 30 minutos pra eu entender se você é o perfil?&quot;
              </p>
            </div>

            <p className="text-[13px] text-[#6B6862] italic mt-5">
              Termina com pergunta aberta. Não fecha venda no pitch. O fechamento é com Matheus na call de diagnóstico.
            </p>
          </div>
        </section>

        {/* 12 · OBJEÇÕES */}
        <section className="py-20 border-b border-[#EAE6DC] bg-[#F4F2EC]/40">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">12</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Objeções comuns e respostas
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              7 objeções que aparecem em 80% das conversas. Decorou essas → fechou.
            </p>

            <div className="space-y-5">
              {[
                {
                  o: "\"R$28k a R$36k é muito caro.\"",
                  r: "Sai R$2.500-3.000/mês em 12 parcelas. Cliente já gasta isso em decisão errada por mês porque não consegue sair do operacional. O programa paga ele mesmo na primeira virada estrutural."
                },
                {
                  o: "\"Não tenho tempo pra mais isso na agenda.\"",
                  r: "Exatamente isso que o programa resolve. Se ele tem agenda lotada e não consegue parar, é o sintoma. 17 calls em 12 meses, escalonadas. Mês 1 é semanal (1h cada). Depois fica mais leve. Recupera muito mais tempo do que investe."
                },
                {
                  o: "\"Já fiz consultoria e não funcionou.\"",
                  r: "Consultoria genérica trabalha empresa→empresa. Não funciona porque ignora o gargalo real. O Matheus trabalha dono→empresa. Princípio do Espelho: a empresa é o reflexo do dono. Calibra o dono primeiro, aí a estrutura segue."
                },
                {
                  o: "\"Quero pensar / conversar com minha esposa / sócio.\"",
                  r: "Faz sentido. Mas marca a call de diagnóstico com o Matheus já — é gratuita, 30 minutos, sem compromisso. Aí depois da call você tem material concreto pra apresentar pra esposa/sócio. Pensar antes da call é pensar no escuro."
                },
                {
                  o: "\"Em quanto tempo vejo resultado?\"",
                  r: "Em 4 semanas você já opera diferente — e a equipe sente. A virada estrutural vem em 120 dias. Por isso a garantia condicional: se nesses 60 dias não houver migração mensurável tático→estratégico, devolve 100%."
                },
                {
                  o: "\"Não confio em programa caro de internet.\"",
                  r: "Justo. Por isso o programa não vende em landing. Vende em conversa direta com o Matheus. A call de diagnóstico é o teste — você sente em 30 minutos se faz sentido. Sem fechar nada."
                },
                {
                  o: "\"Meu negócio é diferente / muito específico.\"",
                  r: "O método não é setor-específico. É comportamento-específico. O problema do dono que decide tudo é igual em moda, em indústria, em serviços. O Princípio do Espelho funciona porque o gargalo é o mesmo: você."
                },
              ].map((item, i) => (
                <div key={i} className="border-t border-[#EAE6DC] pt-5">
                  <p className="font-serif italic text-[#C24842] text-[15px] mb-3">
                    {item.o}
                  </p>
                  <p className="text-[14px] leading-[1.65] text-[#0F0E0C] pl-6 border-l border-[#B8902A]">
                    {item.r}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13 · COMO APLICAR */}
        <section className="py-20 border-b border-[#EAE6DC]">
          <div className="container-x max-w-4xl">
            <p className="t-eyebrow mb-3">13</p>
            <h2 className="font-display font-semibold text-[28px] tracking-[-0.022em] text-[#0F0E0C] mb-3">
              Como o lead aplica
            </h2>
            <p className="text-[15px] text-[#6B6862] mb-10 max-w-2xl">
              Fluxo completo do lead até o fechamento. Você só precisa entregar lead qualificado nas etapas 1-2.
            </p>

            <ol className="space-y-6">
              {[
                { n: "01", t: "Vendedor qualifica no WhatsApp", d: "Usa as 5 perguntas da seção 09. Se qualifica (4+), manda link do formulário." },
                { n: "02", t: "Lead preenche formulário", d: "12-15 perguntas em 4 etapas. 5 minutos. Em empresa-sem-voce.mtxestrategia.com.br/aplicar" },
                { n: "03", t: "Matheus analisa", d: "IA roda análise automática (fit score). Matheus revisa e responde em 1 dia útil." },
                { n: "04", t: "Call de diagnóstico (30min)", d: "Gratuita. Matheus aprofunda dor e mostra como funcionaria. Sem pitch de venda." },
                { n: "05", t: "Call de vendas (60min)", d: "Se diagnóstico fizer sentido pros dois. Apresenta programa + investimento + garantia." },
                { n: "06", t: "Fechamento via Cakto", d: "Link de pagamento + termo de adesão. Onboarding no mesmo dia." },
              ].map((step) => (
                <li key={step.n} className="border-t border-[#EAE6DC] pt-5">
                  <div className="grid md:grid-cols-[60px_1fr] gap-4">
                    <p className="font-serif italic text-[#B8902A] text-[22px] leading-none">{step.n}</p>
                    <div>
                      <p className="text-[15px] font-medium text-[#0F0E0C] mb-1">{step.t}</p>
                      <p className="text-[13.5px] leading-[1.6] text-[#6B6862]">{step.d}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 bg-[#0F0E0C] text-white">
          <div className="container-x max-w-4xl text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#B8902A] font-medium">Pronto pra começar</p>
            <h2 className="font-display font-semibold text-[clamp(1.875rem,1.5rem+1.6vw,2.625rem)] tracking-[-0.024em] mt-6 mb-8 leading-[1.1]">
              Qualifica. Aplica. Apresenta o Matheus.
            </h2>
            <p className="text-[16px] text-[#A1A1A6] mb-10 max-w-2xl mx-auto">
              Em caso de dúvida, fala direto com o Matheus. Ele responde em 1 dia útil.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/5551991443171"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill bg-[#B8902A] text-[#0F0E0C] px-6 py-3 text-[14px] font-medium hover:bg-[#A37F22] inline-flex items-center gap-2"
              >
                WhatsApp do Matheus →
              </a>
              <Link
                href="/aplicar"
                className="btn-pill border border-[#A1A1A6] text-white px-6 py-3 text-[14px] font-medium hover:border-white inline-flex items-center gap-2"
              >
                Ver formulário →
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-10 bg-[#0F0E0C] text-[#6E6E73] border-t border-[#1F1D1B]">
          <div className="container-x flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
            <p>Material confidencial · Uso interno</p>
            <p>© {new Date().getFullYear()} Matheus Martins · MTX Estratégia</p>
          </div>
        </footer>
      </main>
    </>
  );
}
