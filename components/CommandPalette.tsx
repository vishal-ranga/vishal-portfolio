"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  ArrowRight,
  Mail,
  Download,
  FolderGit2,
  Compass,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { pipelineStages } from "@/data/pipeline";

interface Command {
  id: string;
  label: string;
  hint?: string;
  keywords: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const goToSection = useCallback((id: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, [router]);

  const commands: Command[] = useMemo(() => {
    const sectionCommands: Command[] = pipelineStages.map((s) => ({
      id: `goto-${s.id}`,
      label: `cd ~/${s.id}`,
      hint: s.description,
      keywords: `${s.id} ${s.label} ${s.description}`,
      icon: Compass,
      run: () => goToSection(s.id),
    }));

    const projectCommands: Command[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: `open ${p.slug}`,
      hint: p.name,
      keywords: `${p.name} ${p.slug} ${p.stack.join(" ")} project case study`,
      icon: FolderGit2,
      run: () => router.push(`/projects/${p.slug}`),
    }));

    const actionCommands: Command[] = [
      {
        id: "resume",
        label: "download resume.pdf",
        keywords: "resume cv download pdf",
        icon: Download,
        run: () => window.open(site.resumeUrl, "_blank"),
      },
      {
        id: "GitHub",
        label: "open GitHub",
        keywords: "GitHub source code repos",
        icon: GitHubIcon,
        run: () => window.open(site.GitHub, "_blank"),
      },
      {
        id: "LinkedIn",
        label: "open LinkedIn",
        keywords: "LinkedIn profile network",
        icon: LinkedInIcon,
        run: () => window.open(site.LinkedIn, "_blank"),
      },
      {
        id: "email",
        label: `mail ${site.email}`,
        keywords: "email contact mail reach out",
        icon: Mail,
        run: () => window.open(`mailto:${site.email}`, "_self"),
      },
    ];

    return [...sectionCommands, ...projectCommands, ...actionCommands];
  }, [goToSection, router]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.keywords.toLowerCase().includes(q));
  }, [commands, query]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) setActiveIndex(0);
          else {
            setQuery("");
            setActiveIndex(0);
          }
          return next;
        });
      } else if (e.key === "Escape") {
        closePalette();
      }
    }
    function onOpenEvent() {
      openPalette();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, [closePalette, openPalette]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) {
        cmd.run();
        closePalette();
      }
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 bg-ink/40 backdrop-blur-sm"
      onClick={closePalette}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <Terminal size={16} className="text-emerald shrink-0" />
          <span className="font-mono text-ink-faint text-sm shrink-0">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleListKeyDown}
            placeholder="run a command or search..."
            className="flex-1 bg-transparent outline-none font-mono text-sm text-ink placeholder:text-ink-faint"
          />
          <kbd className="hidden sm:block font-mono text-[10px] text-ink-faint border border-line rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-ink-faint font-mono">no matches — try another command</p>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.run();
                closePalette();
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={
                "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors " +
                (i === activeIndex ? "bg-emerald-tint" : "hover:bg-bg")
              }
            >
              <cmd.icon size={15} className={i === activeIndex ? "text-emerald-deep" : "text-ink-faint"} />
              <span className="font-mono text-sm text-ink flex-1">{cmd.label}</span>
              {cmd.hint && <span className="text-xs text-ink-faint truncate max-w-[40%]">{cmd.hint}</span>}
              {i === activeIndex && <ArrowRight size={13} className="text-emerald-deep shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
