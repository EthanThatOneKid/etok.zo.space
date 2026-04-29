import type { Context } from "hono";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const CONFIG = {
  version: "1.0.0",
  map: {
    w: 1006,
    h: 774,
    tile: 16,
    gridCols: 63,
    gridRows: 49,
  },
  assets: {
    map: "/images/amity-square/amity-square-map.png",
    mask: "/images/amity-square/amity-square-walk-mask.png",
    objects: "/amity-square-objs.json",
  },
  objectTypes: {
    npc: { name: "NPC", sprite: "", color: "#4A90D9" },
    trainer: { name: "Trainer", sprite: "", color: "#E05050" },
    sign: { name: "Sign", sprite: "", color: "#D4A056" },
    poke_ball: { name: "Poké Ball", sprite: "", color: "#E05050" },
    rock: { name: "Rock", sprite: "", color: "#888888" },
    flower: { name: "Flower", sprite: "", color: "#FF88CC" },
    lamp: { name: "Lamp", sprite: "", color: "#FFD700" },
    tree: { name: "Tree", sprite: "", color: "#3A8A3A" },
    fence: { name: "Fence", sprite: "", color: "#C8A060" },
  },
};

export default (c: Context) => c.json(CONFIG);
