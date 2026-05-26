import { useEffect, useMemo, useState } from "react";

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

const fallbackSpaces: Space[] = [
  {
    "id": "reaction-diffusion-garden",
    "title": "Reaction Diffusion Garden",
    "discipline": "emergent patterns",
    "summary": "A Gray-Scott garden where visitors tune feed and kill rates until chemical blooms turn into weather.",
    "tags": [
      "reaction",
      "shader",
      "garden"
    ],
    "hue": 158,
    "motif": "Bloom lattice",
    "prompt": "Dial the nutrient stream, wake the catalyst, and watch a living texture decide whether it is moss, coral, or storm cloud.",
    "path": "/zo-grid/reaction-diffusion-garden",
    "url": "https://etok.zo.space/zo-grid/reaction-diffusion-garden"
  },
  {
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
  },
  {
    "id": "lorenz-bell-tower",
    "title": "Lorenz Bell Tower",
    "discipline": "chaos sculpture",
    "summary": "A bronze tower whose ringing ropes trace a Lorenz attractor through fog and midnight light.",
    "tags": [
      "chaos",
      "attractor",
      "orbit"
    ],
    "hue": 12,
    "motif": "Twin strange loops",
    "prompt": "Pull one bell rope and the whole tower answers from somewhere slightly impossible.",
    "path": "/zo-grid/lorenz-bell-tower",
    "url": "https://etok.zo.space/zo-grid/lorenz-bell-tower"
  },
  {
    "id": "cellular-automata-bakery",
    "title": "Cellular Automata Bakery",
    "discipline": "grid life",
    "summary": "A tiny bakery where bread, ovens, and customers evolve by cellular automata rules.",
    "tags": [
      "automata",
      "grid",
      "bakery"
    ],
    "hue": 50,
    "motif": "Rule 30 ovens",
    "prompt": "The sourdough is alive, the ovens are neighbors, and breakfast emerges one cell at a time.",
    "path": "/zo-grid/cellular-automata-bakery",
    "url": "https://etok.zo.space/zo-grid/cellular-automata-bakery"
  },
  {
    "id": "fourier-ferry",
    "title": "Fourier Ferry",
    "discipline": "epicycle drawing",
    "summary": "A harbor ferry piloted by nested circles that draw coastlines with Fourier epicycles.",
    "tags": [
      "fourier",
      "water",
      "drawing"
    ],
    "hue": 207,
    "motif": "Epicycle wake",
    "prompt": "Board the boat, then watch its wake reconstruct the shoreline from rotating memory.",
    "path": "/zo-grid/fourier-ferry",
    "url": "https://etok.zo.space/zo-grid/fourier-ferry"
  },
  {
    "id": "perlin-weather-station",
    "title": "Perlin Weather Station",
    "discipline": "noise fields",
    "summary": "A living weather wall where noise becomes wind, cloud cover, and migration maps.",
    "tags": [
      "noise",
      "terrain",
      "weather"
    ],
    "hue": 96,
    "motif": "Vector wind",
    "prompt": "The forecast is not predicted here. It is grown from gradients.",
    "path": "/zo-grid/perlin-weather-station",
    "url": "https://etok.zo.space/zo-grid/perlin-weather-station"
  },
  {
    "id": "maze-worm-cafe",
    "title": "Maze Worm Cafe",
    "discipline": "path finding",
    "summary": "A neon cafe where hungry maze worms use A* search to find crumbs before the room rearranges.",
    "tags": [
      "maze",
      "search",
      "worms"
    ],
    "hue": 327,
    "motif": "A-star tunnels",
    "prompt": "Order coffee, drop breadcrumbs, and make the walls change their mind.",
    "path": "/zo-grid/maze-worm-cafe",
    "url": "https://etok.zo.space/zo-grid/maze-worm-cafe"
  },
  {
    "id": "kinematic-puppet-theater",
    "title": "Kinematic Puppet Theater",
    "discipline": "inverse kinematics",
    "summary": "A puppet theater where tentacle marionettes solve inverse kinematics to chase spotlights.",
    "tags": [
      "ik",
      "motion",
      "theater"
    ],
    "hue": 267,
    "motif": "Joint chains",
    "prompt": "The spotlight moves first. The body invents itself afterward.",
    "path": "/zo-grid/kinematic-puppet-theater",
    "url": "https://etok.zo.space/zo-grid/kinematic-puppet-theater"
  },
  {
    "id": "fractal-subway-map",
    "title": "Fractal Subway Map",
    "discipline": "recursive cities",
    "summary": "A subway diagram that recursively grows neighborhoods, transfers, and tiny train myths.",
    "tags": [
      "fractals",
      "maps",
      "recursion"
    ],
    "hue": 190,
    "motif": "Recursive rail",
    "prompt": "Every station contains a smaller map. Every transfer returns you changed.",
    "path": "/zo-grid/fractal-subway-map",
    "url": "https://etok.zo.space/zo-grid/fractal-subway-map"
  },
  {
    "id": "genetic-chair-factory",
    "title": "Genetic Chair Factory",
    "discipline": "evolutionary design",
    "summary": "A chair factory where furniture mutates, competes, and evolves toward comfort and weirdness.",
    "tags": [
      "genetic",
      "fitness",
      "design"
    ],
    "hue": 31,
    "motif": "Chromosome frames",
    "prompt": "Sit in the winner. Recombine the loser. Let comfort become a species.",
    "path": "/zo-grid/genetic-chair-factory",
    "url": "https://etok.zo.space/zo-grid/genetic-chair-factory"
  },
  {
    "id": "spring-mass-observatory",
    "title": "Spring Mass Observatory",
    "discipline": "physics playground",
    "summary": "A mountaintop observatory held together by springs, constraints, and soft-body telescopes.",
    "tags": [
      "springs",
      "physics",
      "constraints"
    ],
    "hue": 184,
    "motif": "Elastic stars",
    "prompt": "The telescope bends toward gravity, then snaps a constellation into focus.",
    "path": "/zo-grid/spring-mass-observatory",
    "url": "https://etok.zo.space/zo-grid/spring-mass-observatory"
  },
  {
    "id": "markov-ghost-radio",
    "title": "Markov Ghost Radio",
    "discipline": "generative text",
    "summary": "A haunted radio station where Markov chains remix station IDs into spectral broadcasts.",
    "tags": [
      "markov",
      "text",
      "radio"
    ],
    "hue": 87,
    "motif": "Signal haunt",
    "prompt": "Tune between stations until the static remembers how to speak.",
    "path": "/zo-grid/markov-ghost-radio",
    "url": "https://etok.zo.space/zo-grid/markov-ghost-radio"
  }
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

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function PortalThumb({ space, index }: { space: Space; index: number }) {
  const seed = hashString(space.id);
  const accent = `hsl(${space.hue} 94% 58%)`;
  const accent2 = `hsl(${(space.hue + 92) % 360} 88% 62%)`;
  const dark = index % 4 !== 1;
  const bg = dark ? "#05070a" : "#f7f6ee";
  const ink = dark ? "#ffffff" : "#05070a";
  const rings = Array.from({ length: 6 }, (_, ring) => ring);
  const particles = Array.from({ length: 24 }, (_, dot) => dot);

  return (
    <svg className="h-full w-full" viewBox="0 0 420 260" role="img" aria-label={`${space.title} portal thumbnail`}>
      <rect width="420" height="260" fill={bg} />
      <defs>
        <radialGradient id={`portal-${space.id}`} cx="50%" cy="50%" r="62%">
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.9 : 0.74} />
          <stop offset="0.18" stopColor={accent2} stopOpacity="0.82" />
          <stop offset="0.48" stopColor={accent} stopOpacity="0.42" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`edge-${space.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent2} />
        </linearGradient>
        <filter id={`blur-${space.id}`}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width="420" height="260" fill={`url(#portal-${space.id})`} opacity="0.72" />
      {rings.map((ring) => (
        <ellipse
          key={ring}
          cx="210"
          cy="130"
          rx={46 + ring * 25 + (seed % 9)}
          ry={18 + ring * 9 + ((seed >> ring) % 7)}
          fill="none"
          stroke={ring % 2 ? accent : `url(#edge-${space.id})`}
          strokeWidth={ring === 0 ? 6 : 1.3 + ring * 0.55}
          strokeOpacity={0.78 - ring * 0.09}
          transform={`rotate(${(seed % 90) - 45 + ring * 19} 210 130)`}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M ${20 + i * 42} ${225 - ((seed + i * 19) % 170)} C ${90 + i * 16} ${30 + ((seed + i * 7) % 130)}, ${250 - i * 9} ${235 - ((seed + i * 13) % 150)}, ${430 - i * 24} ${20 + ((seed + i * 29) % 210)}`} fill="none" stroke={i % 2 ? accent2 : ink} strokeWidth={i % 3 === 0 ? 3 : 1} strokeOpacity={i % 2 ? 0.46 : 0.16} />
      ))}
      {particles.map((dot) => (
        <circle
          key={dot}
          cx={(seed + dot * 61) % 420}
          cy={((seed >> 3) + dot * 37) % 260}
          r={2 + ((seed + dot * 5) % 10)}
          fill={dot % 2 ? accent : accent2}
          opacity="0.72"
        />
      ))}
      <circle cx="210" cy="130" r="42" fill={dark ? "#030303" : "#fff"} opacity="0.82" filter={`url(#blur-${space.id})`} />
      <circle cx="210" cy="130" r="23" fill={accent2} opacity="0.8" />
      <rect x="10" y="10" width="146" height="22" fill={dark ? "#000" : "#fff"} opacity="0.88" />
      <text x="18" y="25" fill={dark ? "#fff" : "#111"} fontFamily="monospace" fontSize="9" letterSpacing="1.3">{space.id.slice(0, 20)}</text>
    </svg>
  );
}

function Sidebar({ count }: { count: number }) {
  return (
    <aside className="zo-sidebar fixed left-0 top-0 z-20 h-screen w-[286px] overflow-y-auto border-r border-[#e5e5e5] bg-white px-4 py-5 text-[#444]">
      <h1 className="mb-8 text-[20px] leading-none tracking-[0.02em]">
        <a className="text-[#049ef4] no-underline" href="https://www.zo.computer/brand" target="_blank" rel="noreferrer">zo.js</a>{" "}
        <a className="inline-block rounded-[3px] border border-[#049ef4] px-[4px] py-[1px] text-[14px] leading-none text-[#049ef4] no-underline" href="/zo-grid/api">r003</a>
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

      <p className="mt-8 text-[13px] leading-relaxed text-[#888]">{count} generated Zo Grid Spaces. Each thumbnail is a portal into its own /zo-grid route.</p>
      <a id="button" className="mt-4 inline-block rounded-full border border-[#ddd] bg-white px-6 py-3 text-[16px] text-[#049ef4] no-underline shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-[#049ef4]" href="#spaces">enter grid</a>
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

  return (
    <main className="zo-grid min-h-screen bg-white text-[#444]">
      <style>{`
        .zo-grid { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
        .zo-grid * { box-sizing: border-box; }
        .zo-grid a { transition: color 120ms ease, border-color 120ms ease, opacity 120ms ease; }
        .zo-tile { background: #111; }
        .zo-tile svg { display: block; transform: scale(1.002); transition: transform 260ms ease, filter 260ms ease; }
        .zo-tile:hover svg { transform: scale(1.05); filter: saturate(1.28) contrast(1.08); }
        .zo-label { opacity: 0; transform: translateY(6px); transition: opacity 140ms ease, transform 140ms ease; }
        .zo-tile:hover .zo-label, .zo-tile:focus-visible .zo-label { opacity: 1; transform: translateY(0); }
        @media (max-width: 760px) {
          .zo-sidebar { position: relative; width: 100%; height: auto; border-right: 0; border-bottom: 1px solid #e5e5e5; }
          .zo-content { margin-left: 0 !important; }
          .zo-projects { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>

      <Sidebar count={spaces.length} />

      <section id="spaces" className="zo-content ml-[286px] min-h-screen">
        <div className="zo-projects grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-0">
          {spaces.map((space, index) => (
            <a key={space.id} href={space.path} title={`${space.title}: ${space.summary}`} className="zo-tile group relative block aspect-[1.47] overflow-hidden outline-none">
              <PortalThumb space={space} index={index} />
              <span className="zo-label pointer-events-none absolute inset-x-0 bottom-0 bg-black/72 px-3 py-2 text-[12px] leading-tight text-white backdrop-blur-sm">
                <span className="block truncate text-[#79d9ff]">{space.title}</span>
                <span className="block truncate text-white/68">{space.path}</span>
              </span>
            </a>
          ))}
        </div>

        <section id="generator" className="border-t border-[#e5e5e5] px-4 py-5 text-[14px] leading-relaxed text-[#777]">
          <p><strong className="text-[#049ef4]">selected</strong> {selected.title} / {selected.discipline} / {selected.path}</p>
          <p className="max-w-3xl">{selected.summary}</p>
        </section>
      </section>
    </main>
  );
}
