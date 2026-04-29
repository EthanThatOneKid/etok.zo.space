# etok.zo.space

> **Consolidated with `zo-hub`:** this repo overlaps with `zo-hub` for the homepage route. The active homepage mirror is `zo-hub`, which should reflect the latest deployed `/` route at `https://etok.zo.space`.

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
| `/` | page | Homepage mirror; keep this aligned with `zo-hub/routes/index.ts` |

---

## Sync workflow

When you make changes to the homepage mirror in this repo:

1. `git add && git commit && git push`
2. Run `update_space_route()` from Zo to push the updated code to the cloud

**For each significant update, commit a snapshot** with a version tag so there's a clean history of what ran on the live site and when.

---

## Challenge

Built for the [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge) (Apr 13–22, 2026).
