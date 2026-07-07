export function ContourField({
  variant = "default",
  seed = 0,
}: {
  variant?: "default" | "dense" | "quiet" | "warm";
  seed?: number;
}) {
  const cls =
    variant === "dense"
      ? "contour-field contour-dense"
      : variant === "quiet"
        ? "contour-field contour-quiet"
        : variant === "warm"
          ? "contour-field contour-warm"
          : "contour-field";

  // A single, continuous topographic pattern. Ring paths breathe subtly
  // and the whole field drifts. Same seed anchor keeps the composition
  // continuous across sections so the language reads as one field.
  const ox = 600 + Math.sin(seed) * 40;
  const oy = 400 + Math.cos(seed * 1.3) * 30;

  return (
    <div className={cls} aria-hidden>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`cf-fade-${seed}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="currentColor" fill="none">
          {Array.from({ length: 26 }).map((_, i) => {
            const r = 40 + i * 34;
            const wob = 8 + (i % 5) * 3;
            // organic ring — a slightly deformed ellipse using cubic bezier
            const d = `M ${ox - r} ${oy}
              C ${ox - r} ${oy - r + wob}, ${ox - wob} ${oy - r}, ${ox} ${oy - r}
              C ${ox + r - wob} ${oy - r}, ${ox + r} ${oy - wob}, ${ox + r} ${oy}
              C ${ox + r} ${oy + r - wob}, ${ox + wob} ${oy + r}, ${ox} ${oy + r}
              C ${ox - r + wob} ${oy + r}, ${ox - r} ${oy + wob}, ${ox - r} ${oy} Z`;
            return (
              <path
                key={i}
                d={d}
                className={i % 4 === 0 ? "c-breathe" : undefined}
                style={{
                  strokeOpacity: 0.35 + ((i * 37) % 40) / 100,
                  animationDelay: `${(i % 7) * 0.9}s`,
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
