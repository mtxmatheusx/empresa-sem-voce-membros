"use client";

import { useRef } from "react";
import Link from "next/link";
import { Play, Lock, Check, Clock } from "lucide-react";
import { Lesson } from "@/types/client";
import { lessonCover } from "@/lib/youtube";

interface Props {
  lesson: Lesson & { is_locked?: boolean };
  pillarLabel: string;
  watchedPct: number;
  completed: boolean;
  index?: number;
}

function minutes(sec: number | null) {
  if (!sec || sec <= 0) return null;
  return `${Math.max(1, Math.round(sec / 60))} min`;
}

export function LessonCard({ lesson, pillarLabel, watchedPct, completed, index = 0 }: Props) {
  const cover = lessonCover(lesson);
  const hasPoster = !!cover.url && !cover.isThumb; // pôster custom já traz título
  const locked = !!lesson.is_locked;
  const dur = minutes(lesson.duration_seconds);
  const ref = useRef<HTMLDivElement>(null);

  // inclinação 3D + reflexo que segue o cursor (só mouse; toque fica parado)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 9}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 11}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

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
      ) : (
        <div className="esv-cover__blank" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-esv-mark.png" alt="" />
        </div>
      )}
      <div className="esv-cover__veil" />
      <div className="esv-cover__sheen" aria-hidden />

      {locked ? (
        <div className="esv-lock">
          <Lock size={12} strokeWidth={2.2} />
          Em breve
        </div>
      ) : (
        <div className="esv-cover__play">
          <span className="esv-play-btn">
            <Play size={20} fill="currentColor" strokeWidth={0} />
          </span>
        </div>
      )}

      {completed && !locked && (
        <div className="esv-cover__done" title="Concluída">
          <Check size={13} strokeWidth={2.6} />
        </div>
      )}

      {!hasPoster && (
        <>
          <span className="esv-cover__eyebrow">{pillarLabel}</span>
          <p className="esv-cover__title">{lesson.title}</p>
        </>
      )}

      {dur && !locked && (
        <span className="esv-cover__dur">
          <Clock size={11} strokeWidth={2.2} />
          {dur}
        </span>
      )}

      {watchedPct > 0 && !completed && (
        <div className="esv-cover__progress">
          <span style={{ width: `${Math.min(100, watchedPct)}%` }} />
        </div>
      )}
    </div>
  );

  const style = { "--i": index } as React.CSSProperties;

  if (locked) {
    return (
      <div
        ref={ref}
        role="listitem"
        className="esv-card is-locked"
        title="Disponível em breve"
        aria-disabled
        style={style}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="listitem"
      className="esv-card"
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Link href={`/membros/aulas/${lesson.id}`} className="esv-card__link" aria-label={lesson.title}>
        {inner}
      </Link>
    </div>
  );
}
