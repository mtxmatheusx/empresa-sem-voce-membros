import { redirect } from "next/navigation";

// Pilares foi consolidado no catálogo de Aulas (estilo Netflix).
export default function PilaresRedirect() {
  redirect("/membros/aulas");
}
