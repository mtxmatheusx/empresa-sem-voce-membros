"use client";

// Player da aula. Com YouTube, usa a IFrame API para registrar sozinho quanto
// o aluno assistiu (watched_pct) e conclui a aula ao passar de 90%.

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { youtubeId } from "@/lib/youtube";

const AUTO_COMPLETE_AT = 90;

type YTPlayer = {
  getCurrentTime(): number;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: Record<string, (e: { data: number }) => void>;
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

export const LESSON_COMPLETE_EVENT = "esv:lesson-complete";

const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}` : `${m}:${String(ss).padStart(2, "0")}`;
};

export function LessonPlayer({
  videoUrl,
  title,
  lessonId,
  clientId,
  initialPct,
  initialPosition = 0,
  completed,
}: {
  videoUrl: string | null;
  title: string;
  lessonId: string;
  clientId: string;
  initialPct: number;
  initialPosition?: number;
  completed: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const vid = youtubeId(videoUrl);
  const [resumeAt, setResumeAt] = useState<number | null>(null);

  // valores iniciais em ref: a página recarrega os dados quando a aula é
  // concluída, e isso não pode reiniciar o player no meio do vídeo
  const start = useRef({ pct: initialPct || 0, pos: initialPosition || 0, done: completed });

  useEffect(() => {
    if (!resumeAt) return;
    const t = setTimeout(() => setResumeAt(null), 4500);
    return () => clearTimeout(t);
  }, [resumeAt]);

  useEffect(() => {
    let player: YTPlayer | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let best = start.current.pct;
    let savedPct = best;
    let savedPos = start.current.pos;
    let done = start.current.done;
    let cancelled = false;
    const supabase = createClient();

    // lê tempo/duração do YouTube ou do <video>
    const read = (): { t: number; d: number } | null => {
      if (player) return { t: player.getCurrentTime(), d: player.getDuration() };
      const v = videoEl.current;
      if (v && v.duration) return { t: v.currentTime, d: v.duration };
      return null;
    };

    const save = async (force = false) => {
      const r = read();
      if (!r || !r.d) return;
      const pos = Math.floor(r.t);
      const pct = Math.min(100, Math.round((r.t / r.d) * 100));
      if (pct > best) best = pct;
      const reachDone = !done && best >= AUTO_COMPLETE_AT;
      if (!force && !reachDone && best - savedPct < 5 && Math.abs(pos - savedPos) < 10) return;
      const now = new Date().toISOString();
      const row: Record<string, unknown> = {
        client_id: clientId,
        lesson_id: lessonId,
        watched_pct: reachDone ? 100 : best,
        // perto do fim, a próxima visita começa do início
        last_position_seconds: r.d - r.t < 20 ? 0 : pos,
        last_watched_at: now,
      };
      if (reachDone) row.completed_at = now;
      const { error } = await supabase
        .from("lesson_progress")
        .upsert(row, { onConflict: "client_id,lesson_id" });
      if (error) return;
      savedPct = best;
      savedPos = pos;
      if (reachDone) {
        done = true;
        window.dispatchEvent(new CustomEvent(LESSON_COMPLETE_EVENT, { detail: { lessonId } }));
      }
    };

    const startAt = start.current.pos > 10 ? start.current.pos : 0;
    const box = host.current;
    const v = videoEl.current;

    if (vid && box) {
      // o YouTube troca o nó por um iframe; criamos um nó próprio fora do React
      const mount = document.createElement("div");
      box.appendChild(mount);
      loadYouTubeApi().then((YT) => {
        if (cancelled) return;
        player = new YT.Player(mount, {
          videoId: vid,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            color: "white",
            playsinline: 1,
            ...(startAt ? { start: startAt } : {}),
          },
          events: {
            onReady: () => {
              if (startAt) setResumeAt(startAt);
            },
            onStateChange: (e) => {
              // 1 = tocando, 2 = pausado, 0 = terminou
              if (e.data === 1 && !timer) timer = setInterval(() => save(), 5000);
              if (e.data !== 1 && timer) {
                clearInterval(timer);
                timer = null;
              }
              if (e.data === 2 || e.data === 0) save(true);
            },
          },
        });
      });
    } else if (v) {
      const onMeta = () => {
        if (startAt && startAt < v.duration - 20) {
          v.currentTime = startAt;
          setResumeAt(startAt);
        }
      };
      const onPlay = () => {
        if (!timer) timer = setInterval(() => save(), 5000);
      };
      const onStop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        save(true);
      };
      v.addEventListener("loadedmetadata", onMeta);
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onStop);
      v.addEventListener("ended", onStop);
    }

    const onHide = () => {
      if (document.hidden) save(true);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onHide);
      if (timer) clearInterval(timer);
      save(true);
      player?.destroy();
      box?.replaceChildren();
    };
  }, [vid, lessonId, clientId]);

  const resumeChip = resumeAt ? (
    <div className="esv-resume esv-glass" role="status">
      Continuando de <strong>{fmtTime(resumeAt)}</strong>
    </div>
  ) : null;

  if (vid) {
    return (
      <div className="esv-embed esv-player">
        <div ref={host} className="esv-player__mount" aria-label={title} />
        {resumeChip}
      </div>
    );
  }
  if (videoUrl) {
    return (
      <div className="esv-embed esv-player">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={videoEl} src={videoUrl} controls playsInline />
        {resumeChip}
      </div>
    );
  }
  return (
    <div className="esv-embed esv-player esv-player--empty">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-esv-mark.png" alt="" />
        <p>O vídeo desta aula ainda não foi publicado.</p>
      </div>
    </div>
  );
}
