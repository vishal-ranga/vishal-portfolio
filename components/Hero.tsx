"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, MapPin, Terminal } from "lucide-react";
import { site } from "@/data/site";
import { InfraMap } from "./InfraMap";
import { StatCounter } from "./StatCounter";
import { Spotlight } from "./Spotlight";

export function Hero() {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 18 });

  function handlePanelMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }
  function resetPanel() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-6xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald" />
            </span>
            <span className="font-mono text-xs text-ink-soft">{site.status}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight text-ink leading-[1.08] text-balance"
          >
            Provision it. Ship it.
            <br />
            Watch it heal <span className="text-gradient">itself.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed"
          >
            {site.tagline} I&apos;m {site.name}, a cloud &amp; DevOps engineer working across{" "}
            <span className="text-ink font-medium">AWS, Terraform, Docker and Kubernetes</span> to
            turn manual ops into pipelines that run on their own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-ink text-white text-sm font-medium rounded-full px-5 py-3 hover:bg-emerald-deep transition-colors"
            >
              See the work
              <ArrowUpRight size={16} />
            </a>
            <a
              href={site.resumeUrl}
              download
              className="inline-flex items-center gap-2 border border-line-strong text-ink text-sm font-medium rounded-full px-5 py-3 hover:border-emerald hover:text-emerald transition-colors"
            >
              <ArrowDownToLine size={16} />
              Download résumé
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden sm:inline-flex items-center gap-2 text-ink-soft text-sm font-mono px-2 hover:text-emerald transition-colors"
            >
              <Terminal size={15} />
              press <kbd className="border border-line rounded px-1.5 py-0.5 text-xs">⌘K</kbd> to explore
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex items-center gap-2 text-ink-faint text-sm"
          >
            <MapPin size={14} />
            {site.location}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 grid grid-cols-3 max-w-md border-t border-line pt-6"
          >
            <StatCounter target={3} suffix="+" label="Pipelines shipped" />
            <StatCounter target={99.9} decimals={1} suffix="%" label="Uptime target" />
            <StatCounter target={90} suffix="%" label="Faster deploys" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl border border-line hidden sm:block" />
          <motion.div
            onMouseMove={handlePanelMove}
            onMouseLeave={resetPanel}
            style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
            className="rounded-3xl"
          >
            <Spotlight className="rounded-3xl border border-line bg-surface/70 backdrop-blur-sm p-8 sm:p-10 shadow-[0_20px_60px_-25px_rgba(6,56,42,0.25)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-emerald-tint shrink-0">
                  <Image src="/images/profile.jpg" alt={site.name} fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <p className="font-display font-semibold text-ink text-sm">{site.name}</p>
                  <p className="text-ink-soft text-xs">{site.role}</p>
                </div>
              </div>
              <InfraMap />
            </Spotlight>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
