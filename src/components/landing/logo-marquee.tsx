import { logos } from "@/components/landing/data";

export function LogoMarquee() {
  const track = [...logos, ...logos];

  return (
    <div className="overflow-hidden rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] py-4">
      <div className="logo-track">
        {track.map((logo, index) => (
          <div
            key={`${logo}-${index}`}
            className="logo-pill flex items-center rounded-full px-5 py-3"
          >
            <span className="mono text-sm uppercase tracking-[0.22em]">{logo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
