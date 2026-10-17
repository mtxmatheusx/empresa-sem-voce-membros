// Anel de progresso dourado (SVG). O traço anima de 0 até o valor na entrada.
export function ProgressRing({
  pct,
  id,
  label = "concluído",
  className,
}: {
  pct: number;
  id: string;
  label?: string;
  className?: string;
}) {
  const R = 44;
  const C = 2 * Math.PI * R;
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div className={`esv-ring ${className ?? ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F1D78A" />
            <stop offset="1" stopColor="#B8902A" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={R} className="esv-ring__track" />
        <circle
          cx="50"
          cy="50"
          r={R}
          className="esv-ring__bar"
          stroke={`url(#${id})`}
          style={
            {
              strokeDasharray: C,
              "--from": C,
              "--to": C * (1 - v / 100),
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="esv-ring__label">
        <strong>{v}%</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
