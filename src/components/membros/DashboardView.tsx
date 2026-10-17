import Link from "next/link";
import { Client, ClientTask, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { ProgressRing } from "@/components/membros/ProgressRing";
import { ParallaxHero, Reveal } from "@/components/membros/motion";
import { lessonCover } from "@/lib/youtube";
import { ArrowRight, CalendarDays, Check, Lock, Play } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");
const DAY = 86_400_000;
const PROGRAM_DAYS = 120;

export function DashboardView({
  client,
  lessons,
  progressByLesson,
  tasks,
  now = new Date(),
}: {
  client: Client;
  lessons: Lesson[];
  progressByLesson: Map<string, LessonProgress>;
  tasks: ClientTask[];
  now?: Date;
}) {
  const firstName = client.name?.split(" ")[0] ?? "";

  // linha do tempo do programa (início → fim, padrão 120 dias)
  const start = new Date(client.started_at);
  const end = client.ends_at ? new Date(client.ends_at) : new Date(start.getTime() + PROGRAM_DAYS * DAY);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY));
  const day = Math.min(totalDays, Math.max(1, Math.floor((now.getTime() - start.getTime()) / DAY) + 1));
  const timePct = (day / totalDays) * 100;
  const daysLeft = Math.max(0, totalDays - day);

  const done = lessons.filter((l) => progressByLesson.get(l.id)?.completed_at).length;
  const pct = lessons.length ? (done / lessons.length) * 100 : 0;

  const playable = lessons.filter((l) => !l.is_locked);
  const inProgress = playable
    .map((l) => ({ l, p: progressByLesson.get(l.id) }))
    .filter((x) => x.p && !x.p.completed_at && (x.p.watched_pct ?? 0) > 0)
    .sort((a, b) => (b.p?.last_watched_at ?? "").localeCompare(a.p?.last_watched_at ?? ""))[0]?.l;
  const next = inProgress ?? playable.find((l) => !progressByLesson.get(l.id)?.completed_at);
  const nextProg = next ? progressByLesson.get(next.id) : undefined;
  const nextCover = next ? lessonCover(next) : null;

  const current = PILLAR_INFO[client.current_pillar] ?? PILLAR_INFO[1];
  const pillars = [1, 2, 3, 4, 5].map((n) => {
    const ls = lessons.filter((l) => l.pillar_number === n);
    const d = ls.filter((l) => progressByLesson.get(l.id)?.completed_at).length;
    return {
      n,
      info: PILLAR_INFO[n],
      total: ls.length,
      done: d,
      locked: ls.length > 0 && ls.every((l) => l.is_locked),
    };
  });

  return (
    <div className="esv-page esv-dash">
      {/* ===== Hero ===== */}
      <ParallaxHero className="esv-hero esv-hero--dash">
        <div className="esv-hero__layer esv-hero__glow" aria-hidden />
        <div className="esv-hero__layer esv-hero__grain" aria-hidden />
        <div className="esv-hero__rim" aria-hidden />

        <div className="esv-hero__grid">
          <div className="esv-hero__copy">
            <p className="t-eyebrow esv-rise" style={{ "--d": 0 } as React.CSSProperties}>
              {firstName ? `Olá, ${firstName}` : "Seu painel"}
            </p>
            <h1 className="esv-hero__title esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
              Dia {day} <em>de {totalDays}.</em>
            </h1>
            <p className="esv-hero__lead esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
              {client.current_pillar === 0
                ? "Você está nas Boas-vindas. Comece pelo alinhamento inicial e siga para o pilar 01."
                : `Você está no pilar ${pad(client.current_pillar)}, ${current.name}. ${current.tese}`}
            </p>

            <div className="esv-timeline esv-rise" style={{ "--d": 3 } as React.CSSProperties}>
              <div className="esv-timeline__bar">
                <span style={{ width: `${timePct}%` }} />
                <i style={{ left: `${timePct}%` }} aria-hidden />
              </div>
              <div className="esv-timeline__legend">
                <span>
                  <CalendarDays size={13} strokeWidth={2} />
                  {start.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
                <span>
                  {daysLeft === 0 ? "Último dia" : `${daysLeft} ${daysLeft === 1 ? "dia" : "dias"} pela frente`}
                </span>
                <span>{end.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
              </div>
            </div>
          </div>

          <aside className="esv-hero__panel esv-glass esv-rise" style={{ "--d": 2 } as React.CSSProperties}>
            <ProgressRing pct={pct} id="esvRingDash" />
            <p className="esv-hero__count">
              <strong>{done}</strong> de {lessons.length} aulas concluídas
            </p>
          </aside>
        </div>
      </ParallaxHero>

      <div className="esv-dash__grid">
        {/* ===== Próxima aula ===== */}
        <Reveal className="esv-dash__next">
          {next ? (
            <Link href={`/membros/aulas/${next.id}`} className="esv-nextcard esv-glass">
              <span className="esv-nextcard__poster">
                {nextCover?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={nextCover.url} alt="" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/logo-esv-mark.png" alt="" className="is-mark" />
                )}
              </span>
              <span className="esv-nextcard__body">
                <span className="esv-panel__kicker">
                  {inProgress ? "Continue de onde parou" : "Sua próxima aula"}
                </span>
                <span className="esv-nextcard__title">{next.title}</span>
                <span className="esv-nextcard__meta">
                  {next.pillar_number === 0 ? "Boas-vindas" : `Pilar ${pad(next.pillar_number)} · ${PILLAR_INFO[next.pillar_number]?.name}`}
                </span>
                {(nextProg?.watched_pct ?? 0) > 0 && (
                  <span className="esv-nextcard__bar">
                    <span style={{ width: `${nextProg!.watched_pct}%` }} />
                  </span>
                )}
                <span className="esv-btn esv-nextcard__cta">
                  <span className="esv-btn__icon">
                    <Play size={14} fill="currentColor" strokeWidth={0} />
                  </span>
                  {inProgress ? "Continuar" : "Assistir agora"}
                </span>
              </span>
            </Link>
          ) : (
            <div className="esv-nextcard esv-glass">
              <span className="esv-nextcard__body">
                <span className="esv-panel__kicker">Tudo em dia</span>
                <span className="esv-nextcard__title">Você assistiu todas as aulas liberadas.</span>
                <span className="esv-nextcard__meta">As próximas aparecem aqui assim que forem publicadas.</span>
              </span>
            </div>
          )}
        </Reveal>

        {/* ===== Tarefas ===== */}
        <Reveal className="esv-dash__tasks">
          <section className="esv-panel esv-glass h-full">
            <p className="esv-panel__kicker">Suas tarefas</p>
            {tasks.length === 0 ? (
              <div className="esv-empty">
                <span className="esv-empty__icon">
                  <Check size={18} strokeWidth={2.4} />
                </span>
                <p>Nada pendente agora. Bom momento para avançar uma aula.</p>
              </div>
            ) : (
              <ul className="esv-tasks">
                {tasks.map((t) => {
                  const due = t.due_date ? new Date(t.due_date) : null;
                  const late = due ? due.getTime() < now.getTime() - DAY : false;
                  return (
                    <li key={t.id} className="esv-task">
                      <span className={`esv-task__dot${t.status === "em-execucao" ? " is-doing" : ""}`} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="esv-task__t">{t.title}</span>
                        {t.description && <span className="esv-task__d">{t.description}</span>}
                      </span>
                      {due && (
                        <span className={`esv-task__due${late ? " is-late" : ""}`}>
                          {due.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </Reveal>
      </div>

      {/* ===== Os 5 pilares ===== */}
      <Reveal className="esv-dash__pillars">
        <header className="esv-dash__head">
          <div>
            <p className="esv-row__kicker">Método completo</p>
            <h2 className="esv-row__title">Os 5 pilares</h2>
          </div>
          <Link href="/membros/aulas" className="esv-link">
            Ver todas as aulas <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </header>
        <div className="esv-pgrid">
          {pillars.map((p, i) => {
            const isCur = client.current_pillar === p.n;
            const w = p.total ? (p.done / p.total) * 100 : 0;
            return (
              <Link
                key={p.n}
                href={`/membros/aulas#pilar-${p.n}`}
                className={`esv-pcard esv-glass${isCur ? " is-current" : ""}${p.locked ? " is-locked" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="esv-pcard__top">
                  <span className="esv-pcard__num">{pad(p.n)}</span>
                  {isCur ? (
                    <span className="esv-pcard__tag">Agora</span>
                  ) : p.locked ? (
                    <Lock size={14} strokeWidth={2} className="esv-pcard__lock" />
                  ) : p.total > 0 && p.done === p.total ? (
                    <span className="esv-pcard__ok"><Check size={12} strokeWidth={3} /></span>
                  ) : null}
                </span>
                <span className="esv-pcard__name">{p.info.name}</span>
                <span className="esv-pcard__tese">{p.info.tese}</span>
                <span className="esv-pcard__foot">
                  <span className="esv-row__bar"><span style={{ width: `${w}%` }} /></span>
                  <span>{p.done}/{p.total}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
