"use client";

// Player da aula. Com YouTube, usa a IFrame API para registrar sozinho quanto
// o aluno assistiu (watched_pct) e conclui a aula ao passar de 90%.

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { youtubeId } from "@/lib/youtube";

const AUTO_COMPLETE_AT = 90;

type YTPlayer = {
  getCurrentTime(): number;
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

export function LessonPlayer({
  videoUrl,
  title,
  lessonId,
  clientId,
  initialPct,
  completed,
}: {
  videoUrl: string | null;
  title: string;
  lessonId: string;
  clientId: string;
  initialPct: number;
  completed: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const vid = youtubeId(videoUrl);

  useEffect(() => {
    if (!vid || !host.current) return;
    let player: YTPlayer | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let best = initialPct || 0;
    let saved = best;
    let done = completed;
    let cancelled = false;
    const supabase = createClient();

    const save = async (force = false) => {
      if (!player) return;
      const d = player.getDuration();
      if (!d) return;
      const pct = Math.min(100, Math.round((player.getCurrentTime() / d) * 100));
      if (pct > best) best = pct;
      const reachDone = !done && best >= AUTO_COMPLETE_AT;
      if (!force && !reachDone && best - saved < 5) return;
      const now = new Date().toISOString();
      const row: Record<string, unknown> = {
        client_id: clientId,
        lesson_id: lessonId,
        watched_pct: reachDone ? 100 : best,
        last_watched_at: now,
      };
      if (reachDone) row.completed_at = now;
      const { error } = await supabase
        .from("lesson_progress")
        .upsert(row, { onConflict: "client_id,lesson_id" });
      if (error) return;
      saved = best;
      if (reachDone) {
        done = true;
        window.dispatchEvent(new CustomEvent(LESSON_COMPLETE_EVENT, { detail: { lessonId } }));
      }
    };

    // o YouTube troca o nó por um iframe; criamos um nó próprio fora do React
    const box = host.current;
    const mount = document.createElement("div");
    box.appendChild(mount);

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(mount, {
        videoId: vid,
        playerVars: { rel: 0, modestbranding: 1, color: "white", playsinline: 1 },
        events: {
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
      box.replaceChildren();
    };
  }, [vid, lessonId, clientId, initialPct, completed]);

  if (vid) {
    return (
      <div className="esv-embed esv-player">
        <div ref={host} className="esv-player__mount" aria-label={title} />
      </div>
    );
  }
  if (videoUrl) {
    return (
      <div className="esv-embed esv-player">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={videoUrl} controls playsInline />
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
