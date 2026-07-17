import { Suspense } from "react";
import { Nav } from "@/components/ui/nav";
import { MultiStepForm } from "@/components/form/MultiStepForm";

export const metadata = {
  title: "Aplicação · Programa Empresa Sem Você",
};

export default function AplicarPage() {
  return (
    <>
      <Nav showCta={false} />

      <main className="pt-32 pb-[var(--space-2xl)] container-x relative">
        <Suspense fallback={<div className="max-w-2xl mx-auto h-96" />}>
          <MultiStepForm />
        </Suspense>
      </main>

      <footer className="container-x py-[var(--space-md)] border-t border-[#EAE6DC]">
        <p className="t-label text-center">
          Suas respostas são confidenciais · usadas apenas para análise da aplicação
        </p>
      </footer>
    </>
  );
}
