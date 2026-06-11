import type { Context } from "hono";

const MAX_QUERY = 80;

type OmdbResult = {
  Title?: string;
  Year?: string;
  imdbID?: string;
  Type?: string;
  Poster?: string;
};

type OmdbResponse = {
  Response?: string;
  Error?: string;
  Search?: OmdbResult[];
  totalResults?: string;
};

type TmdbMovie = {
  id: number;
  title?: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
};

type TmdbResponse = {
  results?: TmdbMovie[];
  total_results?: number;
  status_code?: number;
  status_message?: string;
};

function cleanQuery(value: unknown): string {
  return String(value ?? "").trim().slice(0, MAX_QUERY);
}

function isPlaceholderPoster(url: string | undefined): boolean {
  if (!url) return true;
  return url === "N/A" || url.includes("placeholder");
}

function posterFromOmdb(poster: string | undefined): string | undefined {
  if (isPlaceholderPoster(poster)) return undefined;
  return poster;
}

function posterFromTmdb(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  return `https://image.tmdb.org/t/p/w300${path}`;
}

async function searchOmdb(query: string, apiKey: string) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("s", query);
  url.searchParams.set("type", "movie");
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    return { ok: false as const, error: `OMDb search failed (${response.status}).` };
  }
  const data = (await response.json()) as OmdbResponse;
  if (data.Response === "False") {
    if (data.Error && /api key/i.test(data.Error)) {
      return { ok: false as const, error: "OMDb rejected the API key. Check the OMDB_API_KEY secret." };
    }
    return { ok: true as const, results: [], provider: "omdb" as const, total: 0 };
  }
  const results = (data.Search ?? [])
    .filter((entry) => entry.Type === "movie" && entry.Title && entry.imdbID)
    .map((entry) => ({
      provider: "omdb" as const,
      imdbId: entry.imdbID!,
      tmdbId: undefined as number | undefined,
      title: entry.Title!,
      year: entry.Year,
      posterUrl: posterFromOmdb(entry.Poster),
      director: undefined as string | undefined,
      runtime: undefined as string | undefined,
      genre: undefined as string | undefined,
    }));
  return {
    ok: true as const,
    results,
    provider: "omdb" as const,
    total: Number(data.totalResults) || results.length,
  };
}

async function searchTmdb(query: string, apiKey: string) {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    return { ok: false as const, error: `TMDb search failed (${response.status}).` };
  }
  const data = (await response.json()) as TmdbResponse;
  if (data.status_code && data.status_code !== 200) {
    return { ok: false as const, error: data.status_message ?? "TMDb rejected the request." };
  }
  const results = (data.results ?? []).slice(0, 10).map((entry) => ({
    provider: "tmdb" as const,
    imdbId: undefined as string | undefined,
    tmdbId: entry.id,
    title: entry.title ?? "Untitled",
    year: entry.release_date ? entry.release_date.slice(0, 4) : undefined,
    posterUrl: posterFromTmdb(entry.poster_path),
    director: undefined as string | undefined,
    runtime: undefined as string | undefined,
    genre: undefined as string | undefined,
  }));
  return {
    ok: true as const,
    results,
    provider: "tmdb" as const,
    total: data.total_results ?? results.length,
  };
}

export default async function handler(c: Context) {
  if (c.req.method !== "GET") {
    return c.json({ error: "Method not allowed" }, 405);
  }

  const query = cleanQuery(c.req.query("q"));
  if (!query) {
    return c.json({ error: "Missing ?q= search query." }, 400);
  }

  const omdbKey = process.env.OMDB_API_KEY;
  const tmdbKey = process.env.TMDB_API_KEY;

  if (!omdbKey && !tmdbKey) {
    return c.json(
      {
        error:
          "No movie API key is configured. Add OMDB_API_KEY (preferred) or TMDB_API_KEY in Settings > Advanced.",
        results: [],
      },
      503,
    );
  }

  if (omdbKey) {
    const result = await searchOmdb(query, omdbKey);
    if (result.ok) {
      return c.json({
        provider: result.provider,
        results: result.results,
        total: result.total,
      });
    }
    if (tmdbKey) {
      const fallback = await searchTmdb(query, tmdbKey);
      if (fallback.ok) {
        return c.json({
          provider: fallback.provider,
          results: fallback.results,
          total: fallback.total,
          warning: `OMDb search failed: ${result.error}`,
        });
      }
      return c.json({ error: result.error, fallbackError: fallback.error, results: [] }, 502);
    }
    return c.json({ error: result.error, results: [] }, 502);
  }

  const tmdb = await searchTmdb(query, tmdbKey!);
  if (!tmdb.ok) {
    return c.json({ error: tmdb.error, results: [] }, 502);
  }
  return c.json({
    provider: tmdb.provider,
    results: tmdb.results,
    total: tmdb.total,
  });
}
