export function TechBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="tech-grid absolute inset-0 opacity-60" />
      <div className="tech-orb absolute -left-24 top-[-10%] size-[22rem] rounded-full" />
      <div className="tech-orb tech-orb-delayed absolute -right-28 top-[45%] size-[26rem] rounded-full" />
      <div className="tech-scan absolute inset-x-0 h-40" />
      <div className="tech-vignette absolute inset-0" />
    </div>
  );
}
