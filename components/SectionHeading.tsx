interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-emerald mb-3">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-ink-soft text-base sm:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
