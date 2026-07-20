"use client";

import { motion } from "framer-motion";
import {
  Mail,
  FileDown,
  MapPin,
  Clock,
  Cloud,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { SectionHeading } from "./SectionHeading";
import { PipelineSeam } from "./PipelineSeam";
import { Spotlight } from "./Spotlight";
import { site } from "@/data/site";

const expertise = [
  "AWS Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Terraform",
  "Nginx",
  "Linux",
  "GitHub Actions",
  "CI/CD",
];

const availableFor = [
  "Cloud Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
];

const connectCards = [
  {
    icon: Mail,
    title: "Email",
    description: "Let's discuss opportunities.",
    button: "Send Email",
    href: `mailto:${site.email}`,
    external: false,
    download: false,
  },
  {
    icon: LinkedInIcon,
    title: "LinkedIn",
    description: "Connect professionally.",
    button: "View Profile",
    href: site.LinkedIn,
    external: true,
    download: false,
  },
  {
    icon: GitHubIcon,
    title: "GitHub",
    description: "Explore my projects.",
    button: "Open GitHub",
    href: site.GitHub,
    external: true,
    download: false,
  },
  {
    icon: FileDown,
    title: "Resume",
    description: "Download my latest resume.",
    button: "Download Resume",
    href: site.resumeUrl,
    external: false,
    download: true,
  },
];

const statusCards = [
  { icon: Clock, label: "Response Time", value: "Usually within 24 hours" },
  { icon: "dot" as const, label: "Availability", value: "Open to Opportunities" },
  { icon: MapPin, label: "Location", value: "Gurugram, India" },
  { icon: Cloud, label: "Focus", value: "Cloud · DevOps · Automation" },
];

export function Contact() {
  return (
    <section id="contact" className="pb-24 sm:pb-28 bg-surface">
      <PipelineSeam label="connect" />
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Let's talk"
          title="Let's Connect"
          description="Open to Cloud Engineering, DevOps, and Platform Engineering roles. Reach out directly or grab what you need below."
        />

        <div className="mt-12 grid lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8 items-start">
          {/* LEFT — terminal card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl border border-line bg-ink overflow-hidden shadow-[0_16px_40px_-16px_rgba(11,23,18,0.35)]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 font-mono text-[11px] text-white/40">
                  vishal@portfolio:~$
                </span>
              </div>

              <div className="p-6 font-mono text-[13px] leading-relaxed space-y-5">
                <div>
                  <p className="text-emerald-bright">$ whoami</p>
                  <p className="text-white/80 mt-1.5">{site.role}</p>
                  <p className="text-white/45 mt-0.5">
                    Building scalable cloud infrastructure and modern deployment pipelines.
                  </p>
                </div>

                <div>
                  <p className="text-emerald-bright">$ expertise</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {expertise.map((item) => (
                      <p key={item} className="flex items-center gap-1.5 text-white/70 text-[12.5px]">
                        <Check size={12} className="text-emerald-bright shrink-0" strokeWidth={2.5} />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-emerald-bright">$ current_status</p>
                  <p className="flex items-center gap-2 text-white/70 mt-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-bright opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-bright" />
                    </span>
                    Open to Full-Time Opportunities
                  </p>
                </div>

                <div>
                  <p className="text-emerald-bright">$ location</p>
                  <p className="flex items-center gap-1.5 text-white/70 mt-1.5">
                    <MapPin size={13} className="text-white/40" />
                    Gurugram, India
                  </p>
                </div>

                <div>
                  <p className="text-emerald-bright">$ availability</p>
                  <p className="text-white/45 mt-1.5">Available for</p>
                  <div className="mt-1 space-y-0.5">
                    {availableFor.map((role) => (
                      <p key={role} className="text-white/70 text-[12.5px]">
                        · {role}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="flex items-center gap-1 text-white/40 pt-3 border-t border-white/10">
                  vishal@portfolio:~$
                  <span className="inline-block w-2 h-3.5 bg-emerald-bright animate-pulse" />
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — connect cards + status row */}
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {connectCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                  >
                    <Spotlight className="rounded-2xl border border-line bg-bg h-full transition-colors hover:border-emerald/40">
                      <a
                        href={card.href}
                        target={card.external ? "_blank" : undefined}
                        rel={card.external ? "noreferrer noopener" : undefined}
                        download={card.download}
                        className="group/card flex h-full flex-col p-6"
                      >
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-tint to-white ring-1 ring-emerald/15 flex items-center justify-center shrink-0 shadow-sm">
                          <Icon size={18} className="text-emerald-deep" strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display font-semibold text-ink text-[15px] mt-4">
                          {card.title}
                        </h3>
                        <p className="text-ink-soft text-sm mt-1.5 flex-1">{card.description}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink group-hover/card:text-emerald-deep transition-colors">
                          {card.button}
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                          />
                        </span>
                      </a>
                    </Spotlight>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {statusCards.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-line bg-bg px-4 py-4"
                >
                  <div className="flex items-center gap-1.5 text-ink-faint mb-1.5">
                    {s.icon === "dot" ? (
                      <span className="h-2 w-2 rounded-full bg-emerald shrink-0" />
                    ) : (
                      <s.icon size={13} />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-wide">{s.label}</span>
                  </div>
                  <p className="text-ink text-[13px] font-medium leading-snug">{s.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
