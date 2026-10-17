import Link from "next/link";
import { Reveal } from "@/components/membros/motion";
import { Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { lessonCover } from "@/lib/youtube";

const pad = (n: number) => String(n).padStart(2, "0");
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const minutes = (s: number | null) => (s && s > 0 ? `${Math.max(1, Math.round(s / 60))} min` : null);

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

  const inProgress = playable
    .map((l) => ({ l, p: progressByLesson.get(l.id) }))
    .filter((x) => x.p && !x.p.completed_at && (x.p.watched_pct ?? 0) > 0)
    .sort((a, b) => (b.p?.last_watched_at ?? "").localeCompare(a.p?.last_watched_at ?? ""))[0]?.l;
  const nextUp = inProgress ?? playable.find((l) => !progressByLesson.get(l.id)?.completed_at);
  const ctaLabel = inProgress ? "Continuar de onde parou" : doneCount > 0 ? "Próxima aula" : "Começar por aqui";

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

  const openCount = playable.length;

  return (
    <div className="ed-page">
      {/* ===== Abertura ===== */}
      <section className="ed-wrap ed-open">
        <p className="ed-label is-gold ed-in" style={{ "--d": 0 } as React.CSSProperties}>
          {firstName ? `${firstName} · Programa Empresa Sem Você` : "Programa Empresa Sem Você"}
        </p>
        <h1 className="ed-h1 ed-in" style={{ "--d": 1 } as React.CSSProperties}>
          Sua empresa rodando <em>sem você</em> no operacional.
        </h1>
        <p className="ed-lede ed-in" style={{ "--d": 2 } as React.CSSProperties}>
          O método completo em cinco pilares. Assista no seu ritmo, aplique na empresa e acompanhe
          o avanço aula a aula.
        </p>
        {nextUp && (
          <div className="ed-actions ed-in" style={{ "--d": 3 } as React.CSSProperties}>
            <Link href={`/membros/aulas/${nextUp.id}`} className="ed-btn">
              {ctaLabel}
              <span aria-hidden>→</span>
            </Link>
            <span className="ed-actions__note">
              {nextUp.pillar_number === 0 ? "Prólogo" : `Capítulo ${ROMAN[nextUp.pillar_number]}`} · {nextUp.title}
            </span>
          </div>
        )}

        <dl className="ed-figs ed-in" style={{ "--d": 4 } as React.CSSProperties}>
          <div>
            <dt className="ed-fig">{pct}%</dt>
            <dd>do programa concluído</dd>
          </div>
          <div>
            <dt className="ed-fig">
              {doneCount}
              <small>/{lessons.length}</small>
            </dt>
            <dd>aulas assistidas</dd>
          </div>
          <div>
            <dt className="ed-fig">{pad(rows.filter((r) => r.number > 0).length)}</dt>
            <dd>pilares do método</dd>
          </div>
          <div>
            <dt className="ed-fig">{pad(openCount)}</dt>
            <dd>aulas liberadas até agora</dd>
          </div>
        </dl>
      </section>

      {/* ===== Índice ===== */}
      <section className="ed-sec ed-alt" id="indice">
        <Reveal className="ed-wrap ed-toc">
          <div>
            <p className="ed-label is-gold">Índice</p>
            <h2 className="ed-h2">Os cinco pilares</h2>
            <p className="ed-body">
              Cada pilar é um capítulo. Siga na ordem: um prepara o terreno do seguinte.
            </p>
          </div>
          <ol className="ed-toc__list">
            {rows.map((r) => (
              <li key={r.id}>
                <a href={`#${r.id}`}>
                  <span className="ed-rn">{r.number === 0 ? "—" : ROMAN[r.number]}</span>
                  <span className="ed-toc__t">{r.number === 0 ? "Prólogo · Boas-vindas" : r.info.name}</span>
                  <span className="ed-toc__n">
                    {r.done}/{r.lessons.length}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ===== Capítulos ===== */}
      {rows.map((row) => (
        <section key={row.id} id={row.id} className="ed-sec ed-chapter">
          <Reveal className="ed-wrap">
            <header className="ed-chap">
              <div className="ed-chap__num">
                <span className="ed-rn is-lg">
                  {row.number === 0 ? "Prólogo" : `Capítulo ${ROMAN[row.number]}`}
                </span>
                <span className="ed-label">
                  {row.number === 0 ? "Boas-vindas" : `Pilar ${pad(row.number)}`} · {row.done} de {row.lessons.length}{" "}
                  {row.lessons.length === 1 ? "aula" : "aulas"}
                </span>
                <span className="ed-bar">
                  <span style={{ width: `${row.lessons.length ? (row.done / row.lessons.length) * 100 : 0}%` }} />
                </span>
              </div>
              <div>
                <h2 className="ed-h2 is-xl">{row.info.name}</h2>
                <p className="ed-lede">{row.info.tese}</p>
                <ol className="ed-lessons">
                  {row.lessons.map((lesson, i) => {
                    const prog = progressByLesson.get(lesson.id);
                    const done = !!prog?.completed_at;
                    const cover = lessonCover(lesson);
                    const dur = minutes(lesson.duration_seconds);
                    const locked = !!lesson.is_locked;
                    const status = locked
                      ? "Em breve"
                      : done
                        ? "Concluída"
                        : (prog?.watched_pct ?? 0) > 0
                          ? `${prog!.watched_pct}% assistido`
                          : dur ?? "Assistir";
                    const inner = (
                      <>
                        <figure className="ed-poster">
                          {cover.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cover.url} alt="" loading="lazy" />
                          ) : (
                            <span className="ed-poster__blank">
                              <span className="ed-rn">{row.number === 0 ? "—" : ROMAN[row.number]}</span>
                            </span>
                          )}
                          {!locked && (prog?.watched_pct ?? 0) > 0 && !done && (
                            <span className="ed-poster__bar">
                              <span style={{ width: `${prog!.watched_pct}%` }} />
                            </span>
                          )}
                        </figure>
                        <span className="ed-lesson__tx">
                          <span className="ed-lesson__meta">
                            <span className="ed-label">Aula {pad(lesson.order_in_pillar)}</span>
                            <span className={`ed-label${done ? " is-gold" : ""}`}>{status}</span>
                          </span>
                          <span className="ed-lesson__t">{lesson.title}</span>
                          {lesson.description && (
                            <span className="ed-lesson__d">{lesson.description}</span>
                          )}
                          <span className="ed-lesson__go">
                            {locked ? "Disponível em breve" : done ? "Rever aula" : "Assistir"}
                            {!locked && <span aria-hidden> →</span>}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={lesson.id} className="ed-lesson" style={{ "--i": i } as React.CSSProperties}>
                        {locked ? (
                          <div className="ed-lesson__a is-locked" aria-disabled>
                            {inner}
                          </div>
                        ) : (
                          <Link href={`/membros/aulas/${lesson.id}`} className="ed-lesson__a">
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </header>

          </Reveal>
        </section>
      ))}
    </div>
  );
}
