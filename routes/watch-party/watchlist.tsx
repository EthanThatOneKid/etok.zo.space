import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clapperboard, GripVertical, Loader2, Plus, Search, X } from "lucide-react";

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

type SearchResult = {
  provider: "omdb" | "tmdb";
  imdbId?: string;
  tmdbId?: number;
  title: string;
  year?: string;
  posterUrl?: string;
};

const theme = {
  background: "#0a0a0c",
  surface: "rgba(20, 20, 24, 0.85)",
  card: "rgba(28, 28, 34, 0.92)",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  foreground: "#f5f5f7",
  muted: "#8a8a96",
  accent: "#ff4d2f",
  accentSoft: "rgba(255, 77, 47, 0.16)",
  success: "#1fbf75",
};

const draftKey = "watchlist:draft:v1";
type Draft = { name: string; note: string };

function readDraft(): Draft {
  if (typeof window === "undefined") return { name: "", note: "" };
  try {
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) return { name: "", note: "" };
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      note: typeof parsed.note === "string" ? parsed.note : "",
    };
  } catch {
    return { name: "", note: "" };
  }
}

function saveDraft(draft: Draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(draftKey, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
  } catch {
    return "New";
  }
}

const POSTER_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23222"/><stop offset="1" stop-color="%23111"/></linearGradient></defs><rect width="200" height="300" fill="url(%23g)"/><g fill="%23555" font-family="monospace" font-size="14" text-anchor="middle"><text x="100" y="150">no poster</text></g></svg>`,
  );

function MoviePoster({ src, title }: { src?: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/40">
      {showPlaceholder ? (
        <img
          src={POSTER_PLACEHOLDER}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-80"
          draggable={false}
        />
      ) : (
        <img
          src={src}
          alt={`${title} poster`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function MovieRow({
  movie,
  index,
  onRemove,
  onDragOver,
  onDrop,
  dragging,
  dragOver,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: {
  movie: Movie;
  index: number;
  onRemove: (id: string) => void;
  onDragOver: (event: React.DragEvent<HTMLLIElement>, id: string) => void;
  onDrop: (id: string) => void;
  dragging: string | null;
  dragOver: string | null;
  onTouchStart: (id: string, clientY: number, element: HTMLLIElement) => void;
  onTouchMove: (clientY: number) => void;
  onTouchEnd: () => void;
}) {
  const isDragging = dragging === movie.id;
  const isOver = dragOver === movie.id && dragging && dragging !== movie.id;
  return (
    <li
      data-movie-id={movie.id}
      onDragOver={(event) => onDragOver(event, movie.id)}
      onDrop={() => onDrop(movie.id)}
      onTouchStart={(event) => onTouchStart(movie.id, event.touches[0]?.clientY ?? 0, event.currentTarget)}
      onTouchMove={(event) => onTouchMove(event.touches[0]?.clientY ?? 0)}
      onTouchEnd={onTouchEnd}
      className={`group relative flex gap-3 rounded-2xl border bg-[var(--wl-card)] p-3 transition-all sm:gap-4 sm:p-4 ${
        isOver ? "border-[var(--wl-accent)] shadow-[0_0_0_2px_rgba(255,77,47,0.35)]" : "border-[var(--wl-border)]"
      } ${isDragging ? "scale-[0.98] opacity-60" : ""}`}
    >
      <div className="flex shrink-0 items-center pl-1 text-[var(--wl-muted)] sm:pl-2" aria-hidden="true">
        <GripVertical className="size-4" />
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--wl-muted)] sm:hidden">
        #{index + 1}
      </div>
      <div className="w-16 shrink-0 sm:w-20">
        <MoviePoster src={movie.posterUrl} title={movie.title} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--wl-muted)] sm:inline">
                #{index + 1}
              </span>
              <h3 className="truncate text-base font-semibold leading-tight sm:text-lg">{movie.title}</h3>
            </div>
            <p className="mt-0.5 text-xs text-[var(--wl-muted)]">
              {movie.year ? `${movie.year}` : "Year unknown"}
              {movie.runtime ? ` · ${movie.runtime}` : ""}
              {movie.director ? ` · ${movie.director}` : ""}
            </p>
            {movie.genre && (
              <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.12em] text-[var(--wl-muted)]">
                {movie.genre}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(movie.id)}
            aria-label={`Remove ${movie.title}`}
            className="shrink-0 rounded-full p-1.5 text-[var(--wl-muted)] transition hover:bg-white/10 hover:text-[var(--wl-accent)]"
          >
            <X className="size-4" />
          </button>
        </div>
        {movie.note && (
          <p className="rounded-md border-l-2 border-[var(--wl-accent)] bg-black/30 px-2 py-1 text-xs italic text-zinc-300 sm:text-sm">
            {movie.note}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[var(--wl-muted)]">
          <span>by {movie.addedBy || "Anonymous"}</span>
          <span>{formatDate(movie.addedAt)}</span>
        </div>
      </div>
    </li>
  );
}

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState("");
  const [searchWarning, setSearchWarning] = useState("");
  const [searchProvider, setSearchProvider] = useState<"omdb" | "tmdb" | "">("");
  const [draft, setDraft] = useState<Draft>(() => readDraft());
  const [addingId, setAddingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const touchState = useRef<{ id: string; offset: number; list: HTMLLIElement[]; placeholderIndex: number } | null>(null);
  const reorderTimer = useRef<number | null>(null);

  const reorderMovies = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setMovies((current) => {
      const fromIndex = current.findIndex((m) => m.id === sourceId);
      const toIndex = current.findIndex((m) => m.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const next = current.slice();
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const persistOrder = useCallback((next: Movie[]) => {
    if (reorderTimer.current) window.clearTimeout(reorderTimer.current);
    reorderTimer.current = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/watchlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ movies: next.map(({ id, note }) => ({ id, note })) }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || "Could not save the new order.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save the new order.");
      }
    }, 350);
  }, []);

  useEffect(() => {
    if (dragging || dragOver) return;
    if (movies.length === 0) return;
    persistOrder(movies);
  }, [movies, dragging, dragOver, persistOrder]);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/watchlist", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load the watchlist.");
      setMovies(Array.isArray(data.movies) ? data.movies : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the watchlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  useEffect(() => {
    if (searchOpen) {
      const id = window.setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setSearchWarning("");
      setSearchProvider("");
      return;
    }
    const controller = new AbortController();
    const handle = window.setTimeout(async () => {
      setSearching(true);
      setSearchError("");
      setSearchWarning("");
      try {
        const response = await fetch(`/api/watchlist-search?q=${encodeURIComponent(trimmed)}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          setSearchError(data.error || "Search failed.");
          setSearchResults([]);
          return;
        }
        setSearchResults(Array.isArray(data.results) ? data.results : []);
        setSearchProvider(data.provider ?? "");
        if (typeof data.warning === "string") setSearchWarning(data.warning);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Search failed.");
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      window.clearTimeout(handle);
      controller.abort();
    };
  }, [searchQuery, searchOpen]);

  async function addMovie(result: SearchResult) {
    setError("");
    setSuccess("");
    setAddingId(`${result.provider}-${result.imdbId ?? result.tmdbId ?? result.title}`);
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          tmdbId: result.tmdbId,
          imdbId: result.imdbId,
          title: result.title,
          year: result.year,
          posterUrl: result.posterUrl,
          addedBy: draft.name || "Anonymous",
          note: draft.note,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add the movie.");
      setMovies((current) => [...current, data.movie]);
      setSearchResults((current) => current.filter((entry) => entry !== result));
      setSuccess(`Added ${data.movie.title} to the watchlist.`);
      setDraft({ name: draft.name, note: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the movie.");
    } finally {
      setAddingId(null);
    }
  }

  async function addManualMovie(event: React.FormEvent) {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const title = searchQuery.trim();
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          title,
          year: "",
          imdbId: `manual-${Date.now()}`,
          posterUrl: "",
          addedBy: draft.name || "Anonymous",
          note: draft.note,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add the movie.");
      setMovies((current) => [...current, data.movie]);
      setSearchQuery("");
      setSearchResults([]);
      setSuccess(`Added ${data.movie.title} to the watchlist.`);
      setDraft({ name: draft.name, note: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the movie.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeMovie(id: string) {
    setError("");
    setSuccess("");
    const previous = movies;
    setMovies((current) => current.filter((m) => m.id !== id));
    try {
      const response = await fetch(`/api/watchlist?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not remove the movie.");
      }
      const data = await response.json();
      if (Array.isArray(data.movies)) setMovies(data.movies);
    } catch (err) {
      setMovies(previous);
      setError(err instanceof Error ? err.message : "Could not remove the movie.");
    }
  }

  function onListDragOver(event: React.DragEvent<HTMLLIElement>, id: string) {
    event.preventDefault();
    if (dragOver !== id) setDragOver(id);
  }

  function onListDrop(id: string) {
    if (dragging) reorderMovies(dragging, id);
    setDragging(null);
    setDragOver(null);
  }

  function onListDragEnd() {
    setDragging(null);
    setDragOver(null);
  }

  function onTouchStart(id: string, clientY: number, listItem: HTMLLIElement) {
    const parent = listItem.parentElement;
    if (!parent) return;
    const items = Array.from(parent.querySelectorAll<HTMLLIElement>("li[data-movie-id]"));
    const targetRect = listItem.getBoundingClientRect();
    touchState.current = {
      id,
      offset: clientY - targetRect.top,
      list: items,
      placeholderIndex: items.findIndex((el) => el.dataset.movieId === id),
    };
  }

  function onTouchMove(clientY: number) {
    const state = touchState.current;
    if (!state) return;
    const original = state.list.find((el) => el.dataset.movieId === state.id);
    if (!original) return;
    const originalTop = original.getBoundingClientRect().top;
    original.style.transform = `translateY(${clientY - originalTop - state.offset}px)`;
    original.style.zIndex = "10";
    let newIndex = state.placeholderIndex;
    for (let i = 0; i < state.list.length; i += 1) {
      const rect = state.list[i].getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        newIndex = i;
        break;
      }
      newIndex = i;
    }
    if (newIndex !== state.placeholderIndex) {
      state.placeholderIndex = newIndex;
    }
  }

  function onTouchEnd() {
    const state = touchState.current;
    if (!state) return;
    const original = state.list.find((el) => el.dataset.movieId === state.id);
    if (original) {
      original.style.transform = "";
      original.style.zIndex = "";
    }
    const targetId = state.list[state.placeholderIndex]?.dataset.movieId;
    if (targetId && targetId !== state.id) {
      reorderMovies(state.id, targetId);
    }
    touchState.current = null;
  }

  const stats = useMemo(() => {
    if (movies.length === 0) return null;
    const last = movies[movies.length - 1];
    return { count: movies.length, latest: last };
  }, [movies]);

  return (
    <main
      style={
        {
          "--wl-background": theme.background,
          "--wl-surface": theme.surface,
          "--wl-card": theme.card,
          "--wl-border": theme.border,
          "--wl-border-strong": theme.borderStrong,
          "--wl-foreground": theme.foreground,
          "--wl-muted": theme.muted,
          "--wl-accent": theme.accent,
          "--wl-accent-soft": theme.accentSoft,
          "--wl-success": theme.success,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[var(--wl-background)] text-[var(--wl-foreground)]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .wl-sans { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .wl-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        @keyframes wl-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .wl-rise { animation: wl-rise .25s ease-out both; }
        [data-movie-id] { touch-action: pan-y; }
      `}</style>

      <header className="sticky top-0 z-20 border-b border-[var(--wl-border)] bg-[var(--wl-surface)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[var(--wl-accent)] text-white">
              <Clapperboard className="size-5" />
            </span>
            <div className="wl-sans">
              <h1 className="text-lg font-bold leading-none sm:text-xl">Watchlist</h1>
              <p className="mt-0.5 wl-mono text-[10px] uppercase tracking-[0.2em] text-[var(--wl-muted)] sm:text-[11px]">
                {movies.length === 0 ? "shared · empty" : `${movies.length} shared · drag to reorder`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="wl-sans inline-flex items-center gap-2 rounded-full bg-[var(--wl-accent)] px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 sm:px-4"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Add a movie</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <section className="border-b border-[var(--wl-border)] bg-[var(--wl-surface)]">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
            <form
              onSubmit={addManualMovie}
              className="wl-sans grid gap-3 rounded-2xl border border-[var(--wl-border)] bg-[var(--wl-card)] p-3 sm:p-4"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--wl-muted)]">
                  Title
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-[var(--wl-border-strong)] bg-black/30 px-3">
                    <Search className="size-4 text-[var(--wl-muted)]" />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search for a movie or add a custom title…"
                      className="wl-sans w-full bg-transparent py-2.5 text-sm text-[var(--wl-foreground)] outline-none placeholder:text-[var(--wl-muted)]"
                    />
                    {searching && <Loader2 className="size-4 animate-spin text-[var(--wl-muted)]" />}
                  </div>
                </label>
                <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--wl-muted)]">
                  Your name <span className="font-normal normal-case opacity-70">(optional)</span>
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    placeholder="Anonymous"
                    maxLength={48}
                    className="wl-sans mt-1.5 w-full rounded-lg border border-[var(--wl-border-strong)] bg-black/30 px-3 py-2.5 text-sm text-[var(--wl-foreground)] outline-none placeholder:text-[var(--wl-muted)] focus:border-[var(--wl-accent)]"
                  />
                </label>
              </div>
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--wl-muted)]">
                Note <span className="font-normal normal-case opacity-70">(optional)</span>
                <input
                  value={draft.note}
                  onChange={(event) => setDraft({ ...draft, note: event.target.value })}
                  placeholder="Why should we watch this?"
                  maxLength={280}
                  className="wl-sans mt-1.5 w-full rounded-lg border border-[var(--wl-border-strong)] bg-black/30 px-3 py-2.5 text-sm text-[var(--wl-foreground)] outline-none placeholder:text-[var(--wl-muted)] focus:border-[var(--wl-accent)]"
                />
              </label>

              {searchError && (
                <p className="wl-sans rounded-md border border-[var(--wl-accent)] bg-[var(--wl-accent-soft)] px-3 py-2 text-xs text-[var(--wl-accent)]">
                  {searchError}
                </p>
              )}
              {searchWarning && (
                <p className="wl-sans rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
                  {searchWarning}
                </p>
              )}

              {searchQuery.trim().length >= 2 && !searchError && (
                <div className="wl-sans">
                  <p className="wl-mono mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--wl-muted)]">
                    {searching
                      ? "searching…"
                      : searchResults.length === 0
                        ? "no matches · press Enter to add manually"
                        : `results via ${searchProvider || "movie api"} · click to add`}
                  </p>
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {searchResults.map((result) => {
                      const key = `${result.provider}-${result.imdbId ?? result.tmdbId ?? result.title}`;
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => addMovie(result)}
                            disabled={addingId === key}
                            className="wl-sans group flex w-full flex-col gap-2 overflow-hidden rounded-lg border border-[var(--wl-border)] bg-black/30 p-2 text-left transition hover:border-[var(--wl-accent)] hover:bg-[var(--wl-accent-soft)] disabled:opacity-50"
                          >
                            <div className="aspect-[2/3] w-full overflow-hidden rounded bg-black/40">
                              {result.posterUrl ? (
                                <img
                                  src={result.posterUrl}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img
                                  src={POSTER_PLACEHOLDER}
                                  alt=""
                                  aria-hidden="true"
                                  className="h-full w-full object-cover opacity-80"
                                />
                              )}
                            </div>
                            <div className="min-w-0 px-1 pb-1">
                              <p className="truncate text-xs font-semibold sm:text-sm">{result.title}</p>
                              <p className="wl-mono text-[10px] text-[var(--wl-muted)]">{result.year ?? "—"}</p>
                            </div>
                            {addingId === key && (
                              <div className="absolute inset-0 grid place-items-center bg-black/60">
                                <Loader2 className="size-5 animate-spin text-white" />
                              </div>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <p className="wl-mono text-[10px] uppercase tracking-[0.14em] text-[var(--wl-muted)]">
                  press <span className="rounded bg-white/10 px-1.5 py-0.5">Enter</span> to add as a custom title
                </p>
                <button
                  type="submit"
                  disabled={submitting || searchQuery.trim().length === 0}
                  className="wl-sans inline-flex items-center gap-2 rounded-full bg-[var(--wl-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                  Add manually
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        {error && (
          <p className="wl-sans mb-4 rounded-lg border border-[var(--wl-accent)] bg-[var(--wl-accent-soft)] px-3 py-2 text-sm text-[var(--wl-accent)]">
            {error}
          </p>
        )}
        {success && (
          <p className="wl-sans mb-4 flex items-center gap-2 rounded-lg border border-[var(--wl-success)] bg-[var(--wl-success)]/10 px-3 py-2 text-sm text-[var(--wl-success)]">
            <Check className="size-4" />
            {success}
          </p>
        )}

        {loading ? (
          <div className="wl-sans flex items-center justify-center gap-2 rounded-2xl border border-[var(--wl-border)] bg-[var(--wl-card)] py-12 text-sm text-[var(--wl-muted)]">
            <Loader2 className="size-4 animate-spin" />
            Loading the watchlist…
          </div>
        ) : movies.length === 0 ? (
          <div className="wl-sans grid place-items-center rounded-2xl border border-dashed border-[var(--wl-border-strong)] bg-[var(--wl-card)] px-6 py-16 text-center">
            <Clapperboard className="mb-3 size-8 text-[var(--wl-muted)]" />
            <h2 className="text-lg font-semibold">No movies yet</h2>
            <p className="mt-1 max-w-sm text-sm text-[var(--wl-muted)]">
              Add the first pick to start the list. Anyone visiting this page can add, remove, and reorder.
            </p>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="wl-sans mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--wl-accent)] px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="size-4" /> Add the first movie
            </button>
          </div>
        ) : (
          <ol className="grid gap-2.5 sm:gap-3">
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                draggable
                onDragStart={() => setDragging(movie.id)}
                onDragEnd={onListDragEnd}
                className="wl-rise cursor-grab active:cursor-grabbing"
                style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
              >
                <MovieRow
                  movie={movie}
                  index={index}
                  onRemove={removeMovie}
                  onDragOver={onListDragOver}
                  onDrop={onListDrop}
                  dragging={dragging}
                  dragOver={dragOver}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                />
              </div>
            ))}
          </ol>
        )}
      </section>

      {stats && (
        <footer className="mx-auto max-w-5xl px-4 pb-12 pt-2 text-[var(--wl-muted)] sm:px-6">
          <p className="wl-mono text-[10px] uppercase tracking-[0.18em]">
            {stats.count === 1
              ? "1 movie · drag to reorder, tap X to remove"
              : `${stats.count} movies · drag to reorder, tap X to remove`}
          </p>
          {stats.latest && (
            <p className="wl-sans mt-1 text-xs">
              Latest add: <span className="text-[var(--wl-foreground)]">{stats.latest.title}</span> by{" "}
              {stats.latest.addedBy || "Anonymous"}.
            </p>
          )}
        </footer>
      )}
    </main>
  );
}
