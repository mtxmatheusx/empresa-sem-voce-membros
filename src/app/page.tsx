import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/ui/nav";
import { Reveal } from "@/components/ui/reveal";

export default function HomePage() {
  return (
    <>
      <Nav />

      <main className="relative">
        {/* ============================================================
            HERO — grid 12 col com manifesto lateral
            ============================================================ */}
        <section className="relative pt-28 md:pt-36 pb-20 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(184,144,42,0.04),transparent_70%)]" />
          </div>

          <div className="container-x relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-end">
              {/* Coluna principal */}
              <div className="lg:col-span-8">
                <p className="t-eyebrow anim-fade-up">
                  Programa Empresa Sem Você
                </p>

                <h1 className="font-display font-semibold text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] leading-[1.05] tracking-[-0.025em] text-[#0F0E0C] mt-5 anim-fade-up delay-100">
                  Antes de consertar a empresa,
                  <span className="t-accent"> calibramos o dono.</span>
                </h1>

                <p className="text-[16px] md:text-[17px] leading-[1.55] text-[#6B6862] mt-6 max-w-xl anim-fade-up delay-300">
                  Em <span className="text-[#0F0E0C] font-medium">120 dias</span>, donos de PME com 10 a 30 funcionários migram do operacional tático ao estratégico.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 anim-fade-up delay-400">
                  <Link href="/aplicar">
                    <Button variant="dark" size="md">Aplicar para uma vaga</Button>
                  </Link>
                  <Link
                    href="#metodo"
                    className="text-[14px] text-[#6B6862] hover:text-[#0F0E0C] transition-colors px-2 py-2"
                  >
                    Como funciona →
                  </Link>
                </div>
              </div>

              {/* Manifesto lateral */}
              <aside className="lg:col-span-4 lg:pl-10 lg:border-l border-[#EAE6DC] mt-12 lg:mt-0 anim-fade-up delay-500">
                <p className="t-eyebrow">Princípio do Espelho</p>
                <p className="font-serif italic text-[20px] md:text-[22px] leading-[1.35] text-[#0F0E0C] mt-5">
                  A empresa é o reflexo do dono.
                </p>
                <p className="text-[14px] leading-[1.65] text-[#6B6862] mt-5">
                  Não escalamos caos. Calibramos o gestor primeiro — a estrutura segue.
                </p>
                <hr className="hairline-accent mt-8 mb-6" />
                <p className="t-label">7 anos provando · 1 só método</p>
              </aside>
            </div>
          </div>
        </section>

        {/* ============================================================
            3 PILARES — denso
            ============================================================ */}
        <section id="metodo" className="py-16 md:py-20 border-t border-[#EAE6DC]">
          <div className="container-x">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div className="max-w-2xl">
                  <p className="t-eyebrow mb-3">Como funciona</p>
                  <h2 className="font-display font-semibold text-[clamp(1.625rem,1.4rem+1vw,2.125rem)] leading-[1.15] tracking-[-0.022em] text-[#0F0E0C]">
                    Mentoria <span className="t-accent">1:1</span> em três movimentos sucessivos.
                  </h2>
                </div>
                <p className="t-label md:text-right">
                  12 meses · 17 calls
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  number: "01",
                  eyebrow: "Quem aplica",
                  title: "Donos no operacional tático",
                  body: "Empresas entre R$200k e R$500k/mês, com 10 a 30 funcionários. Decide tudo, aprova tudo, apaga incêndio o dia inteiro.",
                  delay: 0,
                },
                {
                  number: "02",
                  eyebrow: "O que muda",
                  title: "Empresa que anda sozinha",
                  body: "Equipe assume execução com autonomia. Decisões rodam sem você. Você passa a olhar números, não tarefa.",
                  delay: 100,
                },
                {
                  number: "03",
                  eyebrow: "Como funciona",
                  title: "12 meses 1:1 com Matheus",
                  body: "17 calls escalonadas comigo. Grupo dedicado com gestor de experiência. Garantia condicional de 60 dias.",
                  delay: 200,
                },
              ].map((block) => (
                <Reveal key={block.number} delay={block.delay}>
                  <article className="card-elevated p-7 h-full flex flex-col">
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-serif italic text-[#B8902A] text-[20px] leading-none">
                        {block.number}
                      </span>
                      <span className="t-label">{block.eyebrow}</span>
                    </div>
                    <h3 className="font-display font-semibold text-[18px] leading-[1.25] tracking-[-0.015em] text-[#0F0E0C] mb-3">
                      {block.title}
                    </h3>
                    <p className="text-[13.5px] leading-[1.6] text-[#6B6862]">
                      {block.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            5 PILARES — com tese + escopo
            ============================================================ */}
        <section className="py-16 md:py-20 border-t border-[#EAE6DC]">
          <div className="container-x">
            <Reveal>
              <div className="max-w-3xl mb-12">
                <p className="t-eyebrow mb-3">5 Pilares</p>
                <h2 className="font-display font-semibold text-[clamp(1.625rem,1.4rem+1vw,2.125rem)] leading-[1.15] tracking-[-0.022em] text-[#0F0E0C]">
                  Não é coaching. É arquitetura
                  <br />
                  <span className="t-accent">comportamental + operacional.</span>
                </h2>
                <p className="text-[15px] leading-[1.6] text-[#6B6862] mt-5 max-w-2xl">
                  Cinco frentes que destravam o que está te segurando. Começamos no espelho. Terminamos com a empresa funcionando sem você.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
              {[
                {
                  n: "01",
                  title: "Calibração do Gestor",
                  thesis: "Sua empresa não tá travada. Você tá travado nela.",
                  body: "Você sai do modo bombeiro. Sua agenda volta a ser sua. Decide menos no operacional e melhor no estratégico. Em 4 semanas, você já opera diferente — e a equipe sente.",
                },
                {
                  n: "02",
                  title: "Hierarquia & Liderança",
                  thesis: "Equipe que não pode decidir nunca cresce com você.",
                  body: "Sua equipe assume o que sempre passou pela sua mesa. As decisões rodam sem WhatsApp explodindo. Você para de ser o gargalo do próprio crescimento e ganha de volta horas que achava que não tinha.",
                },
                {
                  n: "03",
                  title: "Processos & Cultura",
                  thesis: "Tudo que mora só na sua cabeça morre quando você sai.",
                  body: "A empresa para de depender da sua memória. Você tira férias e nada para. Sai de reunião com cliente importante e volta sem ter perdido nada. Sua operação ganha autonomia real, não imaginada.",
                },
                {
                  n: "04",
                  title: "Eficiência com IA",
                  thesis: "A maioria dos donos contrata gente quando deveria automatizar tarefas.",
                  body: "Você cresce sem inflar folha. O custo operacional cai enquanto a capacidade dobra. O atendimento responde mais rápido do que você responderia. Os números chegam prontos para decisão, não em planilhas para analisar.",
                },
                {
                  n: "05",
                  title: "Marketing & Vendas",
                  thesis: "Vender mais sem virar gerente comercial.",
                  body: "Faturamento cresce porque agora existe método, não porque você está em todas as reuniões. Aquisição vira previsível. O time comercial entrega sem você no meio. Você volta pra cadeira de dono — e a empresa escala.",
                },
              ].map((pillar, i) => (
                <Reveal key={pillar.n} delay={i * 60}>
                  <article className="border-t border-[#EAE6DC] pt-5">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="font-serif italic text-[#B8902A] text-[18px] leading-none">
                        {pillar.n}
                      </span>
                      <h3 className="font-display font-semibold text-[17px] leading-[1.25] tracking-[-0.015em] text-[#0F0E0C]">
                        {pillar.title}
                      </h3>
                    </div>
                    <div className="pl-[34px]">
                      <p className="font-serif italic text-[15px] leading-[1.45] text-[#B8902A] mb-3">
                        {pillar.thesis}
                      </p>
                      <p className="text-[13.5px] leading-[1.65] text-[#6B6862]">
                        {pillar.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            CTA FINAL — denso, sem espaço gratuito
            ============================================================ */}
        <section className="py-20 md:py-24 border-t border-[#EAE6DC] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(184,144,42,0.05),transparent_70%)]" />
          </div>

          <div className="container-x relative z-10">
            <Reveal>
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <h2 className="font-display font-semibold text-[clamp(1.875rem,1.5rem+1.6vw,2.625rem)] leading-[1.1] tracking-[-0.024em] text-[#0F0E0C]">
                    Sua empresa não está travada.<br />
                    <span className="t-accent">Você está travado nela.</span>
                  </h2>
                </div>

                <div className="lg:col-span-5 lg:pl-8 lg:border-l border-[#EAE6DC]">
                  <p className="text-[15px] leading-[1.55] text-[#6B6862] mb-6">
                    Vagas limitadas. Aplicação em 4 etapas. Resposta em 1 dia útil.
                  </p>
                  <Link href="/aplicar">
                    <Button variant="dark" size="md">
                      Aplicar para uma vaga
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================
            FOOTER
            ============================================================ */}
        <footer className="py-8 border-t border-[#EAE6DC]">
          <div className="container-x flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="t-label">
              © {new Date().getFullYear()} Matheus Martins · MTX Estratégia
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/matheusmartins.x"
                target="_blank"
                rel="noopener noreferrer"
                className="t-label hover:text-[#B8902A] transition-colors"
              >
                Instagram
              </a>
              <Link href="/aplicar" className="t-label hover:text-[#B8902A] transition-colors">
                Aplicar
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
