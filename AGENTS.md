# etok.zo.space — Agent Memory

## Overview

This repo (`etok.zo.space`) is the mirrored Git copy of the live Zo Space routes on [https://etok.zo.space](https://etok.zo.space).

## Architecture

Zo.space routes run in Zo's cloud infrastructure — **NOT on the local filesystem**. Routes are managed exclusively via the Zo Space API (`update_space_route()`, etc.).

```
local files (this repo) → update_space_route() → Zo cloud → etok.zo.space
     ↑                                                        ↓
  source of truth                                    live running site
```

## Mirror Status

Treat this repo as the live mirror for `etok.zo.space`.
When the deployed routes change, this repo should be updated right away so Git history matches production.

## Sync protocol

1. **Develop locally** — edit route files in this repo
2. **Commit** — `git add && git commit && git push`
3. **Sync to Zo** — call `update_space_route()` with the new code

For every meaningful update, commit a versioned snapshot so Git history = deploy history.

## Route inventory

| Route | Type | Status |
|-------|------|--------|
| `/` | page | live — Game of Life hero, bio, PST clock |
| `/gameboy-share` | page | live — shared game room (multiplayer controls) |
| `/api/gameboy-share-state` | api | live — game room event/state feed |
| `/api/gameboy-share-input` | api | live — button input relay to shared session |

## Related

- [etok.me](https://etok.me) — main portfolio (external)
- [book repo](https://github.com/EthanThatOneKid/book) — knowledge base, meeting notes, zets
- [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge)
