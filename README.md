# etok.zo.space

> **Source of truth** for etok.zo.space routes. Synced to Zo cloud via `update_space_route()` API.

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

**Zo.space routes run in Zo's cloud infrastructure — not on the local filesystem.** This repo is the canonical source of truth. Changes are developed here first, then pushed to Zo via the space API tools.

---

## Route map

| Route | Type | Description |
|-------|------|-------------|
| `/` | page | Homepage — Game of Life hero, bio, projects, live PST clock |

---

## Sync workflow

When you make changes to a route in this repo:

1. `git add && git commit && git push`
2. Run `update_space_route()` from Zo to push the updated code to the cloud

**For each significant update, commit a snapshot** with a version tag so there's a clean history of what ran on the live site and when.

---

## Challenge

Built for the [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge) (Apr 13–22, 2026).