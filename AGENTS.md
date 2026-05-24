# etok.zo.space

## Overview

This repo is the Git source of truth for [etok.zo.space](https://etok.zo.space). Route source lives in [`etok.zopack.md`](etok.zopack.md).

## Architecture

Zo.space routes run in Zo's cloud infrastructure — **not on the local filesystem**. Routes are deployed via the Zo Space API (`update_space_route()`, etc.).

```
etok.zopack.md (this repo) → update_space_route() → Zo cloud → etok.zo.space
         ↑                                                        ↓
   source of truth                                      live running site
```

## Sync protocol

1. **Develop locally** — edit route code in `etok.zopack.md`
2. **Commit** — `git add && git commit && git push`
3. **Sync to Zo** — call `update_space_route()` with the route code from the pack (or use `zopack import` to get the JSON plan)

For every meaningful update, commit a versioned snapshot so Git history matches deploy history.

## Local serve

Run from the repo root with [zopack-cli](https://github.com/EthanThatOneKid/zopack-cli) linked globally (`bun link` in that repo):

```bash
zopack serve --file etok.zopack.md
```

## Route inventory

| Route | Type | Status |
|-------|------|--------|
| `/` | page | live — homepage mirror |

## Related

- [etok.me](https://etok.me) — main portfolio (external)
- [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge)
