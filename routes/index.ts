import { useState, useEffect, useRef, useCallback } from "react";

const GRID_COLS = 96;
const GRID_ROWS = 56;
const CELL = 8;

function randomGrid() {
  const g: boolean[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    g[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      g[r][c] = Math.random() < 0.006;
    }
  }
  return g;
}

function step(g: boolean[][]) {
  const next: boolean[][] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    next[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      let alive = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && g[nr] && g[nr][nc]) alive++;
        }
      }
      next[r][c] = alive === 3 || (g[r][c] && alive === 2);
    }
  }
  return next;
}

function GameOfLifeGrid({ mouseCell }: { mouseCell: [number, number] | null }) {
  const [grid, setGrid] = useState(() => randomGrid());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGrid(g => step(g));
      setTick(t => t + 1);
    }, 350);
    return () => clearInterval(id);
  }, []);

  return (
    <svg
      width={GRID_COLS * CELL}
      height={GRID_ROWS * CELL}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.18 }}
    >
      {grid.map((row, r) =>
        row.map((alive, c) => {
          const mx = mouseCell ? Math.floor(mouseCell[0] / CELL) : -1;
          const my = mouseCell ? Math.floor(mouseCell[1] / CELL) : -1;
          const dist = Math.sqrt((c - mx) ** 2 + (r - my) ** 2);
          const near = mouseCell ? dist < 7 : false;
          const glow = alive || near;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * CELL + 1}
              y={r * CELL + 1}
              width={CELL - 2}
              height={CELL - 2}
              rx={1}
              fill={glow ? (near ? "#6ee7b7" : "#10b981") : "transparent"}
              style={{
                transition: near ? "fill 0.2s ease" : alive ? "fill 0.5s ease" : "none",
                opacity: glow ? (near ? 0.7 : 0.45) : 0,
              }}
            />
          );
        })
      )}
    </svg>
  );
}

const projects = [
  { name: "Wazoo Technologies", desc: "AI memory & world-models — the hippocampus for AI agents", url: "https://wazoo.dev", emoji: "🦉", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
  { name: "FartLabs", desc: "Type-safe HTML rendering packages for TypeScript & JSX", url: "https://github.com/FartLabs", emoji: "💨", color: "bg-green-500/20 border-green-500/30 text-green-300" },
  { name: "FullyHacks", desc: "Annual hackathon building the CSUF community", url: "https://fullyhacks.com", emoji: "⚡", color: "bg-teal-500/20 border-teal-500/30 text-teal-300" },
  { name: "acmcsufoss", desc: "Open-source club keeping CSUF's community weird", url: "https://github.com/acmcsufoss", emoji: "🪴", color: "bg-lime-500/20 border-lime-500/30 text-lime-300" },
];

const links = [
  { label: "GitHub", url: "https://github.com/EthanThatOneKid", icon: "🐙" },
  { label: "X / Twitter", url: "https://x.com/etok_me", icon: "✦" },
  { label: "LinkedIn", url: "https://linkedin.com/in/etok", icon: "◎" },
  { label: "Portfolio", url: "https://etok.me", icon: "☆" },
  { label: "Resume", url: "https://etok.me/resume", icon: "📎" },
  { label: "Book a call", url: "https://etok.me/meet", icon: "☎" },
];

function usePSTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const pst = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
      const h = pst.getHours().toString().padStart(2, "0");
      const m = pst.getMinutes().toString().padStart(2, "0");
      const s = pst.getSeconds().toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Profile() {
  const pstTime = usePSTClock();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouseCell, setMouseCell] = useState<[number, number] | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseCell([e.clientX - rect.left, e.clientY - rect.top]);
  }, []);

  const handleMouseLeave = useCallback(() => setMouseCell(null), []);

  return (
    <div className="min-h-screen bg-[#0a100a] text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-green-950/40 via-transparent to-emerald-950/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-green-800/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 py-14 space-y-12">

        <div className="text-center space-y-4">
          <div
            ref={heroRef}
            className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl"
            style={{ height: "180px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute inset-0 bg-[#0a100a]/60 backdrop-blur-[1px]" />
            <GameOfLifeGrid mouseCell={mouseCell} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Ethan Davidson</h1>
                <p className="text-base text-zinc-400 mt-0.5">aka <span className="text-emerald-400 font-medium">etok</span></p>
              </div>
            </div>
          </div>
          <p className="text-zinc-300 max-w-md mx-auto leading-relaxed">
            AI engineer at{" "}
            <a href="https://wazoo.dev" target="_blank" rel="noopener" className="text-emerald-400 hover:underline">Wazoo</a>
            {" "}— imagination-driven engineering helping people realize their dreams with software.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span>🌴</span>
            <span>Los Angeles, CA</span>
            <span className="text-emerald-700/60">|</span>
            <span className="font-mono text-emerald-400/70">{pstTime || "—:—:—"} PST</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <span>{link.icon}</span>
              {link.label}
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/affiliate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 hover:bg-emerald-500/30 hover:text-white transition-all font-medium"
          >
            <span>🌐</span>
            Try Zo Computer — $10 in free AI credits
          </a>
          <p className="text-xs text-zinc-600 mt-2">
            If the link doesn&apos;t work, try{" "}
            <a
              href="https://zo-computer.cello.so/fFG5xDTfXhY"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-400"
            >
              this direct link
            </a>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">About me</h2>
          <p className="text-zinc-300 leading-relaxed">
            I like building things that are useful and a little weird. My work lives at the intersection of developer tooling, AI infrastructure, and open-source communities. I previously worked at Google on Hotel Center and Dataplex UI, and now run Wazoo Technologies full-time while maintaining FartLabs and various community projects.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            When I'm not shipping code, I'm probably organizing hackathons, breeding Pokémon, or hanging out in the ACM CSUF OSS community.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 text-center">Things I've built</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-4 rounded-xl border transition-all hover:scale-[1.02] hover:-translate-y-0.5 ${project.color}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{project.emoji}</span>
                  <span className="font-semibold text-white">{project.name}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{project.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">Currently</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-0.5">🦉</span>
              <div>
                <p className="text-zinc-200 font-medium">Building Wazoo</p>
                <p className="text-zinc-500 text-sm">Neuro-symbolic memory layer for AI agents — imagination-driven engineering helping people realize their dreams with software</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">⚡</span>
              <div>
                <p className="text-zinc-200 font-medium">Running the community</p>
                <p className="text-zinc-500 text-sm">FullyHacks, acmcsufoss, FartLabs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-zinc-600 text-sm space-y-1">
          <p>Made with 💜 by Ethan Davidson · {new Date().getFullYear()}</p>
          <p>
            Powered by <a href="https://zo-computer.cello.so/fFG5xDTfXhY" target="_blank" rel="noopener" className="text-emerald-700 hover:text-emerald-500">Zo Computer</a>
          </p>
        </div>

      </div>
    </div>
  );
}