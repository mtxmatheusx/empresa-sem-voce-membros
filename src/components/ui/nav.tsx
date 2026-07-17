"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Nav({ showCta = true }: { showCta?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "glass-nav h-14" : "bg-transparent h-20"
      )}
    >
      <div className="container-x h-full flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="sm" showText={!scrolled} />
        </Link>

        <nav className="flex items-center gap-6 md:gap-8">
          <a
            href="https://instagram.com/matheusmartins.x"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-[13px] text-[#6B6862] hover:text-[#0F0E0C] transition-colors"
          >
            Instagram
          </a>
          {showCta && (
            <Link
              href="/aplicar"
              className="btn-pill bg-[#0F0E0C] text-white px-5 py-2 text-[13px] font-medium hover:bg-[#1F1D1B]"
            >
              Aplicar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
