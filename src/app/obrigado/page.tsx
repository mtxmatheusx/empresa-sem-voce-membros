import Link from "next/link";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Aplicação recebida · Programa Empresa Sem Você",
};

export default function ObrigadoPage() {
  return (
    <>
      <Nav showCta={false} />

      <main className="pt-40 pb-24 container-x relative min-h-screen">
        <div className="max-w-2xl">
          <p className="t-eyebrow anim-fade-up">Aplicação recebida</p>

          <h1 className="font-display font-semibold text-[clamp(2rem,1.6rem+1.8vw,2.875rem)] leading-[1.1] tracking-[-0.025em] text-[#0F0E0C] mt-6 anim-fade-up delay-100">
            Vou ler sua aplicação <span className="t-accent">pessoalmente.</span>
          </h1>

          <p className="text-[17px] leading-[1.55] text-[#6B6862] mt-6 anim-fade-up delay-300">
            Em até <span className="text-[#0F0E0C] font-medium">1 dia útil</span>, você recebe retorno no WhatsApp ou email. Se fizer sentido, agendamos uma call de 30 minutos para o diagnóstico inicial.
          </p>

          <div className="mt-16 anim-fade-up delay-400">
            <p className="t-eyebrow mb-8">Enquanto você espera</p>
            <ol className="space-y-6">
              {[
                { n: "01", text: "Me segue no Instagram", link: { href: "https://instagram.com/matheusmartins.x", label: "@matheusmartins.x" } },
                { n: "02", text: "Pensa em como você descreveria sua empresa em 30 segundos." },
                { n: "03", text: "Liste 3 decisões que sua equipe deveria estar tomando sem você hoje." },
              ].map((item) => (
                <li key={item.n} className="flex items-start gap-5">
                  <span className="font-serif italic text-[#B8902A] text-[22px] leading-none w-8 flex-shrink-0 mt-1">
                    {item.n}
                  </span>
                  <p className="text-[15px] leading-[1.55] text-[#0F0E0C]">
                    {item.text}
                    {item.link && (
                      <>
                        {" "}
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-editorial"
                        >
                          {item.link.label}
                        </a>
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 anim-fade-up delay-500">
            <Link href="/">
              <Button variant="outline">← Voltar para a home</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
