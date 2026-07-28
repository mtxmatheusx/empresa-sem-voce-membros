// Helpers de vídeo — aceita link do YouTube (embed/thumb) ou mp4 direto.

export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const m = url.match(re);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  try {
    const v = new URL(url).searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  } catch {
    /* not a URL */
  }
  return null;
}

export function isYoutube(url?: string | null): boolean {
  return youtubeId(url) !== null;
}

export function youtubeEmbed(url?: string | null): string | null {
  const id = youtubeId(url);
  return id
    ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`
    : null;
}

export function youtubeThumb(url?: string | null): string | null {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// Capa do card: pôster custom > thumb do YouTube > nada (gradiente)
export function lessonCover(lesson: {
  cover_url?: string | null;
  video_url?: string | null;
}): { url: string | null; isThumb: boolean } {
  if (lesson.cover_url) return { url: lesson.cover_url, isThumb: false };
  const thumb = youtubeThumb(lesson.video_url);
  return { url: thumb, isThumb: thumb !== null };
}
