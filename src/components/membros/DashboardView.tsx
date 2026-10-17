import Link from "next/link";
import { Client, ClientTask, Lesson, LessonProgress, PILLAR_INFO } from "@/types/client";
import { Reveal } from "@/components/membros/motion";
import { lessonCover } from "@/lib/youtube";

const pad = (n: number) => String(n).padStart(2, "0");
const ROMAN = ["", "I", "II", "III", "IV", "V"];
const DAY = 86_400_000;
const PROGRAM_DAYS = 120;
const PORTRAIT =
  "https://gdbvrexbpiwdubusciwm.supabase.co/storage/v1/object/public/esv-hero/matheus.jpg";
const WHATSAPP = "https://wa.me/5551991443171";

const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

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

  const start = new Date(client.started_at);
  const end = client.ends_at ? new Date(client.ends_at) : new Date(start.getTime() + PROGRAM_DAYS * DAY);
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY));
  const day = Math.min(totalDays, Math.max(1, Math.floor((now.getTime() - start.getTime()) / DAY) + 1));
  const daysLeft = Math.max(0, totalDays - day);

  const done = lessons.filter((l) => progressByLesson.get(l.id)?.completed_at).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;

  const playable = lessons.filter((l) => !l.is_locked);
  const inProgress = playable
    .map((l) => ({ l, p: progressByLesson.get(l.id) }))
    .filter((x) => x.p && !x.p.completed_at && (x.p.watched_pct ?? 0) > 0)
    .sort((a, b) => (b.p?.last_watched_at ?? "").localeCompare(a.p?.last_watched_at ?? ""))[0]?.l;
  const next = inProgress ?? playable.find((l) => !progressByLesson.get(l.id)?.completed_at);
  const nextProg = next ? progressByLesson.get(next.id) : undefined;
  const nextCover = next ? lessonCover(next) : null;

  const cur = client.current_pillar;
  const current = PILLAR_INFO[cur] ?? PILLAR_INFO[1];
  const pillars = [1, 2, 3, 4, 5].map((n) => {
    const ls = lessons.filter((l) => l.pillar_number === n);
    return {
      n,
      info: PILLAR_INFO[n],
      total: ls.length,
      done: ls.filter((l) => progressByLesson.get(l.id)?.completed_at).length,
      locked: ls.length > 0 && ls.every((l) => l.is_locked),
    };
  });

  return (
    <div className="ed-page">
      {/* ===== Abertura: texto + retrato ===== */}
      <section className="ed-wrap ed-spread ed-home">
        <div className="ed-home__tx">
          <p className="ed-label is-gold ed-in" style={{ "--d": 0 } as React.CSSProperties}>
            {firstName ? `${firstName}, seu programa` : "Seu programa"}
          </p>
          <h1 className="ed-h1 ed-in" style={{ "--d": 1 } as React.CSSProperties}>
            Dia {day} <em>de {totalDays}.</em>
          </h1>
          <p className="ed-lede ed-in" style={{ "--d": 2 } as React.CSSProperties}>
            {cur === 0
              ? "Você está no prólogo. Comece pelo alinhamento inicial e siga para o primeiro pilar."
              : `Você está no capítulo ${ROMAN[cur]}, ${current.name}. ${current.tese}`}
          </p>

          <div className="ed-time ed-in" style={{ "--d": 3 } as React.CSSProperties}>
            <span className="ed-bar is-lg">
              <span style={{ width: `${(day / totalDays) * 100}%` }} />
            </span>
            <div className="ed-time__legend">
              <span>{fmt(start)}</span>
              <span>{fmt(end)}</span>
            </div>
          </div>

          <dl className="ed-figs is-3 ed-in" style={{ "--d": 4 } as React.CSSProperties}>
            <div>
              <dt className="ed-fig">{daysLeft}</dt>
              <dd>{daysLeft === 1 ? "dia pela frente" : "dias pela frente"}</dd>
            </div>
            <div>
              <dt className="ed-fig">{pct}%</dt>
              <dd>das aulas concluídas</dd>
            </div>
            <div>
              <dt className="ed-fig">
                {done}
                <small>/{lessons.length}</small>
              </dt>
              <dd>aulas assistidas</dd>
            </div>
          </dl>
        </div>

        <figure className="ed-portrait ed-in" style={{ "--d": 2 } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PORTRAIT} alt="Matheus Martins" />
          <figcaption>
            <span>Matheus Martins</span>
            <span>Seu mentor no programa</span>
          </figcaption>
        </figure>
      </section>

      {/* ===== A seguir: página dupla ===== */}
      <section className="ed-sec ed-alt">
        <Reveal className="ed-wrap">
          {next ? (
            <Link href={`/membros/aulas/${next.id}`} className="ed-spread is-rev ed-next">
              <figure className="ed-poster is-lg">
                {nextCover?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={nextCover.url} alt="" />
                ) : (
                  <span className="ed-poster__blank">
                    <span className="ed-rn">{ROMAN[next.pillar_number] || "—"}</span>
                  </span>
                )}
              </figure>
              <div className="ed-next__tx">
                <p className="ed-label is-gold">{inProgress ? "Continue de onde parou" : "A seguir"}</p>
                <h2 className="ed-h2 is-xl">{next.title}</h2>
                <p className="ed-body">
                  {next.pillar_number === 0
                    ? "Prólogo · Boas-vindas"
                    : `Capítulo ${ROMAN[next.pillar_number]} · ${PILLAR_INFO[next.pillar_number]?.name}`}
                </p>
                {(nextProg?.watched_pct ?? 0) > 0 && (
                  <div className="ed-next__prog">
                    <span className="ed-bar">
                      <span style={{ width: `${nextProg!.watched_pct}%` }} />
                    </span>
                    <span className="ed-label">{nextProg!.watched_pct}% assistido</span>
                  </div>
                )}
                <span className="ed-btn">
                  {inProgress ? "Continuar" : "Assistir agora"} <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ) : (
            <div className="ed-chap">
              <p className="ed-label is-gold">Tudo em dia</p>
              <div>
                <h2 className="ed-h2">Você assistiu todas as aulas liberadas.</h2>
                <p className="ed-lede">As próximas aparecem aqui assim que forem publicadas.</p>
              </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* ===== Tarefas ===== */}
      <section className="ed-sec">
        <Reveal className="ed-wrap ed-chap">
          <div>
            <p className="ed-label is-gold">Para esta semana</p>
            <h2 className="ed-h2">Suas tarefas</h2>
          </div>
          {tasks.length === 0 ? (
            <p className="ed-lede">Nada pendente agora. Bom momento para avançar uma aula.</p>
          ) : (
            <ol className="ed-facts">
              {tasks.map((t, i) => {
                const due = t.due_date ? new Date(t.due_date) : null;
                const late = due ? due.getTime() < now.getTime() - DAY : false;
                return (
                  <li key={t.id}>
                    <span className="ed-facts__n">{pad(i + 1)}</span>
                    <span className="ed-facts__tx">
                      <span className="ed-facts__t">{t.title}</span>
                      {t.description && <span className="ed-facts__d">{t.description}</span>}
                    </span>
                    <span className={`ed-label${late ? " is-alert" : ""}`}>
                      {due
                        ? `${late ? "Atrasada · " : ""}${due.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
                        : t.status === "em-execucao"
                          ? "Em execução"
                          : "Pendente"}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </Reveal>
      </section>

      {/* ===== Os cinco pilares ===== */}
      <section className="ed-sec ed-alt">
        <Reveal className="ed-wrap">
          <div className="ed-chap">
            <p className="ed-label is-gold">O método</p>
            <div>
              <h2 className="ed-h2">Os cinco pilares</h2>
              <p className="ed-lede">Um capítulo por vez. O destaque mostra onde você está agora.</p>
            </div>
          </div>
          <ol className="ed-journey">
            {pillars.map((p) => {
              const isCur = cur === p.n;
              return (
                <li key={p.n} className={`${isCur ? "is-current" : ""}${p.locked ? " is-locked" : ""}`}>
                  <Link href={`/membros/aulas#pilar-${p.n}`}>
                    <span className="ed-rn is-lg">{ROMAN[p.n]}</span>
                    <span className="ed-journey__name">
                      {p.info.name}
                      <span className="ed-label">
                        {isCur ? "Agora" : p.locked ? "Em breve" : p.total && p.done === p.total ? "Concluído" : `${p.done} de ${p.total}`}
                      </span>
                    </span>
                    <span className="ed-journey__tese">{p.info.tese}</span>
                    <span className="ed-bar">
                      <span style={{ width: `${p.total ? (p.done / p.total) * 100 : 0}%` }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </section>

      {/* ===== Concierge ===== */}
      <section className="ed-sec">
        <Reveal className="ed-wrap ed-concierge">
          <p className="ed-label is-gold">Acompanhamento</p>
          <h2 className="ed-h2 is-xl">
            Travou em algum ponto? <em>Fale direto comigo.</em>
          </h2>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="ed-btn is-ghost">
            Abrir conversa no WhatsApp <span aria-hidden>→</span>
          </a>
        </Reveal>
      </section>
    </div>
  );
}
