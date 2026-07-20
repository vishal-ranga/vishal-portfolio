"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowUpRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { certifications } from "@/data/certifications";

export function Certifications() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <section id="certifications" className="pb-24 sm:pb-28 bg-surface">
      <PipelineSeam label="verify" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Verified"
          title="Certifications"
          description="Hover a card (or tap, on mobile) to flip it and verify the credential."
        />

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {certifications.map((cert, i) => {
            const isFlipped = flipped.has(i);
            return (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.06 }}
                onClick={() => toggle(i)}
                className="group [perspective:1200px] h-44 cursor-pointer sm:cursor-default"
              >
                <div
                  className={
                    "relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] " +
                    "sm:group-hover:[transform:rotateY(180deg)] " +
                    (isFlipped ? "[transform:rotateY(180deg)]" : "")
                  }
                >
                  {/* front */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border border-line bg-bg p-6 flex items-start gap-4 shadow-[0_1px_2px_rgba(11,23,18,0.04)] transition-all duration-300 group-hover:shadow-[0_16px_32px_-12px_rgba(6,56,42,0.18)] group-hover:border-emerald/30 group-hover:-translate-y-0.5">
                    <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald/40 to-transparent" />
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-tint to-white ring-1 ring-emerald/15 flex items-center justify-center shrink-0 shadow-sm">
                      <BadgeCheck size={19} className="text-emerald-deep" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-semibold text-ink text-[15px] leading-snug">
                          {cert.name}
                        </h3>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-tint px-2 py-0.5 text-emerald-deep">
                          <CheckCircle2 size={11} strokeWidth={2} />
                        </span>
                      </div>
                      <p className="text-ink-soft text-sm mt-1.5 font-mono text-[12.5px] tracking-wide">
                        {cert.issuer} <span className="text-ink-faint">·</span> {cert.year}
                      </p>
                    </div>
                  </div>

                  {/* back */}
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border border-emerald-bright/20 bg-gradient-to-br from-emerald-deep to-[#03211a] p-6 flex flex-col items-center justify-center text-center gap-3 overflow-hidden shadow-[0_16px_32px_-12px_rgba(6,56,42,0.45)]"
                  >
                    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-emerald-bright/20 blur-2xl" />
                    <span className="relative h-11 w-11 rounded-full bg-white/8 ring-1 ring-white/15 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-emerald-bright" strokeWidth={1.75} />
                    </span>
                    <p className="relative text-white text-sm font-medium">Verify this credential</p>
                    <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 text-emerald-bright text-xs font-mono transition-colors group-hover:bg-white/15">
                      view badge
                      <ArrowUpRight size={12} />
                    </span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
