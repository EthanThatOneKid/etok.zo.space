import type { Context } from "hono";
import { writeFile, readFile, copyFile } from "fs/promises";
import { existsSync } from "fs";

const WORKSPACE = "/home/workspace";
const VERSIONS_DIR = `${WORKSPACE}/amity-square/versions`;
const MASK_FILE = `${WORKSPACE}/amity-square/mask.png`;
const INDEX_FILE = `${VERSIONS_DIR}/index.json`;

export default async (c: Context) => {
  const versionId = c.req.query("version_id") ?? c.req.query("version");

  if (!versionId) {
    // List all available versions
    let index: Array<{ ts: number; path: string }> = [];
    try {
      const raw = await readFile(INDEX_FILE, "utf-8");
      index = JSON.parse(raw);
    } catch { /* fresh */ }
    return c.json({ versions: index.slice(-10).reverse(), latest: index.at(-1) });
  }

  const ts = parseInt(versionId);
  const vPath = `${VERSIONS_DIR}/v_${ts}-mask.png`;

  if (!existsSync(vPath)) {
    return c.json({ error: `Version ${versionId} not found` }, 404);
  }

  await copyFile(vPath, MASK_FILE);
  return c.json({ ok: true, message: `Rolled back to version ${ts}. Refresh the game.` });
};
