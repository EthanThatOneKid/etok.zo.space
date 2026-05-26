import { useEffect, useMemo, useState } from "react";

type Space = {
  id: string;
  title: string;
  path: string;
  url: string;
  discipline: string;
  summary: string;
  tags: string[];
};

const fallbackSpaces: Space[] = [
  { id: "qa-space", title: "QA Space", path: "/qa-space", url: "https://etok.zo.space/qa-space", discipline: "testing lab", summary: "A public workspace for QA experiments and interface checks.", tags: ["qa", "lab", "space"] },
  { id: "durvasula-quiz", title: "Durvasula Quiz", path: "/durvasula-quiz", url: "https://etok.zo.space/durvasula-quiz", discipline: "quiz", summary: "A focused interactive quiz route.", tags: ["quiz", "learning", "interactive"] },
  { id: "docs", title: "Docs", path: "/docs", url: "https://etok.zo.space/docs", discipline: "documentation", summary: "A document-oriented Zo Space route.", tags: ["docs", "reference", "writing"] },
  { id: "tworek-quiz", title: "Tworek Quiz", path: "/tworek-quiz", url: "https://etok.zo.space/tworek-quiz", discipline: "quiz", summary: "Another public quiz surface in the space collection.", tags: ["quiz", "prompt", "study"] },
  { id: "home", title: "Home", path: "/", url: "https://etok.zo.space/", discipline: "homepage", summary: "The root landing page for etok.zo.space.", tags: ["home", "index", "zo"] },
  { id: "birthday", title: "Birthday", path: "/birthday", url: "https://etok.zo.space/birthday", discipline: "celebration", summary: "A public birthday-themed page.", tags: ["event", "party", "page"] },
  { id: "built-with-zo", title: "Built With Zo", path: "/built-with-zo", url: "https://etok.zo.space/built-with-zo", discipline: "showcase", summary: "A showcase surface for things built with Zo.", tags: ["zo", "showcase", "build"] },
  { id: "collaborative-edge", title: "Collaborative Edge", path: "/collaborative-edge", url: "https://etok.zo.space/collaborative-edge", discipline: "collaboration", summary: "A public route exploring collaborative interfaces.", tags: ["collab", "edge", "tools"] },
  { id: "dvd-collection", title: "DVD Collection", path: "/dvd-collection", url: "https://etok.zo.space/dvd-collection", discipline: "catalog", summary: "A media collection page for DVDs.", tags: ["media", "archive", "catalog"] },
  { id: "farzapedia-demo", title: "Farzapedia Demo", path: "/farzapedia-demo", url: "https://etok.zo.space/farzapedia-demo", discipline: "demo", summary: "A wiki-like demo page.", tags: ["demo", "wiki", "knowledge"] },
  { id: "wazoo", title: "Wazoo", path: "/wazoo", url: "https://etok.zo.space/wazoo", discipline: "project hub", summary: "A Wazoo project route.", tags: ["wazoo", "project", "hub"] },
  { id: "ethanxnancy", title: "Ethan x Nancy", path: "/ethanxnancy", url: "https://etok.zo.space/ethanxnancy", discipline: "personal", summary: "A personal public page.", tags: ["personal", "page", "story"] },
  { id: "mikki-out-2026", title: "Mikki Out 2026", path: "/mikki-out-2026", url: "https://etok.zo.space/mikki-out-2026", discipline: "event", summary: "An event-style public page.", tags: ["event", "2026", "page"] },
  { id: "zocabulary", title: "Zocabulary", path: "/zocabulary", url: "https://etok.zo.space/zocabulary", discipline: "dictionary", summary: "A crowd-sourced Zo vocabulary page.", tags: ["words", "zo", "submit"] },
  { id: "join-wazoo", title: "Join Wazoo", path: "/join-wazoo", url: "https://etok.zo.space/join-wazoo", discipline: "signup", summary: "A join page for Wazoo.", tags: ["join", "wazoo", "form"] },
  { id: "space-3ds-demo", title: "3DS Demo", path: "/space/3ds-demo", url: "https://etok.zo.space/space/3ds-demo", discipline: "handheld web", summary: "A Zo Space demo shaped around Nintendo 3DS constraints.", tags: ["3ds", "demo", "browser"] },
  { id: "3ds-browser-maze", title: "3DS Browser Maze", path: "/3ds-browser-maze", url: "https://etok.zo.space/3ds-browser-maze", discipline: "game", summary: "A maze experiment for small-screen browsing.", tags: ["maze", "3ds", "game"] },
  { id: "workspaces-3ds-demo", title: "Workspaces 3DS Demo", path: "/workspaces/3ds-demo", url: "https://etok.zo.space/workspaces/3ds-demo", discipline: "workspace demo", summary: "A workspace-flavored 3DS demonstration route.", tags: ["workspace", "3ds", "demo"] },
  { id: "venues", title: "Venues", path: "/venues", url: "https://etok.zo.space/venues", discipline: "map", summary: "A route for venue-style browsing.", tags: ["venues", "places", "map"] },
  { id: "talk-with-zo", title: "Talk With Zo", path: "/talk-with-zo", url: "https://etok.zo.space/talk-with-zo", discipline: "conversation", summary: "A public surface for talking with Zo.", tags: ["chat", "zo", "voice"] },
  { id: "pokemon-global-link-timeline", title: "Pokemon Global Link Timeline", path: "/pokemon-global-link-timeline", url: "https://etok.zo.space/pokemon-global-link-timeline", discipline: "timeline", summary: "A timeline page for Pokemon Global Link history.", tags: ["pokemon", "timeline", "archive"] },
  { id: "giver-map", title: "Giver Map", path: "/giver-map", url: "https://etok.zo.space/giver-map", discipline: "map", summary: "A map-oriented public route.", tags: ["map", "giving", "places"] },
  { id: "business-card", title: "Business Card", path: "/business-card", url: "https://etok.zo.space/business-card", discipline: "identity", summary: "A compact business-card style page.", tags: ["card", "identity", "profile"] },
  { id: "amity-square-mask-editor", title: "Amity Square Mask Editor", path: "/amity-square-mask-editor", url: "https://etok.zo.space/amity-square-mask-editor", discipline: "editor", summary: "An editor route connected to Amity Square.", tags: ["amity", "editor", "mask"] },
  { id: "amity-square", title: "Amity Square", path: "/amity-square", url: "https://etok.zo.space/amity-square", discipline: "game space", summary: "A playful Amity Square route.", tags: ["amity", "pokemon", "space"] },
  { id: "king-of-the-hill-season-15", title: "King of the Hill Season 15", path: "/king-of-the-hill-season-15", url: "https://etok.zo.space/king-of-the-hill-season-15", discipline: "countdown", summary: "A fan-facing public page for King of the Hill season 15.", tags: ["tv", "countdown", "fan"] },
  { id: "venture-town", title: "Venture Town", path: "/venture-town", url: "https://etok.zo.space/venture-town", discipline: "3D town", summary: "A town-like public route for venture exploration.", tags: ["venture", "town", "3d"] },
  { id: "multi-window-starfish", title: "Multi Window Starfish", path: "/multi-window-starfish", url: "https://etok.zo.space/multi-window-starfish", discipline: "browser toy", summary: "A multi-window browser experiment.", tags: ["windows", "starfish", "toy"] },
  { id: "globe", title: "Globe", path: "/globe", url: "https://etok.zo.space/globe", discipline: "visualization", summary: "A globe-oriented visualization route.", tags: ["globe", "3d", "map"] },
  { id: "regular-show-lost-tapes-countdown", title: "Regular Show Lost Tapes Countdown", path: "/regular-show-lost-tapes-countdown", url: "https://etok.zo.space/regular-show-lost-tapes-countdown", discipline: "countdown", summary: "A countdown page for the Regular Show Lost Tapes project.", tags: ["regular show", "countdown", "fan"] },
  { id: "zoplayspokemon", title: "Zo Plays Pokemon", path: "/zoplayspokemon", url: "https://etok.zo.space/zoplayspokemon", discipline: "game", summary: "A public room-based Pokemon play surface.", tags: ["pokemon", "gameboy", "game"] },
  { id: "zo-space-10print", title: "Zo Space 10PRINT", path: "/zo-space-10print", url: "https://etok.zo.space/zo-space-10print", discipline: "generative art", summary: "A 10PRINT-inspired generative Zo Space.", tags: ["10print", "generative", "art"] },
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

function hueFor(space: Space, offset = 0) {
  return (hashString(space.path) + offset) % 360;
}

function MiniScene({ space, index }: { space: Space; index: number }) {
  const seed = hashString(space.path);
  const mode = seed % 8;
  const hue = hueFor(space);
  const accent = `hsl(${hue} 92% 58%)`;
  const accent2 = `hsl(${(hue + 86) % 360} 86% 62%)`;
  const bg = seed % 3 === 0 ? "#080808" : seed % 3 === 1 ? "#f5f5f1" : "#111827";
  const ink = seed % 3 === 1 ? "#111" : "#fff";
  const opacity = seed % 3 === 1 ? 0.34 : 0.7;

  return (
    <svg className="h-full w-full" viewBox="0 0 420 260" role="img" aria-label={`${space.title} thumbnail`}>
      <rect width="420" height="260" fill={bg} />
      <defs>
        <radialGradient id={`glow-${index}`} cx={`${20 + (seed % 60)}%`} cy={`${18 + ((seed >> 5) % 58)}%`} r="78%">
          <stop offset="0" stopColor={accent} stopOpacity="0.86" />
          <stop offset="0.54" stopColor={accent2} stopOpacity="0.22" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`line-${index}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent2} />
        </linearGradient>
      </defs>
      <rect width="420" height="260" fill={`url(#glow-${index})`} />

      {mode === 0 && Array.from({ length: 64 }, (_, i) => (
        <rect key={i} x={(i % 8) * 54 + 9} y={Math.floor(i / 8) * 34 + 5} width={14 + ((seed + i) % 24)} height={10 + ((seed >> (i % 8)) % 20)} fill={i % 3 === 0 ? accent : ink} opacity={i % 3 === 0 ? 0.65 : 0.18} />
      ))}
      {mode === 1 && Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M ${-30 + i * 32} ${220 - ((seed >> (i % 12)) % 190)} C ${80 + i * 9} ${20 + ((seed + i * 19) % 120)}, ${250 - i * 7} ${250 - ((seed + i * 23) % 190)}, ${450 - i * 15} ${20 + ((seed + i * 31) % 210)}`} fill="none" stroke={i % 2 ? accent : ink} strokeWidth={1 + (i % 5)} strokeOpacity={i % 2 ? opacity : 0.25} />
      ))}
      {mode === 2 && Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={(seed + i * 73) % 420} cy={((seed >> 3) + i * 41) % 260} r={6 + ((seed + i * 11) % 32)} fill="none" stroke={i % 2 ? accent2 : accent} strokeWidth={1 + (i % 4)} opacity={0.18 + (i % 5) * 0.11} />
      ))}
      {mode === 3 && Array.from({ length: 10 }, (_, i) => (
        <polygon key={i} points={`${40 + i * 38},${28 + ((seed + i) % 80)} ${85 + i * 29},${110 + ((seed >> (i % 10)) % 110)} ${18 + i * 41},${235 - ((seed + i * 17) % 95)}`} fill={i % 2 ? accent : accent2} opacity={0.18 + (i % 5) * 0.12} />
      ))}
      {mode === 4 && Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1={(seed + i * 47) % 420} y1="0" x2={((seed >> 2) + i * 83) % 420} y2="260" stroke={i % 2 ? accent : ink} strokeWidth={1 + (i % 6)} opacity={i % 2 ? 0.48 : 0.16} />
      ))}
      {mode === 5 && Array.from({ length: 36 }, (_, i) => (
        <path key={i} d={`M ${(seed + i * 29) % 420} ${((seed >> 4) + i * 13) % 260} q ${-60 + ((seed + i * 7) % 120)} ${-50 + ((seed + i * 11) % 100)} ${-80 + ((seed + i * 17) % 160)} ${-40 + ((seed + i * 23) % 120)}`} fill="none" stroke={i % 3 ? accent : accent2} strokeWidth="2" strokeOpacity="0.42" />
      ))}
      {mode === 6 && Array.from({ length: 44 }, (_, i) => (
        <rect key={i} x={(seed + i * 37) % 420} y={((seed >> 6) + i * 29) % 260} width={8 + ((seed + i) % 44)} height="4" fill={i % 2 ? accent : ink} opacity={i % 2 ? 0.62 : 0.2} transform={`rotate(${(seed + i * 17) % 180} ${(seed + i * 37) % 420} ${((seed >> 6) + i * 29) % 260})`} />
      ))}
      {mode === 7 && Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx={(seed + i * 71) % 420} cy={((seed >> 8) + i * 43) % 260} rx={28 + ((seed + i * 5) % 86)} ry={6 + ((seed + i * 13) % 24)} fill="none" stroke={`url(#line-${index})`} strokeWidth={1 + (i % 5)} opacity={0.24 + (i % 4) * 0.13} transform={`rotate(${(seed + i * 23) % 180} ${(seed + i * 71) % 420} ${((seed >> 8) + i * 43) % 260})`} />
      ))}

      {Array.from({ length: 18 }, (_, i) => (
        <circle key={`dot-${i}`} cx={(seed + i * 53) % 420} cy={((seed >> 2) + i * 31) % 260} r={2 + ((seed + i * 3) % 9)} fill={i % 2 ? accent : accent2} opacity="0.72" />
      ))}
      <rect x="10" y="10" width="118" height="22" fill={seed % 3 === 1 ? "#fff" : "#000"} opacity="0.86" />
      <text x="18" y="25" fill={seed % 3 === 1 ? "#111" : "#fff"} fontFamily="monospace" fontSize="9" letterSpacing="1.6">{space.path.slice(0, 18)}</text>
    </svg>
  );
}

function Sidebar({ count }: { count: number }) {
  return (
    <aside className="zo-sidebar fixed left-0 top-0 z-20 h-screen w-[286px] overflow-y-auto border-r border-[#e5e5e5] bg-white px-4 py-5 text-[#444]">
      <h1 className="mb-8 text-[20px] leading-none tracking-[0.02em]">
        <a className="text-[#049ef4] no-underline" href="https://www.zo.computer/brand" target="_blank" rel="noreferrer">zo.js</a>{" "}
        <a className="inline-block rounded-[3px] border border-[#049ef4] px-[4px] py-[1px] text-[14px] leading-none text-[#049ef4] no-underline" href="/zo-grid/api">r002</a>
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

      <p className="mt-8 text-[13px] leading-relaxed text-[#888]">{count} real public Zo Spaces. Each thumbnail links directly to its route.</p>
      <a id="button" className="mt-4 inline-block rounded-full border border-[#ddd] bg-white px-6 py-3 text-[16px] text-[#049ef4] no-underline shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:border-[#049ef4]" href="https://www.zo.computer/brand" target="_blank" rel="noreferrer">submit space</a>
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
        .zo-tile svg { display: block; transform: scale(1.002); transition: transform 220ms ease, filter 220ms ease; }
        .zo-tile:hover svg { transform: scale(1.045); filter: saturate(1.2) contrast(1.05); }
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
              <MiniScene space={space} index={index} />
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
