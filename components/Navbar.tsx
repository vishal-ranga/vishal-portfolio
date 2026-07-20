"use client";

import { useEffect, useState } from "react";
import { Menu, X, ArrowDownToLine, Search } from "lucide-react";
import { site } from "@/data/site";
import { pipelineStages } from "@/data/pipeline";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(pipelineStages.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }

  function openPalette() {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }

  const activeIndex = pipelineStages.findIndex((s) => s.id === activeId);

  return (
    <header
      className={
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300 " +
        (scrolled ? "bg-surface/85 backdrop-blur-md border-b border-line" : "bg-transparent")
      }
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-6">
        <a href="#top" className="font-display font-semibold text-ink tracking-tight text-[15px] shrink-0">
          Vishal Ranga
          <span className="text-emerald">.</span>
        </a>

        {/* Pipeline stage nav — desktop */}
        <nav aria-label="Site pipeline" className="hidden lg:flex items-center flex-1 justify-center">
          <ol className="flex items-center">
            {pipelineStages.map((stage, i) => {
              const isActive = i === activeIndex;
              const isPast = activeIndex >= 0 && i < activeIndex;
              return (
                <li key={stage.id} className="flex items-center">
                  <button
                    onClick={() => goTo(stage.id)}
                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-colors"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      {isActive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
                      )}
                      <span
                        className={
                          "relative inline-flex rounded-full h-2 w-2 transition-colors " +
                          (isActive || isPast ? "bg-emerald" : "bg-line-strong group-hover:bg-ink-faint")
                        }
                      />
                    </span>
                    <span
                      className={
                        "font-mono text-xs transition-colors whitespace-nowrap " +
                        (isActive ? "text-ink font-medium" : "text-ink-faint group-hover:text-ink-soft")
                      }
                    >
                      {stage.label}
                    </span>
                  </button>
                  {i < pipelineStages.length - 1 && (
                    <span
                      className={
                        "h-px w-6 mx-0.5 transition-colors " + (isPast ? "bg-emerald/50" : "bg-line")
                      }
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={openPalette}
            className="inline-flex items-center gap-2 text-sm text-ink-soft border border-line rounded-full pl-3 pr-2 py-1.5 hover:border-emerald hover:text-ink transition-colors"
            aria-label="Open command palette"
          >
            <Search size={13} />
            <span className="font-mono text-xs hidden xl:inline">search</span>
            <kbd className="font-mono text-[10px] bg-bg border border-line rounded px-1.5 py-0.5 text-ink-faint">
              ⌘K
            </kbd>
          </button>
          <a
            href={site.resumeUrl}
            download
            className="inline-flex items-center gap-2 text-sm font-medium text-ink border border-line-strong rounded-full px-4 py-2 hover:border-emerald hover:text-emerald transition-colors"
          >
            <ArrowDownToLine size={15} strokeWidth={2} />
            Resume
          </a>
          <a
            href="#contact"
            className="text-sm font-medium bg-ink text-white rounded-full px-4 py-2 hover:bg-emerald-deep transition-colors"
          >
            Get in touch
          </a>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={openPalette} aria-label="Search" className="text-ink-soft p-1.5">
            <Search size={19} />
          </button>
          <button aria-label="Toggle menu" className="text-ink p-1.5" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-surface border-t border-line px-6 py-4 flex flex-col gap-1">
          {pipelineStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => goTo(stage.id)}
              className="flex items-center gap-3 py-2.5 text-left"
            >
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (stage.id === activeId ? "bg-emerald" : "bg-line-strong")
                }
              />
              <span className="font-mono text-xs text-ink-faint w-20">{stage.label}</span>
              <span className="text-sm text-ink">{stage.description}</span>
            </button>
          ))}
          <a href={site.resumeUrl} download className="text-sm font-medium text-emerald mt-3">
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
