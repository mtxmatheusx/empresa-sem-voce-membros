import { redirect } from "next/navigation";

// Consolidado no catálogo de Aulas.
export default async function PilarRedirect() {
  redirect("/membros/aulas");
}
