---
format: zopack
version: "1.0"
name: etok
description: "Ethan Davidson zo.space profile"
author: etok.zo.computer
routes: 7
exported: 2026-06-17
---

# etok

Ethan Davidson zo.space profile

## Routes

### `/` (page, public)

```tsx
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
  { name: "Wazoo Technologies", desc: "AI memory & world-models ??? the hippocampus for AI agents", url: "https://wazoo.dev", emoji: "????", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
  { name: "FartLabs", desc: "Type-safe HTML rendering packages for TypeScript & JSX", url: "https://github.com/FartLabs", emoji: "????", color: "bg-green-500/20 border-green-500/30 text-green-300" },
  { name: "FullyHacks", desc: "Annual hackathon building the CSUF community", url: "https://fullyhacks.com", emoji: "???", color: "bg-teal-500/20 border-teal-500/30 text-teal-300" },
  { name: "acmcsufoss", desc: "Open-source club keeping CSUF's community weird", url: "https://github.com/acmcsufoss", emoji: "????", color: "bg-lime-500/20 border-lime-500/30 text-lime-300" },
];

const links = [
  { label: "GitHub", url: "https://github.com/EthanThatOneKid", icon: "????" },
  { label: "X / Twitter", url: "https://x.com/etok_me", icon: "???" },
  { label: "LinkedIn", url: "https://linkedin.com/in/etok", icon: "???" },
  { label: "Zo Plays Pokemon", url: "/zoplayspokemon", icon: "????" },
  { label: "Portfolio", url: "https://etok.me", icon: "???" },
  { label: "Resume", url: "https://etok.me/resume", icon: "????" },
  { label: "Book a call", url: "https://etok.me/meet", icon: "???" },
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
            {" "}??? imagination-driven engineering helping people realize their dreams with software.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span>????</span>
            <span>Los Angeles, CA</span>
            <span className="text-emerald-700/60">|</span>
            <span className="font-mono text-emerald-400/70">{pstTime || "???:???:???"} PST</span>
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
            <span>????</span>
            Try Zo Computer ??? $10 in free AI credits
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
            When I&apos;m not shipping code, I&apos;m probably organizing hackathons, breeding Pok??mon, or hanging out in the ACM CSUF OSS community.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 text-center">Things I&apos;ve built</h2>
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
              <span className="text-emerald-400 mt-0.5">????</span>
              <div>
                <p className="text-zinc-200 font-medium">Building Wazoo</p>
                <p className="text-zinc-500 text-sm">Neuro-symbolic memory layer for AI agents ??? imagination-driven engineering helping people realize their dreams with software</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">???</span>
              <div>
                <p className="text-zinc-200 font-medium">Running the community</p>
                <p className="text-zinc-500 text-sm">FullyHacks, acmcsufoss, FartLabs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-zinc-600 text-sm space-y-1">
          <p>Made with ???? by Ethan Davidson ?? {new Date().getFullYear()}</p>
          <p>
            Powered by <a href="https://zo-computer.cello.so/fFG5xDTfXhY" target="_blank" rel="noopener" className="text-emerald-700 hover:text-emerald-500">Zo Computer</a>
          </p>
        </div>

      </div>
    </div>
  );
}
```

### `/clown` (page, public)

```tsx
export default function ClownProbePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Zo identity probe</p>
          <h1 className="text-4xl font-bold tracking-tight">/clown</h1>
          <p className="max-w-3xl text-zinc-400">
            This page embeds the probe as a document request so you can manually test the authenticated browser state.
            If Zo exposes an identity signal on this request, it should appear in the embedded result.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <iframe
              src="/api/clown-probe?format=html"
              title="Clown probe"
              className="h-[72vh] w-full rounded-xl border-0 bg-zinc-950"
            />
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">How to test</h2>
            <ol className="mt-4 space-y-3 list-decimal pl-5">
              <li>Open this route while signed into Zo on your device.</li>
              <li>Check whether the embedded probe shows a Zo-specific user or identity header.</li>
              <li>If the iframe stays blank, open the probe directly: <a href="/api/clown-probe?format=html" className="text-emerald-300 underline">/api/clown-probe?format=html</a>.</li>
            </ol>
            <p className="mt-4 text-zinc-500">
              Cookie values stay redacted. The probe only reports header names plus any non-cookie identity signal it can see.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
```

### `/api/clown-probe` (api, public)

```tsx
import type { Context } from "hono";

const IDENTITY_HEADER_CANDIDATES = [
  "x-zo-user",
  "x-user-id",
  "x-authenticated-user",
  "x-identity",
  "x-zo-identity",
  "x-session-id",
  "x-zo-client-auth",
] as const;

function parseCookieNames(cookieHeader: string | null): string[] {
  if (!cookieHeader) return [];
  return cookieHeader
    .split(";")
    .map((chunk) => chunk.trim())
    .map((chunk) => chunk.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function tryDecodeJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function decodeJwt(token: string | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const header = tryDecodeJson<Record<string, unknown>>(decodeBase64Url(parts[0]));
  const payload = tryDecodeJson<Record<string, unknown>>(decodeBase64Url(parts[1]));
  if (!header || !payload) return null;
  return { header, payload };
}

function toRows(entries: Array<{ label: string; value: string }>) {
  return entries
    .map(
      ({ label, value }) => `
        <div class="row">
          <div class="label">${escapeHtml(label)}</div>
          <div class="value">${escapeHtml(value)}</div>
        </div>
      `
    )
    .join("");
}

function renderHtml(payload: {
  method: string;
  path: string;
  userAgent: string | null;
  acceptLanguage: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  forwardedHost: string | null;
  zoClientAuthPresent: boolean;
  zoSitePort: string | null;
  decodedZoClientAuth: {
    present: boolean;
    header: Record<string, unknown> | null;
    payload: Record<string, unknown> | null;
    issuedAt: string | null;
    expiresAt: string | null;
    lifetimeMinutes: string | null;
  };
  cookieNames: string[];
  identitySignals: Array<{ name: string; present: boolean; value: string | null }>;
  requestHeaderNames: string[];
}) {
  const claimValue = (value: unknown) => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "true" : "false";
    if (value == null) return "none";
    return JSON.stringify(value);
  };

  const decodedClaims = payload.decodedZoClientAuth;

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Clown probe</title>
      <style>
        :root { color-scheme: dark; }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, sans-serif;
          background: #09090b;
          color: #fafafa;
        }
        .wrap { max-width: 960px; margin: 0 auto; padding: 24px; }
        .card {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          border-radius: 20px;
          padding: 20px;
          margin-top: 16px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 10px 0;
        }
        .row:last-child { border-bottom: 0; }
        .label { color: #a1a1aa; }
        .value { text-align: right; color: #f4f4f5; word-break: break-word; }
        .grid { display: grid; gap: 16px; }
        @media (min-width: 900px) { .grid { grid-template-columns: 1.2fr 0.8fr; } }
        .muted { color: #a1a1aa; }
        code, pre { font-family: ui-monospace, SFMono-Regular, monospace; }
        .pill {
          display: inline-flex;
          border: 1px solid rgba(16,185,129,0.35);
          background: rgba(16,185,129,0.12);
          color: #86efac;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="pill">Probe rendered from the request itself</div>
        <h1 style="font-size: 40px; margin: 12px 0 0;">/clown</h1>
        <p class="muted" style="max-width: 760px; line-height: 1.6;">
          This view comes from the document request, not a fetch. It redacts cookie values and shows any request header
          that looks like a Zo identity signal.
        </p>
        <div class="grid">
          <section class="card">
            <h2 style="margin: 0 0 16px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #71717a;">Request snapshot</h2>
            ${toRows([
              { label: "Method", value: payload.method },
              { label: "Path", value: payload.path },
              { label: "User agent", value: payload.userAgent ?? "none" },
              { label: "Accept-Language", value: payload.acceptLanguage ?? "none" },
              { label: "Referer", value: payload.referer ?? "none" },
              { label: "Origin", value: payload.origin ?? "none" },
              { label: "Host", value: payload.host ?? "none" },
              { label: "X-Forwarded-Host", value: payload.forwardedHost ?? "none" },
              {
                label: "X-Zo-Client-Auth",
                value: payload.zoClientAuthPresent ? "present (decoded below)" : "none",
              },
              { label: "X-Zo-Site-Port", value: payload.zoSitePort ?? "none" },
            ])}
          </section>

          <section class="card">
            <h2 style="margin: 0 0 16px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #71717a;">Identity signals</h2>
            ${toRows(
              payload.identitySignals.map((signal) => ({
                label: signal.name,
                value: signal.present ? signal.value ?? "present" : "absent",
              }))
            )}
          </section>
        </div>

        <div class="card">
          <h2 style="margin: 0 0 16px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #71717a;">Cookie names</h2>
          <p style="margin: 0; line-height: 1.7;">${payload.cookieNames.length ? escapeHtml(payload.cookieNames.join(", ")) : "none"}</p>
        </div>

        <div class="card">
          <h2 style="margin: 0 0 16px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #71717a;">Header names seen</h2>
          <pre style="margin: 0; white-space: pre-wrap; line-height: 1.7;">${escapeHtml(payload.requestHeaderNames.join("\n"))}</pre>
        </div>

        <div class="card">
          <h2 style="margin: 0 0 16px; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #71717a;">Decoded X-Zo-Client-Auth</h2>
          ${
            decodedClaims.present && decodedClaims.payload
              ? toRows([
                  { label: "Token present", value: "yes" },
                  { label: "Algorithm", value: claimValue(decodedClaims.header?.alg) },
                  { label: "Key ID", value: claimValue(decodedClaims.header?.kid) },
                  { label: "Host key", value: claimValue(decodedClaims.payload.host_key) },
                  { label: "Issuer", value: claimValue(decodedClaims.payload.iss) },
                  { label: "Audience", value: claimValue(decodedClaims.payload.aud) },
                  { label: "Issued at", value: decodedClaims.issuedAt ?? "none" },
                  { label: "Expires at", value: decodedClaims.expiresAt ?? "none" },
                  { label: "Lifetime", value: decodedClaims.lifetimeMinutes ?? "none" },
                ])
              : '<p style="margin: 0; line-height: 1.7;" class="muted">No decodable token was present.</p>'
          }
        </div>
      </div>
    </body>
  </html>`;
}

export default (c: Context) => {
  const accept = c.req.header("accept") ?? "";
  const cookieHeader = c.req.header("cookie");
  const cookieNames = parseCookieNames(cookieHeader);
  const zoClientAuth = c.req.header("x-zo-client-auth") ?? null;
  const decodedZoClientAuth = decodeJwt(zoClientAuth);
  const issuedAt = decodedZoClientAuth?.payload?.iat;
  const expiresAt = decodedZoClientAuth?.payload?.exp;
  const lifetimeMinutes =
    typeof issuedAt === "number" && typeof expiresAt === "number"
      ? ((expiresAt - issuedAt) / 60).toFixed(1)
      : null;
  const identitySignals = IDENTITY_HEADER_CANDIDATES.map((name) => {
    const value = c.req.header(name);
    const visibleValue = value ? (name === "x-session-id" ? "[redacted]" : "present") : null;
    return { name, present: Boolean(value), value: visibleValue };
  });
  const payload = {
    method: c.req.method,
    path: c.req.path,
    userAgent: c.req.header("user-agent") ?? null,
    acceptLanguage: c.req.header("accept-language") ?? null,
    referer: c.req.header("referer") ?? null,
    origin: c.req.header("origin") ?? null,
    host: c.req.header("host") ?? null,
    forwardedHost: c.req.header("x-forwarded-host") ?? null,
    zoClientAuthPresent: Boolean(zoClientAuth),
    zoSitePort: c.req.header("x-zo-site-port") ?? null,
    decodedZoClientAuth: {
      present: Boolean(decodedZoClientAuth),
      header: decodedZoClientAuth?.header ?? null,
      payload: decodedZoClientAuth?.payload ?? null,
      issuedAt: typeof issuedAt === "number" ? new Date(issuedAt * 1000).toISOString() : null,
      expiresAt: typeof expiresAt === "number" ? new Date(expiresAt * 1000).toISOString() : null,
      lifetimeMinutes,
    },
    cookieNames,
    authCookiePresent: cookieNames.some((name) => /session|auth|token|sid|zo/i.test(name)),
    identityHeaderNames: identitySignals.filter((signal) => signal.present).map((signal) => signal.name),
    identitySignals,
    requestHeaderNames: Array.from(c.req.raw.headers.keys()),
    note: "Cookie values are intentionally omitted. Any Zo identity header that reaches this request will show up in the identity signals list.",
  };

  if (accept.includes("application/json")) {
    return c.json(payload);
  }

  return c.html(renderHtml(payload));
};
```

### `/second-brain-build-hour` (page, private)

```tsx
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Sparkles } from "lucide-react";

type Slide = {
  step: string;
  kicker: string;
  title: string;
  summary: string;
  bullets: string[];
  notes: string;
  accent: string;
};

const slides: Slide[] = [
  {
    step: "01",
    kicker: "Proposal",
    title: "Use Zo to power a second brain",
    summary: "Keep the framing light; make the capability the centerpiece.",
    bullets: [
      "The hour should show how Zo turns ideas into a living workflow.",
      "Second-brain language is the hook, not the whole curriculum.",
      "The goal is a repeatable demo people can copy immediately.",
    ],
    notes:
      "Open with the thesis: most of the hour should demonstrate what Zo can do, because that is the memorable part. Keep the second-brain framing as context so the audience understands why the demo matters.",
    accent: "from-emerald-400/25 via-teal-400/12 to-cyan-400/10",
  },
  {
    step: "02",
    kicker: "Decision",
    title: "Demo first, teach second",
    summary: "Spend the hour where it has the highest signal-to-noise ratio.",
    bullets: [
      "About 70–80% of the hour: live capability demo.",
      "About 20–30%: second-brain principles and discussion.",
      "Use theory only when it helps viewers follow the build.",
    ],
    notes:
      "This is the explicit tradeoff to confirm with Joanna. If the audience leaves with one practical pattern and one clear mental model, the session worked. If it becomes mostly philosophy, it loses the product value.",
    accent: "from-amber-400/25 via-orange-400/12 to-rose-400/10",
  },
  {
    step: "03",
    kicker: "Run of show",
    title: "One hour, five beats",
    summary: "A simple agenda keeps the session tight and easy to follow.",
    bullets: [
      "0–5 min: intro and framing.",
      "5–15 min: show the target outcome.",
      "15–35 min: live build in Zo.",
      "35–50 min: viewer follow-along.",
      "50–60 min: Q&A and next steps.",
    ],
    notes:
      "This gives the audience enough structure to stay oriented while keeping the live build center stage. The 15–35 minute block is the core of the event.",
    accent: "from-fuchsia-400/20 via-violet-400/12 to-indigo-400/10",
  },
  {
    step: "04",
    kicker: "Live build",
    title: "Build a continual / recursive company brain",
    summary: "Show the end-to-end loop, not isolated features.",
    bullets: [
      "Capture raw inputs from the team.",
      "Normalize them into a durable knowledge format.",
      "Retrieve the right context on demand.",
      "Schedule recurring syntheses so the brain keeps growing.",
    ],
    notes:
      "This is the headline demo: one prompt that starts a living system instead of a one-off artifact. Narrate the loop as capture → structure → retrieval → recurrence.",
    accent: "from-cyan-400/20 via-sky-400/12 to-blue-400/10",
  },
  {
    step: "05",
    kicker: "Follow-along",
    title: "Let viewers adapt the pattern",
    summary: "Give them a small, concrete step they can copy during the hour.",
    bullets: [
      "Have them map one recurring note source.",
      "Show how to turn it into a prompt-driven workflow.",
      "Ask them to imagine the same pattern for a team or company.",
    ],
    notes:
      "The follow-along section should feel practical, not abstract. The audience should leave knowing how to reproduce the pattern for their own notes, team updates, or project memory.",
    accent: "from-lime-400/20 via-emerald-400/12 to-teal-400/10",
  },
  {
    step: "06",
    kicker: "Ask Joanna",
    title: "Which half deserves more time?",
    summary: "Use her judgment to calibrate the event toward the audience.",
    bullets: [
      "Should this lean more toward Zo capability or second-brain teaching?",
      "What would make the session feel useful to Zo’s community?",
      "Is there one capability she wants singled out as the headline?",
    ],
    notes:
      "This is the direct question you wanted to ask. It keeps the decision open while making your preference clear: the strongest use of time is showing capabilities, with second-brain concepts as framing.",
    accent: "from-yellow-400/20 via-amber-400/12 to-orange-400/10",
  },
  {
    step: "07",
    kicker: "Success criteria",
    title: "Leave with one reusable prompt",
    summary: "The session succeeds if people can act on it immediately.",
    bullets: [
      "One clear prompt that starts the workflow.",
      "One visible demo of the recurring loop.",
      "One next step for Zo or the community.",
    ],
    notes:
      "Close by naming the artifact you want to leave behind: a reusable prompt for a living company brain. That is a cleaner outcome than a vague philosophical discussion.",
    accent: "from-white/15 via-white/10 to-white/5",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function SecondBrainBuildHourDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(true);

  const slide = slides[currentSlide];
  const progress = useMemo(() => ((currentSlide + 1) / slides.length) * 100, [currentSlide]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        setCurrentSlide((index) => clamp(index + 1, 0, slides.length - 1));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        setCurrentSlide((index) => clamp(index - 1, 0, slides.length - 1));
      }
      if (event.key.toLowerCase() === "n") {
        setShowNotes((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,#050816_0%,#04060d_100%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-sky-200/70">
              <Sparkles className="h-4 w-4" />
              Run of show
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Zo build hour: second brains</h1>
            <p className="max-w-3xl text-sm text-slate-300">
              Slide-deck version of the meeting plan, with speaker notes you can toggle during the presentation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => setShowNotes((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white transition hover:bg-white/15"
            >
              {showNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showNotes ? "Hide notes" : "Show notes"}
            </button>
            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-slate-300">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </header>

        <div className={`mt-4 grid flex-1 gap-4 ${showNotes ? "lg:grid-cols-[220px_minmax(0,1fr)_340px]" : "lg:grid-cols-[220px_minmax(0,1fr)]"}`}>
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between px-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Slides</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="space-y-2">
              {slides.map((entry, index) => {
                const active = index === currentSlide;
                return (
                  <button
                    key={entry.step}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-emerald-400/40 bg-emerald-400/10"
                        : "border-white/10 bg-black/15 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase tracking-[0.35em] text-slate-400">{entry.step}</span>
                      <span className={`text-[11px] font-medium ${active ? "text-emerald-300" : "text-slate-500"}`}>
                        {entry.kicker}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-medium leading-snug text-white">{entry.title}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-[rgba(8,12,24,0.88)] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <div className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${slide.accent} p-[1px]`}>
              <div className="rounded-[1.7rem] bg-[#08101f]/95 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.4em] text-slate-400">{slide.kicker}</div>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">{slide.title}</h2>
                  </div>
                  <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-slate-300 sm:block">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Slide</div>
                    <div className="mt-1 text-xl font-semibold text-white">{slide.step}</div>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{slide.summary}</p>

                <div className="mt-8 grid gap-3">
                  {slide.bullets.map((bullet) => (
                    <div key={bullet} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]" />
                      <p className="text-sm leading-relaxed text-slate-200 sm:text-base">{bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.32em] text-slate-500">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Arrow keys navigate</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">N toggles notes</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Private planning deck</span>
                </div>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {showNotes ? (
            <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.35em] text-slate-400">Speaker notes</div>
                  <h3 className="mt-2 text-xl font-semibold text-white">Context for this slide</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                  {slide.step}
                </div>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-300">
                <p>{slide.notes}</p>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-50">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Use this slide to say</p>
                  <p className="mt-2">
                    We want Zo to be the thing people can build their second brain on — not just a place to talk about
                    second brains.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current emphasis</p>
                  <p className="mt-2 text-slate-200">
                    Show capability first. Teach methodology only when it makes the demo clearer.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentSlide((index) => clamp(index - 1, 0, slides.length - 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide((index) => clamp(index + 1, 0, slides.length - 1))}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
```

## Mirrored routes

- `/watchlist` (page, public) — Shared, collaborative movies watchlist. UI: `routes/watch-party/watchlist.tsx`.
- `/api/watchlist` (api) — CRUD + reorder for the watchlist, persisted to `watch-party/watchlist.json`. Source: `routes/watch-party/api-watchlist.ts`.
- `/api/watchlist-search` (api) — Movie title search, proxies OMDb (preferred) or TMDb. Source: `routes/watch-party/api-watchlist-search.ts`.

## Dependencies

**npm packages** (not in default zo.space):
- `react`
