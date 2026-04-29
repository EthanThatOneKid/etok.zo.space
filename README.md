# etok.zo.space

> **Zo Space mirror repo:** this repository mirrors the live routes running at `https://etok.zo.space`. Its job is to reflect the currently deployed Zo Space code as closely and immediately as possible.

- **Live site:** [https://etok.zo.space](https://etok.zo.space)
- **Zo Space API reference:** [docs.zocomputer.com/api](https://docs.zocomputer.com/api)

---

## How it works

```
GitHub (this repo) ← sync ← Zo Cloud API ← you (via update_space_route)
     ↑                        ↓
  development            etok.zo.space
  source of truth        (live running site)
```

**Zo.space routes run in Zo's cloud infrastructure — not on the local filesystem.** This repo exists as the mirrored Git representation of that live Zo Space, and should be kept in lockstep with deployed routes.

---

## Route map

| Route | Type | Description |
|-------|------|-------------|
| `/` | page | Homepage — Game of Life hero, bio, projects, live PST clock |
| `/gameboy-share` | page | Shared Game Room with live feed + multiplayer controls |
| `/api/gameboy-share-state` | api | Shared game room state + recent input events |
| `/api/gameboy-share-input` | api | Proxies controller input to shared upstream game session |

---

## Sync workflow

When you make changes to a route in this repo:

1. `git add && git commit && git push`
2. Run `update_space_route()` from Zo to push the updated code to the cloud

**For each significant update, commit a snapshot** with a version tag so there's a clean history of what ran on the live site and when.

---

## Challenge

Built for the [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge) (Apr 13–22, 2026).
