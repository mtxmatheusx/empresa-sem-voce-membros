import Link from "next/link";
import { Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { LessonPlayer } from "@/components/membros/LessonPlayer";
import { MarkLessonComplete } from "@/components/membros/LessonActions";
import { lessonCover } from "@/lib/youtube";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Download,
  FileText,
  ListChecks,
  Lock,
  Play,
} from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");
const pillarTag = (n: number) => (n === 0 ? "Boas-vindas" : `Pilar ${pad(n)}`);
const minutes = (s: number | null) => (s && s > 0 ? `${Math.max(1, Math.round(s / 60))} min` : null);

export function LessonView({
  lesson,
  clientId,
  allLessons,
  progressByLesson,
}: {
  lesson: Lesson;
  clientId: string;
  allLessons: Lesson[];
  progressByLesson: Map<string, LessonProgress>;
}) {
  const info = PILLAR_INFO[lesson.pillar_number];
  const prog = progressByLesson.get(lesson.id);
  const completed = prog?.completed_at != null;

  // ordem do programa inteiro: pilar, depois ordem dentro do pilar
  const ordered = [...allLessons].sort(
    (a, b) => a.pillar_number - b.pillar_number || a.order_in_pillar - b.order_in_pillar
  );
  const idx = ordered.findIndex((l) => l.id === lesson.id);
  const prev = ordered.slice(0, Math.max(0, idx)).reverse().find((l) => !l.is_locked) ?? null;
  const next = ordered.slice(idx + 1).find((l) => !l.is_locked) ?? null;
  const nextLocked = !next ? ordered.slice(idx + 1)[0] ?? null : null;

  const siblings = ordered.filter((l) => l.pillar_number === lesson.pillar_number);
  const sibDone = siblings.filter((l) => progressByLesson.get(l.id)?.completed_at).length;
  const dur = minutes(lesson.duration_seconds);
  const docs = [
    ...(lesson.pdf_url ? [{ url: lesson.pdf_url, label: "Guia da aula", kind: "PDF" }] : []),
    ...(lesson.templates_urls || []).map((url, i) => ({
      url,
      label: `Documento ${i + 1}`,
      kind: (url.split("?")[0].split(".").pop() || "link").slice(0, 4).toUpperCase(),
    })),
  ];

  return (
    <div className="esv-page esv-lesson">
      <nav className="esv-crumb esv-rise" style={{ "--d": 0 } as React.CSSProperties}>
        <Link href="/membros/aulas">
          <ArrowLeft size={14} strokeWidth={2} /> Aulas
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/membros/aulas#${lesson.pillar_number === 0 ? "boas-vindas" : `pilar-${lesson.pillar_number}`}`}>
          {pillarTag(lesson.pillar_number)} · {info?.name}
        </Link>
      </nav>

      <div className="esv-lesson__grid">
        {/* ===== Coluna principal ===== */}
        <div className="esv-lesson__main">
          <div className="esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
            <LessonPlayer
              videoUrl={lesson.video_url}
              title={lesson.title}
              lessonId={lesson.id}
              clientId={clientId}
              initialPct={prog?.watched_pct ?? 0}
              completed={completed}
            />
          </div>

          <header className="esv-lesson__head esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
            <div className="min-w-0">
              <p className="esv-row__kicker">
                {pillarTag(lesson.pillar_number)}
                {dur && (
                  <span className="esv-lesson__dur">
                    <Clock size={12} strokeWidth={2.2} /> {dur}
                  </span>
                )}
              </p>
              <h1 className="esv-lesson__title">{lesson.title}</h1>
            </div>
            <div className="esv-lesson__actions">
              <MarkLessonComplete lessonId={lesson.id} clientId={clientId} alreadyCompleted={completed} />
              {next && (
                <Link href={`/membros/aulas/${next.id}`} className="esv-btn esv-btn--ghost esv-glass">
                  Próxima aula <ArrowRight size={16} strokeWidth={2} />
                </Link>
              )}
            </div>
          </header>

          {lesson.description && (
            <p className="esv-lesson__desc esv-rise" style={{ "--d": 3 } as React.CSSProperties}>
              {lesson.description}
            </p>
          )}

          {(lesson.task || docs.length > 0) && (
            <div className="esv-lesson__cards esv-rise" style={{ "--d": 4 } as React.CSSProperties}>
              {lesson.task && (
                <section className="esv-panel esv-panel--task esv-glass">
                  <p className="esv-panel__kicker">
                    <ListChecks size={15} strokeWidth={2} /> Sua tarefa
                  </p>
                  <p className="esv-panel__body">{lesson.task}</p>
                </section>
              )}
              {docs.length > 0 && (
                <section className="esv-panel esv-glass">
                  <p className="esv-panel__kicker">
                    <FileText size={15} strokeWidth={2} /> Materiais
                  </p>
                  <ul className="esv-docs">
                    {docs.map((d) => (
                      <li key={d.url}>
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="esv-doc">
                          <span className="esv-doc__kind">{d.kind}</span>
                          <span className="esv-doc__label">{d.label}</span>
                          <Download size={16} strokeWidth={2} className="esv-doc__icon" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {/* navegação no fim */}
          <nav className="esv-lesson__nav esv-rise" style={{ "--d": 5 } as React.CSSProperties}>
            {prev ? (
              <Link href={`/membros/aulas/${prev.id}`} className="esv-navcard esv-glass">
                <span className="esv-navcard__dir">
                  <ArrowLeft size={14} strokeWidth={2} /> Anterior
                </span>
                <span className="esv-navcard__title">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/membros/aulas/${next.id}`} className="esv-navcard esv-navcard--next esv-glass">
                <span className="esv-navcard__dir">
                  Próxima <ArrowRight size={14} strokeWidth={2} />
                </span>
                <span className="esv-navcard__title">{next.title}</span>
              </Link>
            ) : nextLocked ? (
              <div className="esv-navcard esv-navcard--next is-locked esv-glass">
                <span className="esv-navcard__dir">
                  Em breve <Lock size={13} strokeWidth={2} />
                </span>
                <span className="esv-navcard__title">{pillarTag(nextLocked.pillar_number)} · {PILLAR_INFO[nextLocked.pillar_number]?.name}</span>
              </div>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* ===== Lateral: aulas do pilar ===== */}
        <aside className="esv-lesson__side esv-rise" style={{ "--d": 3 } as React.CSSProperties}>
          <div className="esv-panel esv-glass">
            <p className="esv-panel__kicker">Neste pilar</p>
            <p className="esv-side-title">{info?.name}</p>
            <div className="esv-side-meta">
              <span className="esv-row__bar">
                <span style={{ width: `${siblings.length ? (sibDone / siblings.length) * 100 : 0}%` }} />
              </span>
              <span>
                {sibDone}/{siblings.length}
              </span>
            </div>
            <ol className="esv-playlist">
              {siblings.map((l) => {
                const p = progressByLesson.get(l.id);
                const isCur = l.id === lesson.id;
                const isDone = !!p?.completed_at;
                const cover = lessonCover(l);
                const body = (
                  <>
                    <span className="esv-playlist__thumb">
                      {cover.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover.url} alt="" loading="lazy" />
                      ) : null}
                      <span className="esv-playlist__state">
                        {l.is_locked ? (
                          <Lock size={12} strokeWidth={2.2} />
                        ) : isDone ? (
                          <Check size={13} strokeWidth={3} />
                        ) : isCur ? (
                          <span className="esv-eq" aria-hidden>
                            <i /><i /><i />
                          </span>
                        ) : (
                          <Play size={11} fill="currentColor" strokeWidth={0} />
                        )}
                      </span>
                    </span>
                    <span className="esv-playlist__txt">
                      <span className="esv-playlist__n">Aula {pad(l.order_in_pillar)}</span>
                      <span className="esv-playlist__t">{l.title}</span>
                      {!isDone && (p?.watched_pct ?? 0) > 0 && (
                        <span className="esv-playlist__bar">
                          <span style={{ width: `${p!.watched_pct}%` }} />
                        </span>
                      )}
                    </span>
                  </>
                );
                return (
                  <li key={l.id}>
                    {l.is_locked ? (
                      <div className="esv-playlist__item is-locked">{body}</div>
                    ) : (
                      <Link
                        href={`/membros/aulas/${l.id}`}
                        className={`esv-playlist__item${isCur ? " is-current" : ""}${isDone ? " is-done" : ""}`}
                        aria-current={isCur ? "page" : undefined}
                      >
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
            {info?.tese && <p className="esv-side-tese">{info.tese}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

export function LockedLessonView({ lesson }: { lesson: Lesson }) {
  const info = PILLAR_INFO[lesson.pillar_number];
  const cover = lessonCover(lesson);
  return (
    <div className="esv-page esv-lesson">
      <nav className="esv-crumb esv-rise">
        <Link href="/membros/aulas">
          <ArrowLeft size={14} strokeWidth={2} /> Aulas
        </Link>
      </nav>
      <section className="esv-locked esv-glass esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
        {cover.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt="" className="esv-locked__bg" />
        )}
        <div className="esv-locked__in">
          <span className="esv-locked__icon">
            <Lock size={24} strokeWidth={1.8} />
          </span>
          <p className="esv-row__kicker">
            {pillarTag(lesson.pillar_number)} · {info?.name}
          </p>
          <h1 className="esv-lesson__title">{lesson.title}</h1>
          <p className="esv-lesson__desc">
            Esta aula ainda não foi liberada. Quando o conteúdo for publicado, ela aparece aqui para
            você assistir.
          </p>
          <Link href="/membros/aulas" className="esv-btn esv-btn--ghost esv-glass">
            <ArrowLeft size={16} strokeWidth={2} /> Voltar às aulas
          </Link>
        </div>
      </section>
    </div>
  );
}
