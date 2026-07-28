import Link from "next/link";
import { Play, Lock, Check } from "lucide-react";
import { Lesson } from "@/types/client";
import { lessonCover } from "@/lib/youtube";

interface Props {
  lesson: Lesson & { is_locked?: boolean };
  pillarLabel: string;
  watchedPct: number;
  completed: boolean;
}

export function LessonCard({ lesson, pillarLabel, watchedPct, completed }: Props) {
  const cover = lessonCover(lesson);
  const hasPoster = !!cover.url && !cover.isThumb; // pôster custom já traz título
  const locked = !!lesson.is_locked;

  const inner = (
    <div className="esv-cover">
      {cover.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover.url}
          alt={lesson.title}
          className={cover.isThumb ? "is-thumb" : ""}
          loading="lazy"
        />
      ) : null}
      <div className="esv-cover__veil" />

      {locked ? (
        <div className="esv-lock">
          <Lock size={14} />
        </div>
      ) : (
        <div className="esv-cover__play">
          <span className="esv-play-btn">
            <Play size={22} fill="#0C0C0C" />
          </span>
        </div>
      )}

      {completed && !locked && (
        <div className="esv-cover__done">
          <Check size={14} />
        </div>
      )}

      {!hasPoster && (
        <>
          <span className="esv-cover__eyebrow">{pillarLabel}</span>
          <p className="esv-cover__title">{lesson.title}</p>
        </>
      )}

      {watchedPct > 0 && !completed && (
        <div className="esv-cover__progress">
          <span style={{ width: `${Math.min(100, watchedPct)}%` }} />
        </div>
      )}
    </div>
  );

  if (locked) {
    return (
      <div
        className="esv-card is-locked"
        title="Disponível em breve"
        aria-disabled
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/membros/aulas/${lesson.id}`} className="esv-card">
      {inner}
    </Link>
  );
}
