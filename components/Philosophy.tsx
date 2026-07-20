"use client";

import { motion } from "framer-motion";
import { Bot, Layers, ShieldCheck, Gauge, Eye, Lock, RefreshCcw } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { Spotlight } from "./Spotlight";

const principles = [
  {
    icon: Bot,
    title: "Automation first",
    detail:
      "If a task is run more than twice by hand, it becomes a script or a pipeline stage. Manual steps are where drift and human error live.",
  },
  {
    icon: Layers,
    title: "Infrastructure as code",
    detail:
      "Environments are defined in version control, not remembered. A server's configuration should be reproducible from a diff, not a memory.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    detail:
      "Idempotent playbooks, health-gated pipelines, and fail-loud over fail-silent — a deploy should either clearly succeed or clearly stop.",
  },
  {
    icon: Gauge,
    title: "Scalability",
    detail:
      "Design for the load you'll have, not just the load you have now — stateless services, externalised config, horizontal-first thinking.",
  },
  {
    icon: Eye,
    title: "Observability",
    detail:
      "You can't fix what you can't see. Logs, metrics, and health checks are part of the deploy, not an afterthought bolted on later.",
  },
  {
    icon: Lock,
    title: "Security by design",
    detail:
      "Least-privilege IAM, scoped security groups, and secrets that never live in a repo — security is a default, not a review-cycle checkbox.",
  },
  {
    icon: RefreshCcw,
    title: "Continuous improvement",
    detail:
      "Every incident gets a runbook. Every runbook gets shorter over time. The pipeline you ship today is the worst version you'll ever run.",
  },
];

export function Philosophy() {
  return (
    <section id="philosophy" className="pb-24 sm:pb-28">
      <PipelineSeam label="principles" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="How I work"
          title="Engineering philosophy"
          description="Seven principles that shape every pipeline, playbook, and cluster I touch."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            >
              <Spotlight className="h-full rounded-2xl border border-line bg-surface p-6 hover:border-emerald/60 hover:-translate-y-1 transition-all duration-300">
                <div className="h-10 w-10 rounded-lg bg-emerald-tint flex items-center justify-center mb-5">
                  <p.icon size={18} className="text-emerald-deep" strokeWidth={1.75} />
                </div>
                <h3 className="font-display font-semibold text-ink text-[15px] mb-2">{p.title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{p.detail}</p>
              </Spotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
