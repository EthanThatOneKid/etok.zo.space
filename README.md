# etok.zo.space

The canonical mirror of the live Zo Space at [https://etok.zo.space](https://etok.zo.space).

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

**Zo.space routes run in Zo's cloud infrastructure — not on the local filesystem.** This repo mirrors the live Zo Space and should be kept in lockstep with deployed routes.

---

## Route map

| Route | Type | Description |
|-------|------|-------------|
| `/` | page | Homepage — Game of Life hero, project cards, social links |

---

## Sync workflow

When you make changes:

1. `git add && git commit && git push`
2. Run `update_space_route()` from Zo to push the updated code to the cloud

**For each significant update, commit a snapshot** with a version tag so there's a clean history of what ran on the live site and when.

---

## Tech

- **Framework:** Zo Space (Hono + React on Bun)
- **Styling:** Tailwind CSS 4
- **Animation:** Canvas-based Conway's Game of Life, mouse-reactive glow
- **Live clock:** Pacific time zone display

---

## Related

- [etok.me](https://etok.me) — main portfolio (external)
- [book repo](https://github.com/EthanThatOneKid/book) — knowledge base, meeting notes, zets
- [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge)
