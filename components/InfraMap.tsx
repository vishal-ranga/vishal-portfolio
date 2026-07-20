"use client";

import { motion } from "framer-motion";

const satellites = [
  { key: "aws", label: "AWS", angle: -90 },
  { key: "k8s", label: "K8s", angle: -30 },
  { key: "tf", label: "TF", angle: 30 },
  { key: "cw", label: "CW", angle: 90 },
  { key: "docker", label: "Docker", angle: 150 },
  { key: "ci", label: "CI/CD", angle: 210 },
];

const CENTER = { x: 175, y: 165 };
const RADIUS = 118;

function point(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + RADIUS * Math.cos(rad),
    y: CENTER.y + RADIUS * Math.sin(rad),
  };
}

export function InfraMap() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <svg viewBox="0 0 350 330" className="w-full h-auto overflow-visible" aria-hidden="true">
        {/* spokes */}
        {satellites.map((s) => {
          const p = point(s.angle);
          return (
            <line
              key={`line-${s.key}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke="var(--line-strong)"
              strokeWidth={1.25}
            />
          );
        })}

        {/* traveling pulses, one satellite active at a time */}
        {satellites.map((s, i) => {
          const p = point(s.angle);
          const cycle = satellites.length * 0.9;
          return (
            <motion.circle
              key={`pulse-${s.key}`}
              r={3}
              fill="var(--emerald-bright)"
              initial={{ opacity: 0 }}
              animate={{
                cx: [CENTER.x, p.x],
                cy: [CENTER.y, p.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.9,
                delay: i * 0.9,
                repeat: Infinity,
                repeatDelay: cycle - 0.9,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* satellite nodes */}
        {satellites.map((s, i) => {
          const p = point(s.angle);
          const cycle = satellites.length * 0.9;
          return (
            <g key={s.key}>
              <title>{s.label}</title>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill="var(--surface)"
                stroke="var(--line-strong)"
                strokeWidth={1.25}
                animate={{ stroke: ["var(--line-strong)", "var(--emerald)", "var(--line-strong)"] }}
                transition={{ duration: 0.9, delay: i * 0.9, repeat: Infinity, repeatDelay: cycle - 0.9 }}
              />
              <text
                x={p.x}
                y={p.y + 3.5}
                textAnchor="middle"
                className="font-mono"
                fontSize="9"
                fill="var(--ink-soft)"
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* center node */}
        <circle cx={CENTER.x} cy={CENTER.y} r={34} fill="var(--emerald-deep)" />
        <circle cx={CENTER.x} cy={CENTER.y} r={34} fill="none" stroke="var(--emerald-tint)" strokeWidth={1} opacity={0.4} />
        <text
          x={CENTER.x}
          y={CENTER.y + 4}
          textAnchor="middle"
          className="font-display font-semibold"
          fontSize="11"
          fill="white"
        >
          you
        </text>
      </svg>

      {/* terminal readout strip */}
      <div className="mt-6 rounded-xl border border-line bg-ink text-left px-4 py-3 font-mono text-[11px] leading-relaxed shadow-sm">
        <p className="text-emerald-bright">$ status --pipeline</p>
        <p className="text-white/70">build   <span className="text-emerald-bright">passing</span></p>
        <p className="text-white/70">deploy  <span className="text-emerald-bright">healthy</span> · 3 nodes</p>
        <p className="text-white/70">uptime  <span className="text-emerald-bright">99.98%</span></p>
      </div>
    </div>
  );
}
