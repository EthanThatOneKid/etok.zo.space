# etok.zo.space — Agent Memory

## Overview

This repo (`etok.zo.space`) is the **source of truth** for all Zo Space routes on [https://etok.zo.space](https://etok.zo.space).

## Architecture

Zo.space routes run in Zo's cloud infrastructure — **NOT on the local filesystem**. Routes are managed exclusively via the Zo Space API (`update_space_route()`, etc.).

```
local files (this repo) → update_space_route() → Zo cloud → etok.zo.space
     ↑                                                        ↓
  source of truth                                    live running site
```

## Sync protocol

1. **Develop locally** — edit route files in this repo
2. **Commit** — `git add && git commit && git push`
3. **Sync to Zo** — call `update_space_route()` with the new code

For every meaningful update, commit a versioned snapshot so Git history = deploy history.

## Route inventory

| Route | Type | Status |
|-------|------|--------|
| `/` | page | live — Game of Life hero, bio, PST clock |

## Related

- [etok.me](https://etok.me) — main portfolio (external)
- [book repo](https://github.com/EthanThatOneKid/book) — knowledge base, meeting notes, zets
- [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge)