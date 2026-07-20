export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg" aria-hidden="true">
      <div
        className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-emerald/[0.16] blur-[110px]"
        style={{ animation: "drift-a 19s ease-in-out infinite" }}
      />
      <div
        className="absolute top-10 -right-32 h-[460px] w-[460px] rounded-full bg-emerald-bright/[0.12] blur-[110px]"
        style={{ animation: "drift-b 23s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-160px] left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-deep/[0.07] blur-[120px]"
        style={{ animation: "drift-a 27s ease-in-out infinite reverse" }}
      />
    </div>
  );
}
