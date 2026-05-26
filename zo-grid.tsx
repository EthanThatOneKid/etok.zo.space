import { useEffect, useMemo, useState } from "react";
import type React from "react";

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

const navGroups = [
  { heading: "Learn", links: [["spaces", "#spaces"], ["api", "/zo-grid/api"]] },
  { heading: "Tools", links: [["generator", "#generator"], ["brand", "https://www.zo.computer/brand"]] },
  { heading: "Community", links: [["zo.computer", "https://www.zo.computer/"], ["discord", "https://discord.gg/invite/zocomputer"]] },
  { heading: "Code", links: [["github", "https://github.com/EthanThatOneKid/etok.zo.space"], ["download", "/zo-grid/api"]] },
  { heading: "Resources", links: [["Nature of Code", "https://natureofcode.com/"], ["Coding Train", "https://thecodingtrain.com/challenges"]] },
];

function currentSpaceId() {
  if (typeof window === "undefined") return fallbackSpaces[0].id;
  return new URLSearchParams(window.location.search).get("space") || fallbackSpaces[0].id;
}

function makeTiles(spaces: Space[]) {
  return Array.from({ length: 4 }, (_, repeat) => spaces.map((space, index) => ({
    ...space,
    tileId: `${space.id}-${repeat}`,
    href: repeat === 0 ? space.path : `/zo-grid?space=${space.id}&view=${repeat + 1}`,
    index: repeat * spaces.length + index,
  }))).flat();
}

function MiniScene({ space, index }: { space: Space; index: number }) {
  const secondary = index % 2 === 0 ? "#ffffff" : "#050505";
  const background = index % 3 === 0 ? "#070707" : index % 3 === 1 ? "#f4f4f0" : "#141922";

  return (
    <svg className="h-full w-full" viewBox="0 0 420 260" role="img" aria-label={`${space.title} thumbnail`}>
      <rect width="420" height="260" fill={background} />
      <defs>
        <radialGradient id={`glow-${index}`} cx={`${35 + (index % 5) * 12}%`} cy={`${30 + (index % 4) * 14}%`} r="70%">
          <stop offset="0" stopColor={space.accent} stopOpacity="0.92" />
          <stop offset="0.5" stopColor={space.accent} stopOpacity="0.2" />
          <stop offset="1" stopColor={space.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`scan-${index}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={space.accent} stopOpacity="0.85" />
          <stop offset="1" stopColor={secondary} stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#glow-${index})`} />
      {space.field === "grid" && Array.from({ length: 80 }, (_, i) => (
        <rect key={i} x={(i % 10) * 42 + 5} y={Math.floor(i / 10) * 33 + 2} width="30" height="24" fill={i % 4 === 0 ? space.accent : "none"} stroke={secondary} strokeOpacity="0.23" fillOpacity="0.72" />
      ))}
      {space.field !== "grid" && Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M ${-20 + i * 34} ${230 - ((i * 19 + index * 7) % 180)} C ${80 + i * 10} ${15 + ((i + index) % 8) * 28}, ${260 - i * 4} ${250 - i * 13}, ${450 - i * 19} ${28 + ((i * 29) % 190)}`} fill="none" stroke={i % 3 === 0 ? secondary : space.accent} strokeWidth={i % 4 === 0 ? 5 : 2} strokeOpacity={i % 3 === 0 ? 0.25 : 0.66} />
      ))}
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={(i * 47 + index * 31) % 420} cy={(i * 29 + index * 17) % 260} r={2 + ((i + index) % 10)} fill={i % 2 === 0 ? space.accent : secondary} opacity={i % 2 === 0 ? 0.7 : 0.38} />
      ))}
      <rect x="14" y="16" width="118" height="22" fill={index % 2 === 0 ? "#fff" : "#000"} opacity="0.86" />
      <text x="24" y="31" fill={index % 2 === 0 ? "#000" : "#fff"} fontFamily="monospace" fontSize="10" letterSpacing="2">{space.field}</text>
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="zo-sidebar fixed left-0 top-0 z-20 h-screen w-[360px] overflow-y-auto border-r border-[#e5e5e5] bg-white px-4 py-5 text-[#444]">
      <h1 className="mb-8 text-[20px] leading-none tracking-[0.02em]">
        <a className="text-[#049ef4] no-underline" href="https://www.zo.computer/brand" target="_blank" rel="noreferrer">zo.js</a>{" "}
        <a className="inline-block rounded-[3px] border border-[#049ef4] px-[4px] py-[1px] text-[14px] leading-none text-[#049ef4] no-underline" href="/zo-grid/api">r001</a>
      </h1>

      <nav aria-label="Zo Grid navigation" className="space-y-8">
        {navGroups.map((group) => (
          <section key={group.heading}>
            <h2 className="mb-2 text-[18px] font-bold leading-tight text-[#049ef4]">{group.heading}</h2>
            <ul className="m-0 list-none space-y-1 p-0 text-[18px] leading-[1.55]">
              {group.links.map(([label, href]) => (
                <li key={label}>
                  <a className="text-[#444] no-underline hover:text-[#049ef4]" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <a id="button" className="mt-8 inline-block rounded-full border border-[#ddd] bg-white px-6 py-3 text-[16px] text-[#049ef4] no-underline shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-[#049ef4]" href="https://www.zo.computer/brand" target="_blank" rel="noreferrer">submit space</a>
    </aside>
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
  const tiles = useMemo(() => makeTiles(spaces), [spaces]);

  return (
    <main className="zo-grid min-h-screen bg-white text-[#444]">
      <style>{`
        .zo-grid { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
        .zo-grid * { box-sizing: border-box; }
        .zo-grid a { transition: color 120ms ease, border-color 120ms ease, opacity 120ms ease; }
        .zo-tile { background: #111; }
        .zo-tile svg { display: block; transform: scale(1.002); transition: transform 220ms ease, filter 220ms ease; }
        .zo-tile:hover svg { transform: scale(1.045); filter: saturate(1.18) contrast(1.05); }
        .zo-label { opacity: 0; transform: translateY(6px); transition: opacity 140ms ease, transform 140ms ease; }
        .zo-tile:hover .zo-label, .zo-tile:focus-visible .zo-label { opacity: 1; transform: translateY(0); }
        @media (max-width: 760px) {
          .zo-sidebar { position: relative; width: 100%; height: auto; border-right: 0; border-bottom: 1px solid #e5e5e5; }
          .zo-content { margin-left: 0 !important; }
          .zo-projects { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>

      <Sidebar />

      <section id="spaces" className="zo-content ml-[360px] min-h-screen">
        <div className="zo-projects grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-0">
          {tiles.map((tile) => (
            <a key={tile.tileId} href={tile.href} title={`${tile.title}: ${tile.prompt}`} className="zo-tile group relative block aspect-[1.47] overflow-hidden outline-none">
              <MiniScene space={tile} index={tile.index} />
              <span className="zo-label pointer-events-none absolute inset-x-0 bottom-0 bg-black/72 px-3 py-2 text-[12px] leading-tight text-white backdrop-blur-sm">
                <span className="block truncate text-[#79d9ff]">{tile.title}</span>
                <span className="block truncate text-white/68">{tile.discipline}</span>
              </span>
            </a>
          ))}
        </div>

        <section id="generator" className="border-t border-[#e5e5e5] px-4 py-5 text-[14px] leading-relaxed text-[#777]">
          <p><strong className="text-[#049ef4]">selected</strong> {selected.title} / {selected.discipline} / complexity {selected.complexity}</p>
          <p className="max-w-3xl">{selected.prompt}</p>
        </section>
      </section>
    </main>
  );
}
