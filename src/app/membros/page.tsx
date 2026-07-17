import { Logo } from "@/components/ui/logo";

export const metadata = {
  title: "Área de Membros · Programa Empresa Sem Você",
  description: "Acesse o método completo e o acompanhamento exclusivo.",
};

export default function MembrosLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container-x py-6 md:py-8">
        <Logo size="sm" />
      </header>

      <main className="flex-1 container-x py-[var(--space-2xl)] flex items-center">
        <div className="max-w-2xl">
          <p className="t-eyebrow anim-fade-up">Área de Membros</p>

          <h1 className="font-display font-semibold text-[clamp(2rem,1.6rem+1.8vw,2.75rem)] leading-[1.1] tracking-[-0.025em] text-[#0F0E0C] mt-6 anim-fade-up delay-100">
            Em breve, seu acesso completo
            <br />
            <span className="t-accent">ao método e ao acompanhamento.</span>
          </h1>

          <p className="text-[16px] md:text-[17px] leading-[1.55] text-[#6B6862] mt-6 max-w-xl anim-fade-up delay-300">
            A plataforma exclusiva pra você consumir o material completo do Programa Empresa Sem Você, acompanhar seu progresso pelos 5 pilares e ter acesso direto às tarefas, calls e suporte.
          </p>

          <div className="mt-12 anim-fade-up delay-400">
            <p className="t-label">Lançamento</p>
            <p className="font-serif italic text-[20px] text-[#0F0E0C] mt-2">
              Junho de 2026
            </p>
          </div>

          <div className="mt-16 anim-fade-up delay-500">
            <p className="t-label mb-3">Já é cliente?</p>
            <p className="text-[14px] leading-[1.6] text-[#6B6862] max-w-md mb-5">
              Use o email cadastrado pra receber seu link de acesso. Sem senha.
            </p>
            <a
              href="/membros/login"
              className="inline-flex items-center gap-2 text-[14px] text-[#B8902A] hover:opacity-70 transition-opacity"
            >
              Entrar na plataforma →
            </a>
          </div>
        </div>
      </main>

      <footer className="container-x py-8 border-t border-[#EAE6DC]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="t-label">© {new Date().getFullYear()} Matheus Martins · MTX Estratégia</p>
          <p className="t-label">Programa Empresa Sem Você</p>
        </div>
      </footer>
    </div>
  );
}
