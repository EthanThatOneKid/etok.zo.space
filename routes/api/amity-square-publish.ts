import type { Context } from "hono";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";

const WORKSPACE = "/home/workspace";
const VERSIONS_DIR = `${WORKSPACE}/amity-square/versions`;
const MASK_FILE = `${WORKSPACE}/amity-square/mask.png`;
const OBJS_FILE = `${WORKSPACE}/amity-square/objects.json`;
const INDEX_FILE = `${VERSIONS_DIR}/index.json`;

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdir.sync(dir, { recursive: true });
}

export default async (c: Context) => {
  ensureDir(VERSIONS_DIR);
  ensureDir(WORKSPACE + "/amity-square");

  const form = await c.req.parseForm();

  let savedMask = false;
  let savedObjs = 0;
  const maskFile = form.get("mask") as Blob | null;

  if (maskFile && maskFile.size > 0) {
    const buf = Buffer.from(await maskFile.arrayBuffer());
    await writeFile(MASK_FILE, buf);
    savedMask = true;

    const ts = Math.floor(Date.now() / 1000);
    const vPath = `${VERSIONS_DIR}/v_${ts}-mask.png`;
    await writeFile(vPath, buf);

    let index: Array<{ ts: number; path: string }> = [];
    try {
      const raw = await readFile(INDEX_FILE, "utf-8");
      index = JSON.parse(raw);
    } catch { /* fresh */ }
    index.push({ ts, path: vPath });
    await writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
  }

  const objsFile = form.get("objects") as string | null;
  if (objsFile) {
    try {
      await writeFile(OBJS_FILE, objsFile);
      const parsed = JSON.parse(objsFile);
      savedObjs = Array.isArray(parsed.objects) ? parsed.objects.length : 0;
    } catch { /* ignore */ }
  }

  return c.json({
    ok: true,
    saved: { mask: savedMask, objects: savedObjs },
    message: `Published mask=${savedMask} objects=${savedObjs}.`,
  });
};
