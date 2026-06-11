import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Context } from "hono";

const DATA_DIR = "/home/workspace/watch-party";
const DATA_FILE = `${DATA_DIR}/watchlist.json`;

const MAX_TITLE = 200;
const MAX_NOTE = 280;
const MAX_ADDED_BY = 48;
const MAX_ID_LENGTH = 80;

type Movie = {
  id: string;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  year?: string;
  posterUrl?: string;
  director?: string;
  runtime?: string;
  genre?: string;
  note?: string;
  addedBy: string;
  addedAt: string;
};

async function readMovies(): Promise<Movie[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, "[]\n", "utf8");
    return [];
  }
}

async function writeMovies(movies: Movie[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(movies, null, 2)}\n`, "utf8");
}

function clean(value: unknown, max: number): string {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_ID_LENGTH;
}

function normalizeMovie(input: Record<string, unknown>): Movie {
  const id = clean(input.id, MAX_ID_LENGTH) || randomUUID();
  const tmdbId = Number(input.tmdbId);
  const imdbId = clean(input.imdbId, 16);
  return {
    id,
    tmdbId: Number.isFinite(tmdbId) && tmdbId > 0 ? tmdbId : undefined,
    imdbId: imdbId || undefined,
    title: clean(input.title, MAX_TITLE),
    year: clean(input.year, 8) || undefined,
    posterUrl: clean(input.posterUrl, 600) || undefined,
    director: clean(input.director, 200) || undefined,
    runtime: clean(input.runtime, 40) || undefined,
    genre: clean(input.genre, 120) || undefined,
    note: clean(input.note, MAX_NOTE) || undefined,
    addedBy: clean(input.addedBy, MAX_ADDED_BY) || "Anonymous",
    addedAt: clean(input.addedAt, 40) || new Date().toISOString(),
  };
}

export default async function handler(c: Context) {
  if (c.req.method === "GET") {
    const movies = await readMovies();
    return c.json({ movies });
  }

  if (c.req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    const movie = normalizeMovie(body);
    if (!movie.title) {
      return c.json({ error: "Movie title is required." }, 400);
    }
    if (!movie.posterUrl && !movie.imdbId && !movie.tmdbId) {
      return c.json({ error: "Add a movie with a poster, IMDb ID, or TMDb ID so it can be rendered." }, 400);
    }

    const movies = await readMovies();
    const duplicate = movies.find((entry) => {
      if (movie.imdbId && entry.imdbId === movie.imdbId) return true;
      if (movie.tmdbId && entry.tmdbId === movie.tmdbId) return true;
      return false;
    });
    if (duplicate) {
      return c.json({ error: `${movie.title} is already on the watchlist.`, movie: duplicate }, 409);
    }

    movies.push(movie);
    await writeMovies(movies);
    return c.json({ ok: true, movie }, 201);
  }

  if (c.req.method === "PUT") {
    let body: Record<string, unknown>;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    const incoming = Array.isArray(body.movies) ? body.movies : null;
    if (!incoming) {
      return c.json({ error: "Send { movies: [...] } to reorder." }, 400);
    }

    const movies = await readMovies();
    const indexById = new Map(movies.map((movie, index) => [movie.id, index]));
    const reordered: Movie[] = [];
    for (const entry of incoming) {
      if (!isValidId(entry?.id)) continue;
      const index = indexById.get(entry.id);
      if (index === undefined) continue;
      const existing = movies[index];
      reordered.push({ ...existing, note: clean(entry?.note, MAX_NOTE) || existing.note });
      indexById.delete(entry.id);
    }
    for (const remaining of indexById.values()) {
      reordered.push(movies[remaining]);
    }
    await writeMovies(reordered);
    return c.json({ ok: true, movies: reordered });
  }

  if (c.req.method === "DELETE") {
    const id = c.req.query("id");
    if (!isValidId(id)) {
      return c.json({ error: "Provide an id query parameter to remove a movie." }, 400);
    }
    const movies = await readMovies();
    const next = movies.filter((movie) => movie.id !== id);
    if (next.length === movies.length) {
      return c.json({ error: "Movie not found." }, 404);
    }
    await writeMovies(next);
    return c.json({ ok: true, movies: next });
  }

  return c.json({ error: "Method not allowed" }, 405);
}
