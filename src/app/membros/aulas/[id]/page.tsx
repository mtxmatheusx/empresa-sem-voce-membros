import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembrosShell } from "@/components/membros/MembrosShell";
import { Client, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { MarkLessonComplete } from "@/components/membros/LessonActions";
import { youtubeEmbed } from "@/lib/youtube";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  Lock,
  ListChecks,
} from "lucide-react";

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
  const pillarInfo = PILLAR_INFO[typedLesson.pillar_number];

  // Aula bloqueada — não libera o player
  if (typedLesson.is_locked) {
    return (
      <MembrosShell>
        <div className="px-6 md:px-10 py-12 max-w-[900px] relative">
          <div className="esv-aura" />
          <Link
            href="/membros/aulas"
            className="inline-flex items-center gap-2 text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] transition-colors mb-8 relative"
          >
            <ArrowLeft size={14} /> Voltar às aulas
          </Link>
          <div className="card-elevated p-12 text-center relative">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full grid place-items-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border)" }}>
              <Lock size={26} className="text-[#C9A227]" />
            </div>
            <p className="font-serif italic text-[24px] text-[#F5F5F5] mb-3">
              {typedLesson.title}
            </p>
            <p className="text-[15px] text-[#A0A0A0] max-w-md mx-auto">
              Esta aula ainda não foi liberada. Assim que o conteúdo for publicado,
              ela aparece aqui pra você assistir.
            </p>
          </div>
        </div>
      </MembrosShell>
    );
  }

  // Registra última visualização (best-effort)
  await supabase.from("lesson_progress").upsert(
    {
      client_id: typedClient.id,
      lesson_id: typedLesson.id,
      last_watched_at: new Date().toISOString(),
    },
    { onConflict: "client_id,lesson_id" }
  );

  // Aulas do mesmo pilar p/ navegação
  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, order_in_pillar, title, is_locked")
    .eq("pillar_number", typedLesson.pillar_number)
    .eq("is_published", true)
    .order("order_in_pillar");
  const siblingArr = (siblings || []) as Pick<
    Lesson,
    "id" | "order_in_pillar" | "title" | "is_locked"
  >[];
  const currentIdx = siblingArr.findIndex((l) => l.id === typedLesson.id);
  const prevLesson = currentIdx > 0 ? siblingArr[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < siblingArr.length - 1
      ? siblingArr[currentIdx + 1]
      : null;

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("client_id", typedClient.id)
    .eq("lesson_id", typedLesson.id)
    .maybeSingle();
  const typedProgress = progress as LessonProgress | null;

  const embed = youtubeEmbed(typedLesson.video_url);
  const hasDocs =
    !!typedLesson.pdf_url || (typedLesson.templates_urls?.length ?? 0) > 0;

  return (
    <MembrosShell>
      <div className="px-6 md:px-10 py-10 max-w-[1000px] relative">
        <Link
          href="/membros/aulas"
          className="inline-flex items-center gap-2 text-[13px] text-[#6E6E6E] hover:text-[#F5F5F5] transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Pilar {typedLesson.pillar_number} · {pillarInfo?.name}
        </Link>

        <header className="mb-6">
          <p className="t-eyebrow">Aula</p>
          <h1 className="font-display font-bold text-[clamp(1.6rem,1.3rem+1.4vw,2.3rem)] leading-[1.1] tracking-[-0.025em] text-[#F5F5F5] mt-3">
            {typedLesson.title}
          </h1>
        </header>

        {/* Player */}
        <section className="mb-8">
          {embed ? (
            <div className="esv-embed">
              <iframe
                src={embed}
                title={typedLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : typedLesson.video_url ? (
            <div className="esv-embed">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={typedLesson.video_url} controls playsInline />
            </div>
          ) : (
            <div
              className="esv-embed grid place-items-center"
              style={{ border: "1px dashed var(--color-border-strong)" }}
            >
              <p className="font-serif italic text-[18px] text-[#6E6E6E] px-6 text-center">
                Vídeo desta aula ainda não foi publicado.
              </p>
            </div>
          )}
        </section>

        {typedLesson.description && (
          <section className="mb-8">
            <p className="text-[15px] md:text-[16px] text-[#C4C4C4] leading-relaxed max-w-2xl">
              {typedLesson.description}
            </p>
          </section>
        )}

        {/* Tarefa */}
        {typedLesson.task && (
          <section className="mb-8">
            <div className="card-elevated p-6 md:p-7">
              <p className="t-eyebrow mb-3 flex items-center gap-2">
                <ListChecks size={14} /> Sua tarefa
              </p>
              <p className="text-[15px] text-[#F5F5F5] leading-relaxed whitespace-pre-line">
                {typedLesson.task}
              </p>
            </div>
          </section>
        )}

        {/* Documentos */}
        {hasDocs && (
          <section className="mb-8">
            <p className="t-eyebrow mb-4">Materiais</p>
            <div className="flex flex-wrap gap-3">
              {typedLesson.pdf_url && (
                <a
                  href={typedLesson.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="esv-chip"
                >
                  <FileText size={16} /> Guia em PDF
                </a>
              )}
              {(typedLesson.templates_urls || []).map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="esv-chip"
                >
                  <Download size={16} /> Documento {i + 1}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Marcar concluída */}
        <section className="mb-10 pb-10" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <MarkLessonComplete
            lessonId={typedLesson.id}
            clientId={typedClient.id}
            alreadyCompleted={typedProgress?.completed_at != null}
          />
        </section>

        {/* Navegação */}
        <section className="flex items-center justify-between gap-4">
          {prevLesson && !prevLesson.is_locked ? (
            <Link href={`/membros/aulas/${prevLesson.id}`} className="group flex-1 max-w-[45%]">
              <p className="t-label mb-2 flex items-center gap-2">
                <ArrowLeft size={12} /> Aula anterior
              </p>
              <p className="text-[14px] text-[#F5F5F5] group-hover:text-[#C9A227] transition-colors line-clamp-2">
                {prevLesson.title}
              </p>
            </Link>
          ) : (
            <div className="flex-1 max-w-[45%]" />
          )}
          {nextLesson && !nextLesson.is_locked ? (
            <Link href={`/membros/aulas/${nextLesson.id}`} className="group flex-1 max-w-[45%] text-right">
              <p className="t-label mb-2 flex items-center gap-2 justify-end">
                Próxima aula <ArrowRight size={12} />
              </p>
              <p className="text-[14px] text-[#F5F5F5] group-hover:text-[#C9A227] transition-colors line-clamp-2">
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
