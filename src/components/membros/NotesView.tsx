import Link from "next/link";
import { Lesson, LessonNote, PILLAR_INFO } from "@/types/client";
import { CopyNotes } from "@/components/membros/CopyNotes";
import { ArrowRight, NotebookPen } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");
const groupName = (n: number) =>
  n === 0 ? "Boas-vindas" : `Pilar ${pad(n)} · ${PILLAR_INFO[n]?.name ?? ""}`;

export function NotesView({
  notes,
  lessons,
}: {
  notes: LessonNote[];
  lessons: Lesson[];
}) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const items = notes
    .filter((n) => n.content.trim() && byId.has(n.lesson_id))
    .map((n) => ({ note: n, lesson: byId.get(n.lesson_id)! }))
    .sort(
      (a, b) =>
        a.lesson.pillar_number - b.lesson.pillar_number ||
        a.lesson.order_in_pillar - b.lesson.order_in_pillar
    );

  const groups = [0, 1, 2, 3, 4, 5]
    .map((p) => ({ p, items: items.filter((i) => i.lesson.pillar_number === p) }))
    .filter((g) => g.items.length);

  const plain = groups
    .map(
      (g) =>
        `${groupName(g.p).toUpperCase()}\n\n` +
        g.items.map((i) => `${i.lesson.title}\n${i.note.content.trim()}`).join("\n\n")
    )
    .join("\n\n————\n\n");

  return (
    <div className="esv-page esv-notespage">
      <header className="esv-notespage__head esv-rise">
        <div>
          <p className="t-eyebrow">Seu plano de ação</p>
          <h1 className="esv-lesson__title">Minhas anotações</h1>
          <p className="esv-lesson__desc">
            Tudo o que você escreveu nas aulas, na ordem do método. Use como roteiro do que aplicar
            na empresa.
          </p>
        </div>
        {items.length > 0 && <CopyNotes text={plain} />}
      </header>

      {items.length === 0 ? (
        <section className="esv-locked esv-glass esv-rise" style={{ "--d": 1 } as React.CSSProperties}>
          <div className="esv-locked__in">
            <span className="esv-locked__icon">
              <NotebookPen size={24} strokeWidth={1.8} />
            </span>
            <p className="esv-row__kicker">Nada por aqui ainda</p>
            <p className="esv-lesson__desc">
              Em cada aula há um campo para anotar o que você vai aplicar. O que escrever lá aparece
              reunido nesta página.
            </p>
            <Link href="/membros/aulas" className="esv-btn esv-btn--ghost esv-glass">
              Ir para as aulas <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </section>
      ) : (
        <div className="esv-notespage__groups">
          {groups.map((g, gi) => (
            <section
              key={g.p}
              className="esv-notespage__group esv-rise"
              style={{ "--d": gi + 1 } as React.CSSProperties}
            >
              <p className="esv-row__kicker">
                {groupName(g.p)}
              </p>
              <div className="esv-notespage__list">
                {g.items.map(({ note, lesson }) => (
                  <article key={note.id} className="esv-panel esv-glass esv-notecard">
                    <header className="esv-notecard__head">
                      <Link href={`/membros/aulas/${lesson.id}`} className="esv-notecard__t">
                        {lesson.title}
                        <ArrowRight size={15} strokeWidth={2} />
                      </Link>
                      <span className="esv-notecard__date">
                        {new Date(note.updated_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </header>
                    <p className="esv-panel__body">{note.content.trim()}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
