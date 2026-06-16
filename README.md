# etok.zo.space

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

**Zo.space routes run in Zo's cloud infrastructure — not on the local filesystem.** This repo stores the route source in [`etok.zopack.md`](etok.zopack.md) and should be kept in lockstep with the live Zo Space.

---

## Route map

| Route | Type | Description |
|-------|------|-------------|
| `/` | page | Homepage mirror |
| `/watchlist` | page | Shared movies watchlist (collaborative) |
| `/api/watchlist` | api | CRUD + reorder for the watchlist |
| `/api/watchlist-search` | api | Movie title search (OMDb / TMDb proxy) |
| `/clown` | page | Request-metadata probe |
| `/api/clown-probe` | api | Request-metadata probe endpoint |

---

## Sync workflow

When you change the homepage mirror:

1. Edit route code in [`etok.zopack.md`](etok.zopack.md) (under `## Routes`)
2. `git add && git commit && git push`
3. Run `update_space_route()` from Zo to push the updated code to the cloud

**For each significant update, commit a snapshot** with a version tag so there's a clean history of what ran on the live site and when.

---

## Local development

Use **[zopack-cli](https://github.com/EthanThatOneKid/zopack-cli)** to run the pack locally:

```bash
cd /path/to/zopack-cli
bun install
bun link

cd /path/to/etok.zo.space
zopack serve --file etok.zopack.md
```

Open `http://localhost:5173/` for the homepage mirror. Use that port — `zopack serve` defaults to 5173.

To preview the deployment plan before syncing to Zo:

```bash
zopack import --file etok.zopack.md --handle etok --preview
```

---

## Challenge

Built for the [Zo x Contra Challenge](https://contra.com/community/topic/zocomputerchallenge) (Apr 13–22, 2026).
