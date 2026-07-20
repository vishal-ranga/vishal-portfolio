import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-emerald-deep text-white/80">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div>
            <p className="font-display font-semibold text-white text-lg">
              {site.name}
              <span className="text-emerald-bright">.</span>
            </p>
            <p className="text-sm text-white/60 mt-2 max-w-sm">{site.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-emerald-bright hover:text-emerald-bright transition-colors"
            >
              <Mail size={16} />
            </a>
            <a
              href={site.GitHub}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-emerald-bright hover:text-emerald-bright transition-colors"
            >
              <GitHubIcon size={16} />
            </a>
            <a
              href={site.LinkedIn}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center hover:border-emerald-bright hover:text-emerald-bright transition-colors"
            >
              <LinkedInIcon size={16} />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {site.name}. Built with Next.js &amp; Tailwind CSS.</p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
