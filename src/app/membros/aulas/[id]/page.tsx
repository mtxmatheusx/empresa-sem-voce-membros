import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { MarkLessonComplete } from "@/components/membros/LessonActions";
import { ArrowLeft, ArrowRight, FileText, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/membros/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();
  if (!client) redirect("/membros/dashboard");

  const typedClient = client as Client;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (!lesson) notFound();
  const typedLesson = lesson as Lesson;

  // Registra last_watched_at imediatamente (best-effort)
  await supabase
    .from("lesson_progress")
    .upsert(
      {
        client_id: typedClient.id,
        lesson_id: typedLesson.id,
        last_watched_at: new Date().toISOString(),
      },
      { onConflict: "client_id,lesson_id" }
    );

  // Aulas do mesmo pilar pra navegação prev/next
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, order_in_pillar, title")
    .eq("pillar_number", typedLesson.pillar_number)
    .eq("is_published", true)
    .order("order_in_pillar");

  const siblingArr = (siblings || []) as Pick<Lesson, "id" | "order_in_pillar" | "title">[];
  const currentIdx = siblingArr.findIndex((l) => l.id === typedLesson.id);
  const prevLesson = currentIdx > 0 ? siblingArr[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < siblingArr.length - 1
      ? siblingArr[currentIdx + 1]
      : null;

  // Progress atual
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("client_id", typedClient.id)
    .eq("lesson_id", typedLesson.id)
    .maybeSingle();
  const typedProgress = progress as LessonProgress | null;

  const pillarInfo = PILLAR_INFO[typedLesson.pillar_number];

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-12 max-w-[1100px]">
        <Link
          href={`/membros/pilares/${typedLesson.pillar_number}`}
          className="inline-flex items-center gap-2 text-[13px] text-[#A09C92] hover:text-[#0F0E0C] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Pilar {typedLesson.pillar_number} · {pillarInfo?.name}
        </Link>

        <header className="mb-8">
          <p className="t-eyebrow">Aula</p>
          <h1 className="font-display font-bold text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] leading-[1.1] tracking-[-0.025em] text-[#0F0E0C] mt-3">
            {typedLesson.title}
          </h1>
          {typedLesson.description && (
            <p className="text-[16px] text-[#6B6862] leading-relaxed mt-4 max-w-2xl">
              {typedLesson.description}
            </p>
          )}
        </header>

        {/* Player */}
        <section className="mb-10">
          {typedLesson.video_url ? (
            <div className="aspect-video bg-[#0F0E0C] rounded-lg overflow-hidden">
              <video
                src={typedLesson.video_url}
                controls
                className="w-full h-full"
                playsInline
              />
            </div>
          ) : (
            <div className="aspect-video bg-[#F4F2EC] rounded-lg flex items-center justify-center border border-dashed border-[#D4CFC0]">
              <p className="font-serif italic text-[20px] text-[#A09C92]">
                Vídeo desta aula ainda não foi publicado.
              </p>
            </div>
          )}
        </section>

        {/* Materiais */}
        {(typedLesson.pdf_url || (typedLesson.templates_urls?.length ?? 0) > 0) && (
          <section className="mb-10">
            <p className="t-eyebrow mb-4">Materiais</p>
            <div className="flex flex-wrap gap-3">
              {typedLesson.pdf_url && (
                <a
                  href={typedLesson.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 h-11 border border-[#D4CFC0] rounded-full text-[14px] text-[#0F0E0C] hover:border-[#0F0E0C] bg-white transition-colors"
                >
                  <FileText size={16} />
                  Guia em PDF
                </a>
              )}
              {(typedLesson.templates_urls || []).map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 h-11 border border-[#D4CFC0] rounded-full text-[14px] text-[#0F0E0C] hover:border-[#0F0E0C] bg-white transition-colors"
                >
                  <Download size={16} />
                  Template {i + 1}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Marcar concluída */}
        <section className="mb-12 pb-12 border-b border-[#EAE6DC]">
          <MarkLessonComplete
            lessonId={typedLesson.id}
            clientId={typedClient.id}
            alreadyCompleted={typedProgress?.completed_at != null}
          />
        </section>

        {/* Navegação */}
        <section className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link
              href={`/membros/aulas/${prevLesson.id}`}
              className="group flex-1 max-w-[45%]"
            >
              <p className="t-label mb-2 flex items-center gap-2">
                <ArrowLeft size={12} />
                Aula anterior
              </p>
              <p className="text-[14px] text-[#0F0E0C] group-hover:text-[#B8902A] transition-colors line-clamp-2">
                {prevLesson.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1 max-w-[45%]" />
          )}
          {nextLesson ? (
            <Link
              href={`/membros/aulas/${nextLesson.id}`}
              className="group flex-1 max-w-[45%] text-right"
            >
              <p className="t-label mb-2 flex items-center gap-2 justify-end">
                Próxima aula
                <ArrowRight size={12} />
              </p>
              <p className="text-[14px] text-[#0F0E0C] group-hover:text-[#B8902A] transition-colors line-clamp-2">
                {nextLesson.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1 max-w-[45%]" />
          )}
        </section>
      </div>
    </MembrosShell>
  );
}
