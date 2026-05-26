import type { Context } from "hono";

const spaces = [
  {
    "id": "reaction-diffusion-garden",
    "title": "Reaction Diffusion Garden",
    "discipline": "emergent patterns",
    "summary": "A Gray-Scott garden where visitors tune feed and kill rates until chemical blooms turn into weather.",
    "tags": [
      "reaction",
      "shader",
      "garden"
    ],
    "hue": 158,
    "motif": "Bloom lattice",
    "prompt": "Dial the nutrient stream, wake the catalyst, and watch a living texture decide whether it is moss, coral, or storm cloud.",
    "path": "/zo-grid/reaction-diffusion-garden",
    "url": "https://etok.zo.space/zo-grid/reaction-diffusion-garden"
  },
  {
    "id": "boid-airport",
    "title": "Boid Airport",
    "discipline": "flocking systems",
    "summary": "A runway where tiny aircraft follow separation, alignment, and cohesion without a control tower.",
    "tags": [
      "boids",
      "agents",
      "traffic"
    ],
    "hue": 39,
    "motif": "Flock vectors",
    "prompt": "Every gate is a rule. Every departure is negotiated by the flock.",
    "path": "/zo-grid/boid-airport",
    "url": "https://etok.zo.space/zo-grid/boid-airport"
  },
  {
    "id": "lorenz-bell-tower",
    "title": "Lorenz Bell Tower",
    "discipline": "chaos sculpture",
    "summary": "A bronze tower whose ringing ropes trace a Lorenz attractor through fog and midnight light.",
    "tags": [
      "chaos",
      "attractor",
      "orbit"
    ],
    "hue": 12,
    "motif": "Twin strange loops",
    "prompt": "Pull one bell rope and the whole tower answers from somewhere slightly impossible.",
    "path": "/zo-grid/lorenz-bell-tower",
    "url": "https://etok.zo.space/zo-grid/lorenz-bell-tower"
  },
  {
    "id": "cellular-automata-bakery",
    "title": "Cellular Automata Bakery",
    "discipline": "grid life",
    "summary": "A tiny bakery where bread, ovens, and customers evolve by cellular automata rules.",
    "tags": [
      "automata",
      "grid",
      "bakery"
    ],
    "hue": 50,
    "motif": "Rule 30 ovens",
    "prompt": "The sourdough is alive, the ovens are neighbors, and breakfast emerges one cell at a time.",
    "path": "/zo-grid/cellular-automata-bakery",
    "url": "https://etok.zo.space/zo-grid/cellular-automata-bakery"
  },
  {
    "id": "fourier-ferry",
    "title": "Fourier Ferry",
    "discipline": "epicycle drawing",
    "summary": "A harbor ferry piloted by nested circles that draw coastlines with Fourier epicycles.",
    "tags": [
      "fourier",
      "water",
      "drawing"
    ],
    "hue": 207,
    "motif": "Epicycle wake",
    "prompt": "Board the boat, then watch its wake reconstruct the shoreline from rotating memory.",
    "path": "/zo-grid/fourier-ferry",
    "url": "https://etok.zo.space/zo-grid/fourier-ferry"
  },
  {
    "id": "perlin-weather-station",
    "title": "Perlin Weather Station",
    "discipline": "noise fields",
    "summary": "A living weather wall where noise becomes wind, cloud cover, and migration maps.",
    "tags": [
      "noise",
      "terrain",
      "weather"
    ],
    "hue": 96,
    "motif": "Vector wind",
    "prompt": "The forecast is not predicted here. It is grown from gradients.",
    "path": "/zo-grid/perlin-weather-station",
    "url": "https://etok.zo.space/zo-grid/perlin-weather-station"
  },
  {
    "id": "maze-worm-cafe",
    "title": "Maze Worm Cafe",
    "discipline": "path finding",
    "summary": "A neon cafe where hungry maze worms use A* search to find crumbs before the room rearranges.",
    "tags": [
      "maze",
      "search",
      "worms"
    ],
    "hue": 327,
    "motif": "A-star tunnels",
    "prompt": "Order coffee, drop breadcrumbs, and make the walls change their mind.",
    "path": "/zo-grid/maze-worm-cafe",
    "url": "https://etok.zo.space/zo-grid/maze-worm-cafe"
  },
  {
    "id": "kinematic-puppet-theater",
    "title": "Kinematic Puppet Theater",
    "discipline": "inverse kinematics",
    "summary": "A puppet theater where tentacle marionettes solve inverse kinematics to chase spotlights.",
    "tags": [
      "ik",
      "motion",
      "theater"
    ],
    "hue": 267,
    "motif": "Joint chains",
    "prompt": "The spotlight moves first. The body invents itself afterward.",
    "path": "/zo-grid/kinematic-puppet-theater",
    "url": "https://etok.zo.space/zo-grid/kinematic-puppet-theater"
  },
  {
    "id": "fractal-subway-map",
    "title": "Fractal Subway Map",
    "discipline": "recursive cities",
    "summary": "A subway diagram that recursively grows neighborhoods, transfers, and tiny train myths.",
    "tags": [
      "fractals",
      "maps",
      "recursion"
    ],
    "hue": 190,
    "motif": "Recursive rail",
    "prompt": "Every station contains a smaller map. Every transfer returns you changed.",
    "path": "/zo-grid/fractal-subway-map",
    "url": "https://etok.zo.space/zo-grid/fractal-subway-map"
  },
  {
    "id": "genetic-chair-factory",
    "title": "Genetic Chair Factory",
    "discipline": "evolutionary design",
    "summary": "A chair factory where furniture mutates, competes, and evolves toward comfort and weirdness.",
    "tags": [
      "genetic",
      "fitness",
      "design"
    ],
    "hue": 31,
    "motif": "Chromosome frames",
    "prompt": "Sit in the winner. Recombine the loser. Let comfort become a species.",
    "path": "/zo-grid/genetic-chair-factory",
    "url": "https://etok.zo.space/zo-grid/genetic-chair-factory"
  },
  {
    "id": "spring-mass-observatory",
    "title": "Spring Mass Observatory",
    "discipline": "physics playground",
    "summary": "A mountaintop observatory held together by springs, constraints, and soft-body telescopes.",
    "tags": [
      "springs",
      "physics",
      "constraints"
    ],
    "hue": 184,
    "motif": "Elastic stars",
    "prompt": "The telescope bends toward gravity, then snaps a constellation into focus.",
    "path": "/zo-grid/spring-mass-observatory",
    "url": "https://etok.zo.space/zo-grid/spring-mass-observatory"
  },
  {
    "id": "markov-ghost-radio",
    "title": "Markov Ghost Radio",
    "discipline": "generative text",
    "summary": "A haunted radio station where Markov chains remix station IDs into spectral broadcasts.",
    "tags": [
      "markov",
      "text",
      "radio"
    ],
    "hue": 87,
    "motif": "Signal haunt",
    "prompt": "Tune between stations until the static remembers how to speak.",
    "path": "/zo-grid/markov-ghost-radio",
    "url": "https://etok.zo.space/zo-grid/markov-ghost-radio"
  }
];

export default async function handler(c: Context) {
  return c.json({
    generatedAt: new Date().toISOString(),
    sourceMood: ["threejs.org gallery", "Zo Pegasus brand", "dedicated /zo-grid spaces", "portal thumbnails"],
    count: spaces.length,
    spaces,
  });
}
