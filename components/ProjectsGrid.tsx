"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, PlayCircle, ChevronDown } from "lucide-react";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { Spotlight } from "./Spotlight";
import { projects } from "@/data/projects";

export function ProjectsGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="projects" className="pb-24 sm:pb-28 bg-surface">
      <PipelineSeam label="build" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects"
          description="Three infrastructure projects. Run the deploy log for a quick look, or read the full case study for the how and why."
        />

        <div className="mt-14 grid gap-6">
          {projects.map((project, i) => {
            const isOpen = expanded === project.slug;
            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
              <Spotlight
                className={
                  "block rounded-2xl border p-7 sm:p-9 transition-colors " +
                  (isOpen ? "border-emerald/60" : "border-line hover:border-emerald/40")
                }
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <p className="font-mono text-xs text-emerald mb-3">0{i + 1} / case study</p>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink mb-3">
                      {project.name}
                    </h3>
                    <p className="text-ink-soft text-sm sm:text-base leading-relaxed max-w-2xl">
                      {project.tagline}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[11px] text-ink-soft bg-emerald-tint/60 border border-line rounded-full px-2.5 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 shrink-0">
                    <button
                      onClick={() => setExpanded(isOpen ? null : project.slug)}
                      className={
                        "inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-full px-4 py-2.5 transition-colors whitespace-nowrap border " +
                        (isOpen
                          ? "bg-ink text-white border-ink"
                          : "text-ink bg-bg border-line-strong hover:border-emerald hover:text-emerald")
                      }
                    >
                      <PlayCircle size={15} />
                      {isOpen ? "Hide deploy log" : "Run deploy log"}
                      <ChevronDown size={14} className={isOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                    </button>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft border border-line rounded-full px-4 py-2.5 hover:text-ink hover:border-line-strong transition-colors whitespace-nowrap"
                    >
                      Full case study
                      <ArrowUpRight size={15} />
                    </Link>
                    <a
                      href={project.GitHubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft border border-line rounded-full px-4 py-2.5 hover:text-ink hover:border-line-strong transition-colors whitespace-nowrap"
                    >
                      <GitHubIcon size={15} />
                      Source
                    </a>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-7 rounded-xl bg-ink px-5 py-4 font-mono text-[12.5px] leading-relaxed">
                        <p className="text-emerald-bright mb-2">$ deploy --project={project.slug}</p>
                        {project.deploymentFlow.map((step, idx) => (
                          <motion.p
                            key={step}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.12, duration: 0.3 }}
                            className="text-white/75"
                          >
                            <span className="text-emerald-bright">✓</span> {step}
                          </motion.p>
                        ))}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: project.deploymentFlow.length * 0.12 + 0.15 }}
                          className="text-emerald-bright mt-2"
                        >
                          deploy complete ✓
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-7 grid grid-cols-3 gap-4 border-t border-line pt-6">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-ink font-semibold text-sm sm:text-base">{m.value}</p>
                      <p className="text-ink-faint text-xs mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </Spotlight>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
