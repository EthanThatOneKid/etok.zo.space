import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Context } from "hono";

const DATA_DIR = "/home/workspace/zo-pun-dictionary";
const DATA_FILE = `${DATA_DIR}/submissions.json`;
const MAX_DISPLAY_NAME = 48;
const MAX_WORD = 80;
const MAX_DEFINITION = 520;
const MAX_EXAMPLE = 320;

type Submission = {
  id: string;
  displayName: string;
  word: string;
  definition: string;
  example: string;
  createdAt: string;
};

function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

async function readSubmissions(): Promise<Submission[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, "[]\n", "utf8");
    return [];
  }
}

async function writeSubmissions(submissions: Submission[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(submissions, null, 2)}\n`, "utf8");
}

function validateInput(body: Record<string, unknown>) {
  const displayName = clean(body.displayName, MAX_DISPLAY_NAME) || "Anonymous";
  const word = clean(body.word, MAX_WORD);
  const definition = clean(body.definition, MAX_DEFINITION);
  const example = clean(body.example, MAX_EXAMPLE);
  const website = clean(body.website, 120);

  if (website) return { error: "Submission rejected." };
  if (!word) return { error: "Add a word or phrase." };
  if (!word.toLowerCase().includes("zo")) return { error: "The word or phrase must include 'zo'." };
  if (!definition) return { error: "Add a definition or context." };

  return { displayName, word, definition, example };
}

export default async function handler(c: Context) {
  if (c.req.method === "GET") {
    const submissions = await readSubmissions();
    return c.json({ submissions: submissions.slice().reverse() });
  }

  if (c.req.method !== "POST") {
    return c.json({ error: "Method not allowed" }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const result = validateInput(body);
  if ("error" in result) return c.json({ error: result.error }, 400);

  const submissions = await readSubmissions();
  const normalizedWord = result.word.toLowerCase();
  const duplicate = submissions.some((entry) => entry.word.toLowerCase() === normalizedWord);
  if (duplicate) return c.json({ error: "That Zo word is already in the dictionary." }, 409);

  const submission: Submission = {
    id: randomUUID(),
    displayName: result.displayName,
    word: result.word,
    definition: result.definition,
    example: result.example,
    createdAt: new Date().toISOString(),
  };

  submissions.push(submission);
  await writeSubmissions(submissions);

  return c.json({ ok: true, submission }, 201);
}