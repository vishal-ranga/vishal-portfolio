interface PipelineSeamProps {
  label: string;
}

export function PipelineSeam({ label }: PipelineSeamProps) {
  return (
    <div className="relative border-t border-line" aria-hidden="true">
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</span>
      </span>
    </div>
  );
}
