import Link from "next/link";
import { LessonCard } from "@/components/membros/LessonCard";
import { ParallaxHero, PillarNav, Rail, Reveal } from "@/components/membros/motion";
import { Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { Play, ArrowDown } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");

export function Catalog({
  firstName,
  lessons,
  progressByLesson,
}: {
  firstName: string;
  lessons: Lesson[];
  progressByLesson: Map<string, LessonProgress>;
}) {
  const playable = lessons.filter((l) => !l.is_locked);
  const doneCount = lessons.filter((l) => progressByLesson.get(l.id)?.completed_at).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  // CTA do hero: a aula mais recente em andamento; senão a primeira não concluída
  const inProgress = playable
    .map((l) => ({ l, p: progressByLesson.get(l.id) }))
    .filter((x) => x.p && !x.p.completed_at && (x.p.watched_pct ?? 0) > 0)
    .sort((a, b) =>
      (b.p?.last_watched_at ?? "").localeCompare(a.p?.last_watched_at ?? "")
    )[0]?.l;
  const nextUp =
    inProgress ?? playable.find((l) => !progressByLesson.get(l.id)?.completed_at);
  const ctaLabel = inProgress
    ? "Continuar de onde parou"
    : doneCount > 0
      ? "Próxima aula"
      : "Começar por aqui";

  const rows = [0, 1, 2, 3, 4, 5]
    .map((p) => {
      const ls = lessons.filter((l) => l.pillar_number === p);
      return {
        number: p,
        id: p === 0 ? "boas-vindas" : `pilar-${p}`,
        info: PILLAR_INFO[p],
        lessons: ls,
        done: ls.filter((l) => progressByLesson.get(l.id)?.completed_at).length,
        open: ls.filter((l) => !l.is_locked).length,
      };
    })
    .filter((r) => r.lessons.length > 0 && r.info);

  // anel de progresso
  const R = 44;
  const C = 2 * Math.PI * R;

  return (
    <div className="esv-page">
      {/* ===== Hero ===== */}
      <ParallaxHero className="esv-hero">
        <div className="esv-hero__layer esv-hero__glow" aria-hidden />
        <div className="esv-hero__layer esv-hero__mark" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-esv-mark.png" alt="" />
        </div>
        <div className="esv-hero__layer esv-hero__grain" aria-hidden />
        <div className="esv-hero__rim" aria-hidden />

        <div className="esv-hero__grid">
          <div className="esv-hero__copy">
            <p className="t-eyebrow esv-rise" style={{ "--d": 0 } as React.CSSProperties}>
              {firstName ? `${firstName}, bom ter você aqui` : "Programa Empresa Sem Você"}
            </p>
            <h1 className="esv-hero__title esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
              Sua empresa rodando
              <br />
              <em>sem você no operacional.</em>
            </h1>
            <p className="esv-hero__lead esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
              Método completo em 5 pilares. Assista no seu ritmo, aplique na empresa e
              acompanhe seu avanço aula a aula.
            </p>
            <div className="esv-hero__ctas esv-rise" style={{ "--d": 3 } as React.CSSProperties}>
              {nextUp && (
                <Link href={`/membros/aulas/${nextUp.id}`} className="esv-btn">
                  <span className="esv-btn__icon">
                    <Play size={14} fill="currentColor" strokeWidth={0} />
                  </span>
                  {ctaLabel}
                </Link>
              )}
              <a href="#pilares" className="esv-btn esv-btn--ghost esv-glass">
                Ver os pilares
                <ArrowDown size={16} strokeWidth={2} />
              </a>
            </div>
            {nextUp && (
              <p className="esv-hero__next esv-rise" style={{ "--d": 4 } as React.CSSProperties}>
                <span>{nextUp.pillar_number === 0 ? "Boas-vindas" : `Pilar ${pad(nextUp.pillar_number)}`}</span>
                {nextUp.title}
              </p>
            )}
          </div>

          {/* Painel de progresso */}
          <aside className="esv-hero__panel esv-glass esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
            <div className="esv-ring">
              <svg viewBox="0 0 100 100" aria-hidden>
                <defs>
                  <linearGradient id="esvRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F1D78A" />
                    <stop offset="1" stopColor="#B8902A" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r={R} className="esv-ring__track" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  className="esv-ring__bar"
                  style={
                    {
                      strokeDasharray: C,
                      "--from": C,
                      "--to": C * (1 - pct / 100),
                    } as React.CSSProperties
                  }
                />
              </svg>
              <div className="esv-ring__label">
                <strong>{pct}%</strong>
                <span>concluído</span>
              </div>
            </div>
            <p className="esv-hero__count">
              <strong>{doneCount}</strong> de {lessons.length} aulas
            </p>
            <ul className="esv-pillars">
              {rows
                .filter((r) => r.number > 0)
                .map((r) => {
                  const w = r.lessons.length ? (r.done / r.lessons.length) * 100 : 0;
                  return (
                    <li key={r.id}>
                      <span className="esv-pillars__n">{pad(r.number)}</span>
                      <span className="esv-pillars__bar">
                        <span style={{ width: `${w}%` }} />
                      </span>
                      <span className="esv-pillars__v">
                        {r.done}/{r.lessons.length}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </aside>
        </div>
      </ParallaxHero>

      {/* ===== Navegação por pilar ===== */}
      <div id="pilares" />
      <PillarNav
        items={rows.map((r) => ({
          id: r.id,
          short: r.number === 0 ? "00" : pad(r.number),
          label: r.number === 0 ? "Boas-vindas" : r.info.name,
        }))}
      />

      {/* ===== Prateleiras ===== */}
      <div className="esv-rows">
        {rows.map((row) => (
          <Reveal key={row.id} id={row.id} className="esv-row">
            <header className="esv-row__head">
              <span className="esv-row__num" aria-hidden>
                {pad(row.number)}
              </span>
              <div className="min-w-0">
                <p className="esv-row__kicker">
                  {row.number === 0 ? "Comece por aqui" : `Pilar ${pad(row.number)}`}
                </p>
                <h2 className="esv-row__title">{row.info.name}</h2>
                <p className="esv-row__tese">{row.info.tese}</p>
              </div>
              <div className="esv-row__meta">
                <span>
                  {row.lessons.length} {row.lessons.length === 1 ? "aula" : "aulas"}
                  {row.open < row.lessons.length && ` · ${row.lessons.length - row.open} em breve`}
                </span>
                <span className="esv-row__bar">
                  <span style={{ width: `${row.lessons.length ? (row.done / row.lessons.length) * 100 : 0}%` }} />
                </span>
              </div>
            </header>
            <Rail label={row.info.name}>
              {row.lessons.map((lesson, i) => {
                const prog = progressByLesson.get(lesson.id);
                return (
                  <LessonCard
                    key={lesson.id}
                    index={i}
                    lesson={lesson}
                    pillarLabel={row.number === 0 ? "Boas-vindas" : `Pilar ${pad(row.number)}`}
                    watchedPct={prog?.watched_pct ?? 0}
                    completed={prog?.completed_at != null}
                  />
                );
              })}
            </Rail>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
