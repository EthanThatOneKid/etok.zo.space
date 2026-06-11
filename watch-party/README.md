# watch-party

Shared movies watchlist — runtime data for the `/watchlist` zo.space route.

## Layout

| File                  | Purpose                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| `watchlist.json`      | Mutable list of movies, ordered by position. Updated on add/reorder/delete. |

## Source of truth

The route code lives in [`etok.zopack.md`](../etok.zopack.md) under `### /watchlist` and `### /api/watchlist` / `### /api/watchlist-search`.

The JSON in this folder is **runtime state**, mirrored in zo.cloud. Treat it as scratch — the git history is for documentation, not authoritative data. If it ever needs to be reseeded, just write `"[]\n"` to `watchlist.json`.

## Required secrets

| Secret            | Why                                       | Sign up                                               |
| ----------------- | ----------------------------------------- | ----------------------------------------------------- |
| `OMDB_API_KEY`    | OMDb movie + poster search (preferred)    | https://www.omdbapi.com/apikey.aspx                   |
| `TMDB_API_KEY`    | TMDB movie + poster search (fallback)     | https://www.themoviedb.org/settings/api               |

Add at least one in [Settings > Advanced](https://etok.zo.computer/?t=settings&s=advanced) so `/api/watchlist-search` can return results. With neither key set, search returns a 503 and users can still add movies manually.
