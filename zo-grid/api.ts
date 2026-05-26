import type { Context } from "hono";

const spaces = [
  { id: "qa-space", title: "QA Space", path: "/qa-space", url: "https://etok.zo.space/qa-space", discipline: "testing lab", summary: "A public workspace for QA experiments and interface checks.", tags: ["qa", "lab", "space"] },
  { id: "durvasula-quiz", title: "Durvasula Quiz", path: "/durvasula-quiz", url: "https://etok.zo.space/durvasula-quiz", discipline: "quiz", summary: "A focused interactive quiz route.", tags: ["quiz", "learning", "interactive"] },
  { id: "docs", title: "Docs", path: "/docs", url: "https://etok.zo.space/docs", discipline: "documentation", summary: "A document-oriented Zo Space route.", tags: ["docs", "reference", "writing"] },
  { id: "tworek-quiz", title: "Tworek Quiz", path: "/tworek-quiz", url: "https://etok.zo.space/tworek-quiz", discipline: "quiz", summary: "Another public quiz surface in the space collection.", tags: ["quiz", "prompt", "study"] },
  { id: "home", title: "Home", path: "/", url: "https://etok.zo.space/", discipline: "homepage", summary: "The root landing page for etok.zo.space.", tags: ["home", "index", "zo"] },
  { id: "birthday", title: "Birthday", path: "/birthday", url: "https://etok.zo.space/birthday", discipline: "celebration", summary: "A public birthday-themed page.", tags: ["event", "party", "page"] },
  { id: "built-with-zo", title: "Built With Zo", path: "/built-with-zo", url: "https://etok.zo.space/built-with-zo", discipline: "showcase", summary: "A showcase surface for things built with Zo.", tags: ["zo", "showcase", "build"] },
  { id: "collaborative-edge", title: "Collaborative Edge", path: "/collaborative-edge", url: "https://etok.zo.space/collaborative-edge", discipline: "collaboration", summary: "A public route exploring collaborative interfaces.", tags: ["collab", "edge", "tools"] },
  { id: "dvd-collection", title: "DVD Collection", path: "/dvd-collection", url: "https://etok.zo.space/dvd-collection", discipline: "catalog", summary: "A media collection page for DVDs.", tags: ["media", "archive", "catalog"] },
  { id: "farzapedia-demo", title: "Farzapedia Demo", path: "/farzapedia-demo", url: "https://etok.zo.space/farzapedia-demo", discipline: "demo", summary: "A wiki-like demo page.", tags: ["demo", "wiki", "knowledge"] },
  { id: "wazoo", title: "Wazoo", path: "/wazoo", url: "https://etok.zo.space/wazoo", discipline: "project hub", summary: "A Wazoo project route.", tags: ["wazoo", "project", "hub"] },
  { id: "ethanxnancy", title: "Ethan x Nancy", path: "/ethanxnancy", url: "https://etok.zo.space/ethanxnancy", discipline: "personal", summary: "A personal public page.", tags: ["personal", "page", "story"] },
  { id: "mikki-out-2026", title: "Mikki Out 2026", path: "/mikki-out-2026", url: "https://etok.zo.space/mikki-out-2026", discipline: "event", summary: "An event-style public page.", tags: ["event", "2026", "page"] },
  { id: "zocabulary", title: "Zocabulary", path: "/zocabulary", url: "https://etok.zo.space/zocabulary", discipline: "dictionary", summary: "A crowd-sourced Zo vocabulary page.", tags: ["words", "zo", "submit"] },
  { id: "join-wazoo", title: "Join Wazoo", path: "/join-wazoo", url: "https://etok.zo.space/join-wazoo", discipline: "signup", summary: "A join page for Wazoo.", tags: ["join", "wazoo", "form"] },
  { id: "space-3ds-demo", title: "3DS Demo", path: "/space/3ds-demo", url: "https://etok.zo.space/space/3ds-demo", discipline: "handheld web", summary: "A Zo Space demo shaped around Nintendo 3DS constraints.", tags: ["3ds", "demo", "browser"] },
  { id: "3ds-browser-maze", title: "3DS Browser Maze", path: "/3ds-browser-maze", url: "https://etok.zo.space/3ds-browser-maze", discipline: "game", summary: "A maze experiment for small-screen browsing.", tags: ["maze", "3ds", "game"] },
  { id: "workspaces-3ds-demo", title: "Workspaces 3DS Demo", path: "/workspaces/3ds-demo", url: "https://etok.zo.space/workspaces/3ds-demo", discipline: "workspace demo", summary: "A workspace-flavored 3DS demonstration route.", tags: ["workspace", "3ds", "demo"] },
  { id: "venues", title: "Venues", path: "/venues", url: "https://etok.zo.space/venues", discipline: "map", summary: "A route for venue-style browsing.", tags: ["venues", "places", "map"] },
  { id: "talk-with-zo", title: "Talk With Zo", path: "/talk-with-zo", url: "https://etok.zo.space/talk-with-zo", discipline: "conversation", summary: "A public surface for talking with Zo.", tags: ["chat", "zo", "voice"] },
  { id: "pokemon-global-link-timeline", title: "Pokemon Global Link Timeline", path: "/pokemon-global-link-timeline", url: "https://etok.zo.space/pokemon-global-link-timeline", discipline: "timeline", summary: "A timeline page for Pokemon Global Link history.", tags: ["pokemon", "timeline", "archive"] },
  { id: "giver-map", title: "Giver Map", path: "/giver-map", url: "https://etok.zo.space/giver-map", discipline: "map", summary: "A map-oriented public route.", tags: ["map", "giving", "places"] },
  { id: "business-card", title: "Business Card", path: "/business-card", url: "https://etok.zo.space/business-card", discipline: "identity", summary: "A compact business-card style page.", tags: ["card", "identity", "profile"] },
  { id: "amity-square-mask-editor", title: "Amity Square Mask Editor", path: "/amity-square-mask-editor", url: "https://etok.zo.space/amity-square-mask-editor", discipline: "editor", summary: "An editor route connected to Amity Square.", tags: ["amity", "editor", "mask"] },
  { id: "amity-square", title: "Amity Square", path: "/amity-square", url: "https://etok.zo.space/amity-square", discipline: "game space", summary: "A playful Amity Square route.", tags: ["amity", "pokemon", "space"] },
  { id: "king-of-the-hill-season-15", title: "King of the Hill Season 15", path: "/king-of-the-hill-season-15", url: "https://etok.zo.space/king-of-the-hill-season-15", discipline: "countdown", summary: "A fan-facing public page for King of the Hill season 15.", tags: ["tv", "countdown", "fan"] },
  { id: "venture-town", title: "Venture Town", path: "/venture-town", url: "https://etok.zo.space/venture-town", discipline: "3D town", summary: "A town-like public route for venture exploration.", tags: ["venture", "town", "3d"] },
  { id: "multi-window-starfish", title: "Multi Window Starfish", path: "/multi-window-starfish", url: "https://etok.zo.space/multi-window-starfish", discipline: "browser toy", summary: "A multi-window browser experiment.", tags: ["windows", "starfish", "toy"] },
  { id: "globe", title: "Globe", path: "/globe", url: "https://etok.zo.space/globe", discipline: "visualization", summary: "A globe-oriented visualization route.", tags: ["globe", "3d", "map"] },
  { id: "regular-show-lost-tapes-countdown", title: "Regular Show Lost Tapes Countdown", path: "/regular-show-lost-tapes-countdown", url: "https://etok.zo.space/regular-show-lost-tapes-countdown", discipline: "countdown", summary: "A countdown page for the Regular Show Lost Tapes project.", tags: ["regular show", "countdown", "fan"] },
  { id: "zoplayspokemon", title: "Zo Plays Pokemon", path: "/zoplayspokemon", url: "https://etok.zo.space/zoplayspokemon", discipline: "game", summary: "A public room-based Pokemon play surface.", tags: ["pokemon", "gameboy", "game"] },
  { id: "zo-space-10print", title: "Zo Space 10PRINT", path: "/zo-space-10print", url: "https://etok.zo.space/zo-space-10print", discipline: "generative art", summary: "A 10PRINT-inspired generative Zo Space.", tags: ["10print", "generative", "art"] },
];

export default async function handler(c: Context) {
  return c.json({
    generatedAt: new Date().toISOString(),
    sourceMood: ["threejs.org gallery", "Zo Pegasus brand", "real etok.zo.space routes"],
    count: spaces.length,
    spaces,
  });
}
