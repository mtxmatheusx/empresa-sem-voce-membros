"use client";

// Peças de movimento do catálogo: hero com parallax, prateleira com setas,
// revelação ao rolar e barra de pilares que acompanha a seção visível.
// Tudo respeita prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Hero: camadas que andam com o scroll e com o cursor ---------- */
export function ParallaxHero({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    let mx = 0, my = 0, tx = 0, ty = 0;

    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const sy = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      el.style.setProperty("--sy", sy.toFixed(4));
      el.style.setProperty("--mx", tx.toFixed(4));
      el.style.setProperty("--my", ty.toFixed(4));
      // segue amortecendo até o cursor parar
      if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      schedule();
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
      schedule();
    };
    const onVis = () => {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

/* ---------- Revela o bloco quando entra na tela ---------- */
export function Reveal({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced() || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className={cn("esv-reveal", seen && "is-in", className)}>
      {children}
    </div>
  );
}

/* ---------- Prateleira com setas e bordas que somem ---------- */
export function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft < max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth * 0.8,
      behavior: reduced() ? "auto" : "smooth",
    });
  };

  return (
    <div
      className={cn("esv-railwrap", edges.left && "has-left", edges.right && "has-right")}
    >
      <div ref={ref} className="esv-rail" role="list" aria-label={label}>
        {children}
      </div>
      <button
        type="button"
        className="esv-railbtn esv-railbtn--l esv-glass"
        onClick={() => go(-1)}
        aria-label="Anterior"
        tabIndex={edges.left ? 0 : -1}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="esv-railbtn esv-railbtn--r esv-glass"
        onClick={() => go(1)}
        aria-label="Próximo"
        tabIndex={edges.right ? 0 : -1}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ---------- Barra de pilares: acompanha a seção visível ---------- */
export function PillarNav({ items }: { items: { id: string; short: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    // ativo = última seção cujo topo já passou de 35% da altura da tela;
    // no fim da página, a última seção
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = sections[0].id;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) cur = s.id;
      }
      const atEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atEnd) cur = sections[sections.length - 1].id;
      setActive((prev) => (prev === cur ? prev : cur));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // mantém o chip ativo visível quando a barra rola no celular
  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!bar || !chip) return;
    const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2;
    bar.scrollTo({ left, behavior: reduced() ? "auto" : "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: reduced() ? "auto" : "smooth" });
  };

  return (
    <div className="esv-pnav">
      <LayoutGroup id="pnav">
        <div ref={barRef} className="esv-pnav__bar esv-glass">
          {items.map((i) => (
            <button
              key={i.id}
              type="button"
              data-id={i.id}
              onClick={() => jump(i.id)}
              className={cn("esv-pnav__chip", active === i.id && "is-active")}
            >
              {active === i.id && (
                <motion.span
                  layoutId="esv-pnav-pill"
                  className="esv-pnav__pill"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative esv-pnav__num">{i.short}</span>
              <span className="relative">{i.label}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
