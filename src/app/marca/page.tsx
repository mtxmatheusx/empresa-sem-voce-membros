import Link from "next/link";
import { Nav } from "@/components/ui/nav";

export const metadata = {
  title: "Identidade Visual · Programa Empresa Sem Você",
  description: "Identidade visual oficial do Programa Empresa Sem Você — paleta, tipografia, voz, aplicações.",
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "Background", hex: "#FAFAF7", desc: "Fundo principal · papel warm", light: true },
  { name: "Surface", hex: "#FFFFFF", desc: "Cards · superfícies elevadas", light: true },
  { name: "Subtle", hex: "#F4F2EC", desc: "Bg de quotes e callouts", light: true },
  { name: "Text", hex: "#0F0E0C", desc: "Texto principal · warm-black", light: false },
  { name: "Muted", hex: "#6B6862", desc: "Subtítulos · descrições", light: false },
  { name: "Faint", hex: "#A09C92", desc: "Metadata · footers", light: false },
  { name: "Accent", hex: "#B8902A", desc: "Tese · destaque · monograma", light: false },
  { name: "Border", hex: "#EAE6DC", desc: "Linhas · separadores", light: true },
];

const FONT_SAMPLES = [
  {
    family: "Inter Tight",
    role: "Display & Headlines",
    use: "Títulos principais. Hierarquia visual. Peso 600-700. Tracking negativo.",
    weights: "600 · 700",
  },
  {
    family: "Inter",
    role: "Body & UI",
    use: "Texto corrido, labels, navegação. Peso 400-500. Line-height generoso (1.55-1.65).",
    weights: "400 · 500 · 600",
  },
  {
    family: "Fraunces",
    role: "Editorial & Italic",
    use: "Teses, pull quotes, citações. Sempre italic. Cor accent dourado.",
    weights: "400 italic",
  },
];

const VOICE_DO = [
  "Você sai do operacional tático",
  "Empresa que não depende da sua execução",
  "Calibração antes de estrutura",
  "Decisões delegadas com autonomia",
  "Migração tático → estratégico",
  "Apple business consultivo",
];

const VOICE_DONT = [
  "Sair do operacional (sem qualificar)",
  "Empresa funcionando sem você (vago)",
  "Liberdade total (fantasioso)",
  "Sem precisar trabalhar (engana)",
  "Você consegue! Acredite! (coach)",
  "Vamos juntos rumo ao sucesso (guru)",
];

const PRINCIPIOS = [
  {
    title: "Apple business · não Apple marketing",
    body: "Tipografia média, não gigante. Hierarquia clara. Letterspacing negativo discreto (-0.025em). Premium consultivo, não display promocional.",
  },
  {
    title: "Editorial sobre tecnológico",
    body: "Inspirações: Aesop, Monocle, Stripe. Não: SaaS dashboard, curso online, agência colorida. Italic Fraunces como assinatura.",
  },
  {
    title: "Respiro estratégico",
    body: "White space é hierarquia. Padding generoso (mín 64px vertical desktop, 48px mobile). Sections separadas por border-top + py-20.",
  },
  {
    title: "Acento dourado como sinal",
    body: "Dourado #B8902A só em: tese (italic), eyebrow, monograma M, CTA primário. Sem dourado em decoração. Cada uso carrega significado.",
  },
];

export default function MarcaPage() {
  return (
    <>
      <Nav showCta={false} />

      <main className="relative">
        {/* HERO */}
        <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl">
              <p className="t-eyebrow">Identidade Visual · v1.0</p>

              <h1 className="font-display font-semibold text-[clamp(2rem,1.4rem+2.5vw,3.5rem)] leading-[1.05] tracking-[-0.025em] text-[#0F0E0C] mt-5 sm:mt-6">
                A identidade do
                <br className="hidden sm:inline" />{" "}
                <span className="t-accent">Programa Empresa Sem Você.</span>
              </h1>

              <p className="text-[15px] sm:text-[17px] leading-[1.55] text-[#6B6862] mt-5 sm:mt-6 max-w-2xl">
                Sistema visual completo: paleta, tipografia, voz, princípios e aplicações. Referência oficial pra produzir qualquer peça da marca — site, PDFs, posts, slides, materiais.
              </p>

              {/* Quick anchors */}
              <nav aria-label="Sumário" className="mt-8 sm:mt-10 flex flex-wrap gap-2">
                {[
                  ["#essencia", "Essência"],
                  ["#paleta", "Paleta"],
                  ["#tipografia", "Tipografia"],
                  ["#monograma", "Monograma"],
                  ["#voz", "Voz"],
                  ["#principios", "Princípios"],
                  ["#glossario", "Glossário"],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    className="px-3 py-1.5 text-[12px] font-medium bg-[#F4F2EC] hover:bg-[#EAE6DC] text-[#6B6862] hover:text-[#0F0E0C] rounded-full transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* ESSÊNCIA */}
        <section id="essencia" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl">
              <p className="t-eyebrow mb-3">01 · Essência</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] mb-8 leading-[1.15]">
                Princípio do Espelho.
              </h2>

              <p className="font-serif italic text-[clamp(1.125rem,1rem+0.7vw,1.5rem)] leading-[1.4] text-[#0F0E0C] border-l-2 border-[#B8902A] pl-5 sm:pl-6 mb-8">
                A empresa é o reflexo do dono.
                <br />
                Antes de consertar a empresa, calibramos o gestor.
              </p>

              <div className="grid sm:grid-cols-2 gap-5 mt-10">
                <div className="border border-[#EAE6DC] bg-white rounded-lg p-5 sm:p-6">
                  <p className="t-label mb-2">Posicionamento</p>
                  <p className="text-[14px] leading-[1.6] text-[#0F0E0C]">
                    Estrategista comportamental para donos de PME. Não coach. Não guru. Não consultoria tradicional.
                  </p>
                </div>
                <div className="border border-[#EAE6DC] bg-white rounded-lg p-5 sm:p-6">
                  <p className="t-label mb-2">Diferencial</p>
                  <p className="text-[14px] leading-[1.6] text-[#0F0E0C]">
                    Trabalha dono → empresa, não empresa → empresa. Calibração comportamental antes de estrutura operacional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PALETA */}
        <section id="paleta" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">02 · Paleta</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                3 tons + 5 neutros warm.
              </h2>
              <p className="text-[15px] text-[#6B6862] mt-4 max-w-2xl">
                Off-white papel, dourado de assinatura, warm-black. Sem azul, verde, vermelho exceto em estados de sistema (sucesso/erro).
              </p>
            </div>

            {/* Cards de cor — grid responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {PALETTE.map((c) => (
                <article
                  key={c.hex}
                  className="border border-[#EAE6DC] rounded-xl overflow-hidden bg-white"
                >
                  {/* Swatch */}
                  <div
                    className="h-24 sm:h-32 w-full"
                    style={{
                      backgroundColor: c.hex,
                      borderBottom: c.light ? "1px solid #EAE6DC" : "none",
                    }}
                  />
                  {/* Info */}
                  <div className="p-4 sm:p-5">
                    <p className="t-label">{c.name}</p>
                    <p className="font-display font-semibold text-[16px] sm:text-[17px] text-[#0F0E0C] mt-1 tabular-nums">
                      {c.hex}
                    </p>
                    <p className="text-[12px] sm:text-[12.5px] leading-[1.5] text-[#6B6862] mt-2">
                      {c.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TIPOGRAFIA */}
        <section id="tipografia" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">03 · Tipografia</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                3 famílias com papéis claros.
              </h2>
            </div>

            <div className="space-y-6">
              {FONT_SAMPLES.map((f) => (
                <article
                  key={f.family}
                  className="border border-[#EAE6DC] bg-white rounded-xl p-5 sm:p-8"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                    <p className="t-label">{f.role}</p>
                    <p className="t-label text-[#A09C92]">{f.weights}</p>
                  </div>

                  {/* Sample típico — usa font da família */}
                  {f.family === "Inter Tight" && (
                    <p
                      className="font-display font-semibold text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.05] tracking-[-0.025em] text-[#0F0E0C] mb-3"
                    >
                      Antes de consertar a empresa.
                    </p>
                  )}
                  {f.family === "Inter" && (
                    <p
                      className="text-[16px] sm:text-[17px] leading-[1.6] text-[#0F0E0C] mb-3"
                    >
                      Em 120 dias, donos de PME com 10 a 30 funcionários migram do operacional tático ao estratégico. A empresa funciona sem você na execução.
                    </p>
                  )}
                  {f.family === "Fraunces" && (
                    <p className="font-serif italic text-[clamp(1.25rem,1.1rem+0.8vw,1.625rem)] leading-[1.4] text-[#B8902A] mb-3">
                      A empresa é o reflexo do dono.
                    </p>
                  )}

                  <p className="font-display font-semibold text-[15px] text-[#0F0E0C] mb-2 mt-5">
                    {f.family}
                  </p>
                  <p className="text-[13px] sm:text-[13.5px] leading-[1.65] text-[#6B6862]">
                    {f.use}
                  </p>
                </article>
              ))}
            </div>

            {/* Escala tipográfica */}
            <div className="mt-10 sm:mt-12 border border-[#EAE6DC] bg-[#F4F2EC]/50 rounded-xl p-5 sm:p-8">
              <p className="t-label mb-5">Escala tipográfica · pt</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 text-[13px]">
                {[
                  ["Hero", "80"],
                  ["Display", "56"],
                  ["H1", "36"],
                  ["H2", "24"],
                  ["H3", "18"],
                  ["H4", "14"],
                  ["Body", "10.5"],
                  ["Caption", "9.5"],
                  ["Label", "9"],
                  ["Eyebrow", "8"],
                ].map(([name, size]) => (
                  <div key={name} className="flex items-baseline justify-between border-b border-[#EAE6DC] pb-2">
                    <span className="text-[#0F0E0C]">{name}</span>
                    <span className="text-[#B8902A] tabular-nums font-medium">{size}pt</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MONOGRAMA / SÍMBOLO */}
        <section id="monograma" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">04 · Monograma</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                M dourado italic. Único símbolo.
              </h2>
              <p className="text-[15px] text-[#6B6862] mt-4 max-w-2xl">
                Fraunces italic 900. Cor accent dourado. Letterspacing negativo. Usado em headers, capas, footer de PDFs. Nunca alterado proporções.
              </p>
            </div>

            {/* Variações de tamanho */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { size: "sm", display: "32px", caption: "Sidebar · Header" },
                { size: "md", display: "56px", caption: "Capa de PDF · Hero" },
                { size: "lg", display: "120px", caption: "Página inteira · destaque" },
              ].map((v) => (
                <article
                  key={v.size}
                  className="border border-[#EAE6DC] bg-white rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[240px]"
                >
                  <span
                    className="logo-m"
                    style={{ fontSize: v.display, lineHeight: 0.85 }}
                  >
                    M
                  </span>
                  <p className="t-label mt-5">{v.caption}</p>
                  <p className="text-[11px] text-[#A09C92] mt-1 tabular-nums">{v.display}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VOZ */}
        <section id="voz" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC] bg-[#F4F2EC]/40">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">05 · Voz da marca</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                Direta. Consultiva. Sem floreio.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              {/* USAR */}
              <article className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#2D7A4E]" />
                  <p className="t-label">Usar</p>
                </div>
                <ul className="space-y-3">
                  {VOICE_DO.map((item) => (
                    <li key={item} className="flex gap-3 text-[14px] leading-[1.55] text-[#0F0E0C]">
                      <span className="text-[#2D7A4E] flex-shrink-0">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* EVITAR */}
              <article className="bg-white border border-[#EAE6DC] rounded-xl p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#C24842]" />
                  <p className="t-label">Evitar</p>
                </div>
                <ul className="space-y-3">
                  {VOICE_DONT.map((item) => (
                    <li key={item} className="flex gap-3 text-[14px] leading-[1.55] text-[#0F0E0C]">
                      <span className="text-[#C24842] flex-shrink-0">−</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            {/* Tom */}
            <div className="mt-8 sm:mt-10 max-w-3xl border-l-2 border-[#B8902A] pl-5 sm:pl-6">
              <p className="t-label mb-2">Tom em 1 frase</p>
              <p className="font-serif italic text-[16px] sm:text-[18px] leading-[1.5] text-[#0F0E0C]">
                Estrategista sênior que respeita o tempo do interlocutor. Direto sem ser frio. Provocativo sem ser arrogante.
              </p>
            </div>
          </div>
        </section>

        {/* PRINCÍPIOS */}
        <section id="principios" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">06 · Princípios visuais</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                4 regras invioláveis.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              {PRINCIPIOS.map((p, i) => (
                <article
                  key={p.title}
                  className="border border-[#EAE6DC] bg-white rounded-xl p-5 sm:p-7"
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-serif italic text-[#B8902A] text-[20px] leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display font-semibold text-[16px] sm:text-[17px] leading-[1.25] text-[#0F0E0C]">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-[13.5px] leading-[1.65] text-[#6B6862] pl-9">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* GLOSSÁRIO TÁTICO vs ESTRATÉGICO */}
        <section id="glossario" className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">07 · Glossário</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                Operacional tático vs estratégico.
              </h2>
              <p className="text-[15px] text-[#6B6862] mt-4 max-w-2xl">
                O dono não para de operar — muda o tipo de operação. Toda comunicação precisa preservar essa distinção.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
              <article className="bg-[#F4F2EC]/60 border border-[#EAE6DC] rounded-xl p-5 sm:p-7">
                <p className="t-label mb-5 text-[#C24842]">Operacional tático</p>
                <ul className="space-y-3 text-[14px] leading-[1.6] text-[#0F0E0C]">
                  <li>Apagar incêndio</li>
                  <li>Microgerenciar tarefa</li>
                  <li>Aprovar cada decisão</li>
                  <li>Resolver urgência alheia</li>
                  <li>Bombeiro · executor</li>
                  <li>Sugado por urgência</li>
                  <li>Reage</li>
                </ul>
              </article>

              <article className="bg-white border border-[#B8902A]/40 rounded-xl p-5 sm:p-7">
                <p className="t-label mb-5 text-[#B8902A]">Operacional estratégico</p>
                <ul className="space-y-3 text-[14px] leading-[1.6] text-[#0F0E0C]">
                  <li>Antecipar movimento</li>
                  <li>Liderar processo</li>
                  <li>Calibrar sistema de decisão</li>
                  <li>Olhar números e direção</li>
                  <li>Capitão · estrategista</li>
                  <li>Dono da agenda</li>
                  <li>Planeja</li>
                </ul>
              </article>
            </div>

            {/* Frases banidas */}
            <div className="mt-8 sm:mt-10 max-w-3xl border-l-2 border-[#C24842] pl-5 sm:pl-6 bg-[#C24842]/5 py-4 pr-4 rounded-r-lg">
              <p className="t-label text-[#C24842] mb-3">Frases banidas</p>
              <ul className="space-y-2 text-[13.5px] leading-[1.6] text-[#0F0E0C]">
                <li>&quot;Sair do operacional&quot; (sem qualificar) — parece largar a empresa</li>
                <li>&quot;Empresa funcionando sem você&quot; (sem contexto) — parece abandono</li>
                <li>&quot;Sem precisar trabalhar&quot; — engana cliente sério</li>
                <li>&quot;Liberdade total&quot; — fantasioso</li>
              </ul>
              <p className="text-[12px] text-[#6B6862] mt-4 font-serif italic">
                Exceção: &quot;Programa Empresa Sem Você&quot; é nome comercial (hook), sempre acompanhado da tagline &quot;sem você na execução, você na direção&quot;.
              </p>
            </div>
          </div>
        </section>

        {/* AMOSTRAS DE APLICAÇÃO */}
        <section className="py-16 sm:py-20 md:py-24 border-b border-[#EAE6DC]">
          <div className="container-x">
            <div className="max-w-4xl mb-10">
              <p className="t-eyebrow mb-3">08 · Aplicações</p>
              <h2 className="font-display font-semibold text-[clamp(1.625rem,1.3rem+1.2vw,2.125rem)] tracking-[-0.022em] text-[#0F0E0C] leading-[1.15]">
                O sistema em uso.
              </h2>
              <p className="text-[15px] text-[#6B6862] mt-4 max-w-2xl">
                A própria página em que você está aplicando o sistema. Recurso vivo, não estático. Toda peça nova deve referenciar esta página.
              </p>
            </div>

            {/* Card mostrando aplicação */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <Link
                href="/"
                className="block border border-[#EAE6DC] bg-white rounded-xl p-5 sm:p-7 hover:border-[#B8902A]/40 transition-colors"
              >
                <p className="t-label mb-3">Landing pública</p>
                <p className="font-display font-semibold text-[18px] text-[#0F0E0C] mb-2">
                  empresa-sem-voce.mtxestrategia.com.br
                </p>
                <p className="text-[13px] text-[#6B6862]">
                  Aplicação de todos os princípios em escala completa. Hero, pilares, manifesto, CTA.
                </p>
              </Link>

              <Link
                href="/vendedor"
                className="block border border-[#EAE6DC] bg-white rounded-xl p-5 sm:p-7 hover:border-[#B8902A]/40 transition-colors"
              >
                <p className="t-label mb-3">Briefing comercial</p>
                <p className="font-display font-semibold text-[18px] text-[#0F0E0C] mb-2">
                  /vendedor
                </p>
                <p className="text-[13px] text-[#6B6862]">
                  Aplicação editorial densa pra leitura técnica. 12 seções, mobile-first.
                </p>
              </Link>

              <Link
                href="/aplicar"
                className="block border border-[#EAE6DC] bg-white rounded-xl p-5 sm:p-7 hover:border-[#B8902A]/40 transition-colors"
              >
                <p className="t-label mb-3">Formulário público</p>
                <p className="font-display font-semibold text-[18px] text-[#0F0E0C] mb-2">
                  /aplicar
                </p>
                <p className="text-[13px] text-[#6B6862]">
                  Form multi-etapas com identidade preservada. Inputs underline minimalistas.
                </p>
              </Link>

              <div className="block border border-[#EAE6DC] bg-[#F4F2EC]/40 rounded-xl p-5 sm:p-7">
                <p className="t-label mb-3">Materiais entregues</p>
                <p className="font-display font-semibold text-[18px] text-[#0F0E0C] mb-2">
                  PDFs · Templates · Roteiros
                </p>
                <p className="text-[13px] text-[#6B6862]">
                  Aulas, PDFs guia, templates editáveis, cronograma. Tudo segue este sistema.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 sm:py-12 bg-[#0F0E0C] text-[#6E6E73]">
          <div className="container-x">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em]">
              <p>Identidade Visual · v1.0 · {new Date().getFullYear()}</p>
              <p>Matheus Martins · MTX Estratégia</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
