"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { site } from "@/data/site";

const facts = [
  { label: "Based in", value: "Gurugram, India" },
  { label: "Focus", value: "Cloud · DevOps · Platform" },
  { label: "Currently", value: "MCA, NorthCap University" },
  { label: "Certified in", value: "AWS · Azure · OCI" },
];

export function About() {
  return (
    <section id="about" className="pb-24 sm:pb-28 bg-surface">
      <PipelineSeam label="source" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24 grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden border border-line aspect-[4/5] relative max-w-xs">
            <Image
              src="/images/profile.jpg"
              alt={site.name}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
          </div>
        </motion.div>

        <div>
          <SectionHeading eyebrow="About" title="I like systems that don't need me at 2 AM" />
          <div className="mt-6 space-y-4 text-ink-soft text-base leading-relaxed max-w-2xl">
            <p>
              I&apos;m {site.name}, a final-year MCA student and cloud engineer who spends most of my
              time turning manual, error-prone deployment work into pipelines that run themselves.
              My background is hands-on: provisioning AWS infrastructure, writing Ansible playbooks
              that don&apos;t drift, and getting Kubernetes clusters to survive a pod dying without anyone
              noticing.
            </p>
            <p>
              I hold certifications across AWS, Microsoft Azure, and Oracle Cloud Infrastructure, and
              I&apos;m most interested in the space where infrastructure-as-code, container orchestration,
              and observability meet — the parts of a system that decide whether an incident is a
              five-minute non-event or a 2 AM page.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-line pt-8">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mb-1">
                  {f.label}
                </p>
                <p className="text-ink text-sm font-medium">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
