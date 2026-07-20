"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="pb-24 sm:pb-28">
      <PipelineSeam label="deploy" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading eyebrow="Timeline" title="Experience & education" />

        <div className="mt-14 relative pl-8 sm:pl-10">
          <div className="absolute left-[7px] sm:left-[9px] top-1 bottom-1 w-px bg-line" />

          <div className="space-y-10">
            {experience.map((item, i) => {
              const Icon = item.type === "work" ? Briefcase : GraduationCap;
              return (
                <motion.div
                  key={item.title + item.period}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="relative"
                >
                  <div className="absolute -left-8 sm:-left-10 top-0.5 h-4 w-4 rounded-full bg-surface border-2 border-emerald flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
                    <h3 className="font-display font-semibold text-ink text-base">{item.title}</h3>
                    <span className="font-mono text-xs text-ink-faint">{item.period}</span>
                  </div>
                  <p className="text-ink-soft text-sm flex items-center gap-1.5 mb-3">
                    <Icon size={13} />
                    {item.org} · {item.location}
                  </p>
                  {item.points.length > 0 && (
                    <ul className="space-y-1.5">
                      {item.points.map((pt) => (
                        <li key={pt} className="text-sm text-ink-soft leading-relaxed pl-4 relative">
                          <span className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-emerald" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
