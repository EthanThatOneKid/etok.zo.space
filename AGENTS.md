# etok.zo.space — Agent Memory

## Overview

This repo (`etok.zo.space`) overlaps with `zo-hub` for the homepage route on [https://etok.zo.space](https://etok.zo.space).
Treat `zo-hub` as the active homepage mirror and keep `routes/index.ts` here aligned with it when this repo is touched.

## Architecture

Zo.space routes run in Zo's cloud infrastructure — **NOT on the local filesystem**. Routes are managed exclusively via the Zo Space API (`update_space_route()`, etc.).

```
local files (this repo) → update_space_route() → Zo cloud → etok.zo.space
     ↑                                                        ↓
  source of truth                                    live running site
```

## Mirror Status

This repo is no longer the broad canonical mirror for every route.
Its remaining practical role is as a duplicate homepage mirror that should match `zo-hub`.

## Sync protocol

1. **Develop locally** — edit route files in this repo
2. **Commit** — `git add && git commit && git push`
3. **Sync to Zo** — call `update_space_route()` with the new code

For every meaningful update, commit a versioned snapshot so Git history = deploy history.

## Route inventory

| Route | Type | Status |
|-------|------|--------|
| `/` | page | live — homepage mirror, should stay aligned with `zo-hub/routes/index.ts` |

## Related

- [etok.me](https://etok.me) — main portfolio (external)
- [book repo](https://github.com/EthanThatOneKid/book) — knowledge base, meeting notes, zets
- [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge)
