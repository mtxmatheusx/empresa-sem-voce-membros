import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Área de Membros · Programa Empresa Sem Você",
  description: "Acesse o método completo e o acompanhamento exclusivo.",
};

export default function MembrosLandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="esv-aura" />
      <header className="max-w-6xl w-full mx-auto px-6 py-6 md:py-8 relative">
        <Logo size="sm" />
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 flex items-center relative">
        <div className="max-w-2xl">
          <p className="t-eyebrow anim-fade-up">Área de Membros</p>

          <h1 className="font-display font-semibold text-[clamp(2rem,1.6rem+1.8vw,2.75rem)] leading-[1.1] tracking-[-0.025em] text-[#F5F5F5] mt-6 anim-fade-up delay-100">
            Em breve, seu acesso completo
            <br />
            <span className="font-serif italic text-[#C9A227]">
              ao método e ao acompanhamento.
            </span>
          </h1>

          <p className="text-[16px] md:text-[17px] leading-[1.55] text-[#A0A0A0] mt-6 max-w-xl anim-fade-up delay-300">
            A plataforma exclusiva pra você consumir o material completo do Programa
            Empresa Sem Você, acompanhar seu progresso pelos 5 pilares e ter acesso
            direto às tarefas, calls e suporte.
          </p>

          <div className="mt-16 anim-fade-up delay-500">
            <p className="t-label mb-3">Já é cliente?</p>
            <p className="text-[14px] leading-[1.6] text-[#A0A0A0] max-w-md mb-5">
              Entre com seu e-mail e senha. Primeiro acesso? Defina sua senha na tela
              de login.
            </p>
            <a
              href="/membros/login"
              className="inline-flex items-center gap-2 text-[14px] text-[#C9A227] hover:opacity-70 transition-opacity"
            >
              Entrar na plataforma →
            </a>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-6 py-8 relative" style={{ borderTop: "1px solid var(--color-border)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="t-label">© 2026 Matheus Martins · MTX Estratégia</p>
          <p className="t-label">Programa Empresa Sem Você</p>
        </div>
      </footer>
    </div>
  );
}
