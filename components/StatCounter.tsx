"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  duration?: number;
}

export function StatCounter({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  duration = 1400,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(target * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <div ref={ref}>
      <p className="font-display text-3xl sm:text-4xl font-semibold text-ink tabular-nums">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </p>
      <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mt-1.5">{label}</p>
    </div>
  );
}
