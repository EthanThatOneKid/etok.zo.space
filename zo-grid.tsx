import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { ArrowUpRight, Compass, Grid3X3, Sparkles, Zap } from "lucide-react";

type Space = {
  id: string;
  title: string;
  path: string;
  discipline: string;
  prompt: string;
  tags: string[];
  accent: string;
  field: string;
  complexity: number;
};

const fallbackSpaces: Space[] = [
  { id: "reaction-diffusion-garden", title: "Reaction Diffusion Garden", path: "/zo-grid?space=reaction-diffusion-garden", discipline: "emergent patterns", prompt: "A Gray-Scott reaction diffusion sketch where visitors tune feed and kill rates like weather.", tags: ["Nature of Code", "shader", "garden"], accent: "#20f4b2", field: "radial", complexity: 91 },
  { id: "boid-airport", title: "Boid Airport", path: "/zo-grid?space=boid-airport", discipline: "flocking systems", prompt: "A flocking runway where hundreds of tiny agents coordinate takeoff without a control tower.", tags: ["steering", "flocks", "traffic"], accent: "#ffb000", field: "flock", complexity: 82 },
  { id: "lorenz-bell-tower", title: "Lorenz Bell Tower", path: "/zo-grid?space=lorenz-bell-tower", discipline: "chaos sculpture", prompt: "A bronze bell tower whose ropes trace a Lorenz attractor through fog and midnight light.", tags: ["chaos", "3D", "attractor"], accent: "#ff5a36", field: "orbit", complexity: 88 },
  { id: "cellular-automata-bakery", title: "Cellular Automata Bakery", path: "/zo-grid?space=cellular-automata-bakery", discipline: "grid life", prompt: "A tiny bakery where bread, ovens, and customers evolve by cellular automata rules.", tags: ["CA", "Game of Life", "simulation"], accent: "#f8df72", field: "grid", complexity: 74 },
  { id: "fourier-ferry", title: "Fourier Ferry", path: "/zo-grid?space=fourier-ferry", discipline: "epicycle drawing", prompt: "A harbor ferry piloted by nested circles that draw coastlines with Fourier epicycles.", tags: ["Fourier", "drawing", "water"], accent: "#58a6ff", field: "waves", complexity: 86 },
  { id: "perlin-weather-station", title: "Perlin Weather Station", path: "/zo-grid?space=perlin-weather-station", discipline: "noise fields", prompt: "A living weather wall where Perlin noise becomes wind, cloud cover, and migration maps.", tags: ["noise", "terrain", "weather"], accent: "#96f550", field: "noise", complexity: 79 },
  { id: "maze-worm-cafe", title: "Maze Worm Cafe", path: "/zo-grid?space=maze-worm-cafe", discipline: "path finding", prompt: "A neon cafe where hungry maze worms use A* search to find crumbs before the room rearranges.", tags: ["A*", "maze", "agents"], accent: "#ff65b3", field: "maze", complexity: 77 },
  { id: "kinematic-puppet-theater", title: "Kinematic Puppet Theater", path: "/zo-grid?space=kinematic-puppet-theater", discipline: "inverse kinematics", prompt: "A puppet theater where tentacle marionettes solve inverse kinematics to chase spotlights.", tags: ["IK", "motion", "theater"], accent: "#d7b5ff", field: "limbs", complexity: 84 },
  { id: "fractal-subway-map", title: "Fractal Subway Map", path: "/zo-grid?space=fractal-subway-map", discipline: "recursive cities", prompt: "A subway diagram that recursively grows neighborhoods, transfers, and tiny train myths.", tags: ["fractals", "maps", "recursion"], accent: "#00d4ff", field: "branches", complexity: 89 },
  { id: "genetic-chair-factory", title: "Genetic Chair Factory", path: "/zo-grid?space=genetic-chair-factory", discipline: "evolutionary design", prompt: "A chair factory where furniture mutates, competes, and evolves toward comfort and weirdness.", tags: ["genetic", "fitness", "design"], accent: "#ff8a00", field: "genes", complexity: 81 },
  { id: "spring-mass-observatory", title: "Spring Mass Observatory", path: "/zo-grid?space=spring-mass-observatory", discipline: "physics playground", prompt: "A mountaintop observatory held together by springs, constraints, and soft-body telescopes.", tags: ["physics", "springs", "constraints"], accent: "#7df9ff", field: "springs", complexity: 76 },
  { id: "markov-ghost-radio", title: "Markov Ghost Radio", path: "/zo-grid?space=markov-ghost-radio", discipline: "generative text", prompt: "A haunted radio station where Markov chains remix station IDs into spectral broadcasts.", tags: ["Markov", "text", "radio"], accent: "#b7ff4a", field: "signal", complexity: 72 },
];

const theme = {
  ink: "#080908",
  paper: "#f7f2e7",
  cream: "#fff8e7",
  line: "rgba(8, 9, 8, 0.18)",
  red: "#ff4b2f",
  blue: "#174cff",
  acid: "#ceff42",
};

function currentSpaceId() {
  if (typeof window === "undefined") return fallbackSpaces[0].id;
  return new URLSearchParams(window.location.search).get("space") || fallbackSpaces[0].id;
}

function SpaceGlyph({ space, index }: { space: Space; index: number }) {
  const dots = Array.from({ length: 18 }, (_, dot) => {
    const left = (dot * 37 + index * 19) % 100;
    const top = (dot * 23 + index * 31) % 100;
    const size = 2 + ((dot + index) % 5);
    return { left, top, size };
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#10120f]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div
        className="absolute -left-16 -top-16 h-48 w-48 rounded-full blur-2xl"
        style={{ background: space.accent, opacity: 0.46 }}
      />
      <div
        className="absolute bottom-6 right-6 h-32 w-32 rounded-full border"
        style={{ borderColor: space.accent, boxShadow: `0 0 38px ${space.accent}` }}
      />
      {dots.map((dot, dotIndex) => (
        <span
          key={dotIndex}
          className="absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background: dotIndex % 3 === 0 ? theme.cream : space.accent,
            opacity: dotIndex % 4 === 0 ? 0.95 : 0.5,
          }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 190" role="img" aria-label={`${space.title} generative thumbnail`}>
        {space.field === "grid" && Array.from({ length: 42 }, (_, i) => (
          <rect key={i} x={(i % 7) * 42 + 14} y={Math.floor(i / 7) * 30 + 12} width="18" height="18" rx="4" fill={i % 3 === 0 ? space.accent : "transparent"} stroke={space.accent} opacity={i % 3 === 0 ? 0.72 : 0.28} />
        ))}
        {space.field !== "grid" && Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M ${18 + i * 30} ${145 - ((i * index) % 70)} C ${70 + i * 16} ${20 + ((i + index) % 7) * 15}, ${160 - i * 7} ${172 - i * 12}, ${284 - i * 14} ${38 + ((i * 11) % 94)}`} fill="none" stroke={space.accent} strokeWidth="1.3" opacity={0.16 + i * 0.045} />
        ))}
      </svg>
      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/80">
        {space.field}
      </div>
    </div>
  );
}

function SpaceCard({ space, index, active }: { space: Space; index: number; active: boolean }) {
  return (
    <a
      href={space.path}
      className="group block overflow-hidden border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_rgba(8,9,8,.95)]"
      style={{ borderColor: active ? space.accent : theme.ink }}
    >
      <div className="relative aspect-[1.55] border-b border-black">
        <SpaceGlyph space={space} index={index} />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/50">{space.discipline}</p>
            <h2 className="mt-1 text-xl font-black leading-none tracking-[-0.045em] text-black">{space.title}</h2>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <p className="min-h-12 text-sm leading-snug text-black/68">{space.prompt}</p>
        <div className="flex flex-wrap gap-1.5">
          {space.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-black/60">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function ZoGrid() {
  const [spaces, setSpaces] = useState<Space[]>(fallbackSpaces);
  const [selectedId, setSelectedId] = useState(currentSpaceId);

  useEffect(() => {
    const updateSelection = () => setSelectedId(currentSpaceId());
    window.addEventListener("popstate", updateSelection);
    return () => window.removeEventListener("popstate", updateSelection);
  }, []);

  useEffect(() => {
    fetch("/zo-grid/api", { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("API unavailable")))
      .then((data) => Array.isArray(data.spaces) && setSpaces(data.spaces))
      .catch(() => setSpaces(fallbackSpaces));
  }, []);

  const selected = useMemo(() => spaces.find((space) => space.id === selectedId) || spaces[0], [selectedId, spaces]);

  return (
    <main
      style={
        {
          "--zo-ink": theme.ink,
          "--zo-paper": theme.paper,
          "--zo-cream": theme.cream,
          "--zo-line": theme.line,
          "--zo-red": theme.red,
          "--zo-blue": theme.blue,
          "--zo-acid": theme.acid,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--zo-paper)] text-[var(--zo-ink)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,500;6..72,700&display=swap');
        .zo-display { font-family: 'Archivo Black', sans-serif; }
        .zo-mono { font-family: 'DM Mono', monospace; }
        .zo-serif { font-family: 'Newsreader', serif; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { animation: marquee 18s linear infinite; }
      `}</style>

      <section className="relative overflow-hidden border-b border-black bg-[var(--zo-cream)]">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--zo-ink)_1px,transparent_1px),linear-gradient(90deg,var(--zo-ink)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute -right-28 top-0 h-80 w-80 rounded-full bg-[var(--zo-acid)] blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-10 lg:py-10">
          <div className="flex min-h-[430px] flex-col justify-between gap-10">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <a href="https://www.zo.computer/brand" target="_blank" rel="noreferrer" className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-black">
                  <img src="https://www.zo.computer/pegasus-white.svg" alt="Zo Pegasus" className="h-6 w-6" />
                </span>
                <span className="zo-mono text-xs uppercase tracking-[0.32em]">Zo constellation index</span>
              </a>
              <nav className="zo-mono flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                <a className="border border-black bg-white px-3 py-2 hover:bg-[var(--zo-acid)]" href="#spaces">Spaces</a>
                <a className="border border-black bg-white px-3 py-2 hover:bg-[var(--zo-acid)]" href="/zo-grid/api">API</a>
              </nav>
            </header>

            <div className="max-w-4xl">
              <p className="zo-mono mb-4 inline-flex items-center gap-2 border border-black bg-[var(--zo-acid)] px-3 py-2 text-xs uppercase tracking-[0.22em]">
                <Sparkles className="h-4 w-4" /> simulated spaces / generated projects
              </p>
              <h1 className="zo-display text-[clamp(4rem,14vw,11rem)] leading-[0.76] tracking-[-0.085em]">
                zo<br />grid
              </h1>
              <p className="zo-serif mt-7 max-w-2xl text-2xl leading-tight text-black/74 sm:text-3xl">
                A fake project constellation in the spirit of the Three.js examples gallery, restyled as a Zo-native atlas of strange computational spaces.
              </p>
            </div>
          </div>

          <aside className="border border-black bg-black p-4 text-white shadow-[12px_12px_0_var(--zo-red)]">
            <div className="relative aspect-[1.05] overflow-hidden border border-white/20">
              <SpaceGlyph space={selected} index={spaces.findIndex((space) => space.id === selected.id) + 1} />
            </div>
            <div className="mt-5 space-y-3">
              <p className="zo-mono text-xs uppercase tracking-[0.28em] text-white/45">currently tuned</p>
              <h2 className="zo-display text-4xl leading-none tracking-[-0.06em]">{selected.title}</h2>
              <p className="text-sm leading-relaxed text-white/68">{selected.prompt}</p>
              <div className="h-3 border border-white/30 bg-white/10">
                <div className="h-full" style={{ width: `${selected.complexity}%`, background: selected.accent }} />
              </div>
              <p className="zo-mono text-[10px] uppercase tracking-[0.22em] text-white/45">complexity {selected.complexity}%</p>
            </div>
          </aside>
        </div>
      </section>

      <div className="overflow-hidden border-b border-black bg-[var(--zo-blue)] py-3 text-white">
        <div className="marquee zo-mono flex w-[200%] gap-8 whitespace-nowrap text-xs uppercase tracking-[0.25em]">
          {Array.from({ length: 2 }, (_, repeat) => spaces.map((space) => (
            <span key={`${repeat}-${space.id}`} className="inline-flex items-center gap-2">
              <Zap className="h-3 w-3 text-[var(--zo-acid)]" /> {space.title}
            </span>
          )))}
        </div>
      </div>

      <section id="spaces" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="zo-mono text-xs uppercase tracking-[0.25em] text-black/48">{spaces.length} navigable thumbnails</p>
            <h2 className="zo-display mt-2 text-4xl tracking-[-0.06em] sm:text-6xl">Initial constellation</h2>
          </div>
          <div className="zo-mono flex items-center gap-2 border border-black bg-white px-3 py-2 text-xs uppercase tracking-[0.18em]">
            <Grid3X3 className="h-4 w-4" /> threejs-style index
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {spaces.map((space, index) => (
            <SpaceCard key={space.id} space={space} index={index + 1} active={space.id === selected.id} />
          ))}
        </div>
      </section>

      <footer className="border-t border-black bg-black px-5 py-6 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p className="zo-mono text-xs uppercase tracking-[0.22em] text-white/55">Built on Zo / fake spaces for real imagination</p>
          <a href="https://www.zo.computer/brand" target="_blank" rel="noreferrer" className="zo-mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white hover:text-[var(--zo-acid)]">
            <Compass className="h-4 w-4" /> brand system
          </a>
        </div>
      </footer>
    </main>
  );
}
