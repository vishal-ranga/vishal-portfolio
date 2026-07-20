import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons/BrandIcons";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { projects, getProjectBySlug } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-emerald transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>

          <p className="font-mono text-xs text-emerald mb-3">Case study</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight text-balance">
            {project.name}
          </h1>
          <p className="mt-4 text-ink-soft text-lg leading-relaxed">{project.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[11px] text-ink-soft bg-emerald-tint/60 border border-line rounded-full px-2.5 py-1"
              >
                {s}
              </span>
            ))}
          </div>

          <a
            href={project.GitHubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-7 inline-flex items-center gap-2 bg-ink text-white text-sm font-medium rounded-full px-5 py-2.5 hover:bg-emerald-deep transition-colors"
          >
            <GitHubIcon size={15} />
            View source on GitHub
            <ArrowUpRight size={14} />
          </a>

          <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-line p-6">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <p className="font-display text-ink font-semibold text-base sm:text-lg">{m.value}</p>
                <p className="text-ink-faint text-xs mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <CaseStudySection title="Overview">
            <p>{project.overview}</p>
          </CaseStudySection>

          <CaseStudySection title="The problem">
            <p>{project.problem}</p>
          </CaseStudySection>

          <CaseStudySection title="The solution">
            <p>{project.solution}</p>
          </CaseStudySection>

          <CaseStudySection title="Architecture">
            <p>{project.architecture}</p>
            <ol className="mt-5 space-y-3">
              {project.architectureSteps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="font-mono text-emerald shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </CaseStudySection>

          <CaseStudySection title="Deployment flow">
            <ol className="space-y-3">
              {project.deploymentFlow.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="font-mono text-emerald shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </CaseStudySection>

          <CaseStudySection title="Engineering decisions">
            <div className="space-y-6">
              {project.decisions.map((d) => (
                <div key={d.title} className="rounded-xl border border-line p-5">
                  <h3 className="font-display font-semibold text-ink text-sm mb-2">{d.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{d.detail}</p>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection title="Challenges">
            <div className="space-y-6">
              {project.challenges.map((c) => (
                <div key={c.title} className="rounded-xl border border-line p-5">
                  <h3 className="font-display font-semibold text-ink text-sm mb-2">{c.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{c.detail}</p>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection title="Lessons learned">
            <ul className="space-y-2.5">
              {project.lessons.map((l) => (
                <li key={l} className="text-sm text-ink-soft leading-relaxed pl-4 relative">
                  <span className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-emerald" />
                  {l}
                </li>
              ))}
            </ul>
          </CaseStudySection>

          <CaseStudySection title="Future improvements" last>
            <ul className="space-y-2.5">
              {project.futureImprovements.map((f) => (
                <li key={f} className="text-sm text-ink-soft leading-relaxed pl-4 relative">
                  <span className="absolute left-0 top-[0.55em] h-1 w-1 rounded-full bg-emerald" />
                  {f}
                </li>
              ))}
            </ul>
          </CaseStudySection>

          <div className="mt-16 pt-8 border-t border-line flex items-center justify-between">
            <Link href="/#projects" className="text-sm text-ink-soft hover:text-emerald transition-colors">
              ← Back to all projects
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-emerald hover:text-emerald-deep transition-colors">
              Get in touch →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function CaseStudySection({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section className={`mt-12 pt-12 border-t border-line ${last ? "" : ""}`}>
      <h2 className="font-display text-xl font-semibold text-ink mb-4">{title}</h2>
      <div className="text-ink-soft text-[15px] leading-relaxed space-y-4">{children}</div>
    </section>
  );
}
