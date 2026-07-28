import type { Metadata } from "next";
import { Inter, Inter_Tight, Fraunces } from "next/font/google";
import "./globals.css";

// Apple-style stack: Inter (text) + Inter Tight (display) + Fraunces (editorial serif)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://empresa-sem-voce.mtxestrategia.com.br"),
  title: {
    default: "Empresa Sem Você · Área de Membros",
    template: "%s · Empresa Sem Você",
  },
  description:
    "Em 120 dias, donos de PME migram do operacional tático ao estratégico. Mentoria 1:1 com Matheus Martins.",
  applicationName: "Programa Empresa Sem Você",
  authors: [{ name: "Matheus Martins" }],
  keywords: [
    "mentoria",
    "PME",
    "gestão",
    "operacional tático",
    "operacional estratégico",
    "Matheus Martins",
    "MTX Estratégia",
    "Princípio do Espelho",
  ],
  openGraph: {
    title: "Programa Empresa Sem Você",
    description:
      "Em 120 dias, sua empresa funciona sem você na execução. Em 12 meses, ela cresce sem depender de você.",
    type: "website",
    locale: "pt_BR",
    siteName: "Programa Empresa Sem Você",
    url: "https://empresa-sem-voce.mtxestrategia.com.br",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programa Empresa Sem Você",
    description:
      "Em 120 dias, sua empresa funciona sem você na execução.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${interTight.variable} ${fraunces.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
