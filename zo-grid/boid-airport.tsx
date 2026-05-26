import { useMemo } from "react";

type Space = {
  id: string;
  title: string;
  path: string;
  url: string;
  discipline: string;
  summary: string;
  tags: string[];
  hue: number;
  motif: string;
  prompt: string;
};

const space: Space = {
  "id": "boid-airport",
  "title": "Boid Airport",
  "discipline": "flocking systems",
  "summary": "A runway where tiny aircraft follow separation, alignment, and cohesion without a control tower.",
  "tags": [
    "boids",
    "agents",
    "traffic"
  ],
  "hue": 39,
  "motif": "Flock vectors",
  "prompt": "Every gate is a rule. Every departure is negotiated by the flock.",
  "path": "/zo-grid/boid-airport",
  "url": "https://etok.zo.space/zo-grid/boid-airport"
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function PortalField() {
  const seed = hashString(space.id);
  const particles = useMemo(() => Array.from({ length: 56 }, (_, i) => ({
    id: i,
    left: (seed + i * 47) % 100,
    top: ((seed >> 4) + i * 31) % 100,
    size: 2 + ((seed + i * 7) % 9),
    delay: ((seed + i * 11) % 900) / 100,
  })), []);
  const accent = `hsl(${space.hue} 94% 58%)`;
  const accent2 = `hsl(${(space.hue + 92) % 360} 88% 62%)`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="portal-core absolute left-1/2 top-1/2 h-[52vmin] w-[52vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" style={{ background: `radial-gradient(circle, white 0 9%, ${accent2} 10% 22%, ${accent} 23% 48%, transparent 70%)` }} />
      {Array.from({ length: 7 }, (_, ring) => (
        <div
          key={ring}
          className="portal-ring absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${28 + ring * 9}vmin`,
            height: `${10 + ring * 3.8}vmin`,
            borderColor: ring % 2 ? accent : accent2,
            opacity: 0.84 - ring * 0.08,
            transform: `translate(-50%, -50%) rotate(${(seed % 70) - 35 + ring * 17}deg)`,
            animationDelay: `${ring * -0.7}s`,
          }}
        />
      ))}
      {particles.map((dot) => (
        <span
          key={dot.id}
          className="portal-dot absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background: dot.id % 2 ? accent : accent2,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ZoGridSpace() {
  const accent = `hsl(${space.hue} 94% 58%)`;
  const accent2 = `hsl(${(space.hue + 92) % 360} 88% 62%)`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#040507] text-white">
      <style>{`
        @keyframes ring-drift { 0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); } 50% { transform: translate(-50%, -50%) rotate(9deg) scale(1.08); } 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); } }
        @keyframes dot-pulse { 0%, 100% { transform: translate3d(0,0,0) scale(.8); opacity: .25; } 50% { transform: translate3d(10px,-14px,0) scale(1.35); opacity: .95; } }
        @keyframes core-breathe { 0%, 100% { transform: translate(-50%, -50%) scale(.92); opacity: .72; } 50% { transform: translate(-50%, -50%) scale(1.08); opacity: .95; } }
        .portal-ring { animation: ring-drift 8s ease-in-out infinite; box-shadow: 0 0 34px currentColor; }
        .portal-dot { animation: dot-pulse 5s ease-in-out infinite; box-shadow: 0 0 20px currentColor; }
        .portal-core { animation: core-breathe 6s ease-in-out infinite; }
      `}</style>
      <PortalField />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/35 px-5 py-4 font-mono text-xs uppercase tracking-[0.26em] backdrop-blur-md">
        <a href="/zo-grid" className="text-white/70 no-underline hover:text-white">zo-grid</a>
        <span style={{ color: accent }}>{space.path}</span>
      </div>
      <section className="relative z-10 grid min-h-screen place-items-center px-5 py-24">
        <div className="max-w-5xl text-center">
          <p className="mx-auto mb-6 inline-flex border border-white/20 bg-white/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.25em] text-white/72 backdrop-blur-md" style={{ boxShadow: `0 0 40px ${accent}` }}>{space.motif}</p>
          <h1 className="text-[clamp(3.5rem,11vw,12rem)] font-black leading-[0.82] tracking-[-0.09em]">{space.title}</h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-white/72 sm:text-2xl">{space.summary}</p>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm uppercase leading-relaxed tracking-[0.16em]" style={{ color: accent2 }}>{space.prompt}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {space.tags.map((tag) => <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-white/70">{tag}</span>)}
          </div>
        </div>
      </section>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black to-transparent" />
    </main>
  );
}
