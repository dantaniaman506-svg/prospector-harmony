type Props = { data: number[]; className?: string };

export function Sparkline({ data, className }: Props) {
  const w = 100;
  const h = 32;
  const series = data.length > 1 ? data : [0, 0];
  const max = Math.max(...series);
  const min = Math.min(...series);
  const flat = max - min === 0;
  const span = flat ? 1 : max - min;

  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = flat ? h - 2 : h - ((v - min) / span) * (h - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const id = `spark-${series
    .join("-")
    .slice(0, 16)
    .replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {!flat && <polygon points={`0,${h} ${pts.join(" ")} ${w},${h}`} fill={`url(#${id})`} />}
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={flat ? 0.35 : 1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
