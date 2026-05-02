import type { ExpandGlobOptions } from "jsr:@std/fs@^1.0.1";
import { expandGlob } from "jsr:@std/fs@^1.0.1";
import { toFileUrl } from "jsr:@std/path@^1.0.2";
import React from "npm:react@19.0.0";
import { renderToString } from "npm:react-dom@19.0.0/server";

export async function* expandGlobImport(
  glob: string | URL,
  options?: ExpandGlobOptions,
): AsyncGenerator<[string, unknown]> {
  for await (const entry of expandGlob(glob, options)) {
    const tsxPath = entry.path.replace(/\.ts$/, ".tsx");
    await Deno.copyFile(entry.path, tsxPath);
    
    // Add dynamic cache-busting so it picks up the latest edits
    const fileUrl = toFileUrl(tsxPath).href + `?cache=${Date.now()}`;
    const module = await import(fileUrl);
    
    await Deno.remove(tsxPath);
    yield [entry.path, module];
  }
}

export async function fromAsync<T>(
  generator: AsyncGenerator<[string, T]>,
): Promise<Map<string, T>> {
  const result = new Map<string, T>();
  for await (const [key, value] of generator) {
    result.set(key, value);
  }
  return result;
}

export function expandGlobImportToMap(
  glob: string | URL,
  options?: ExpandGlobOptions,
): Promise<Map<string, any>> {
  return fromAsync(expandGlobImport(glob, options));
}

console.log("Zo Space SSR server listening on http://localhost:5173/");

Deno.serve({ port: 5173 }, async (req) => {
  const url = new URL(req.url);

  // Load all route modules
  const routesMap = await expandGlobImportToMap("./routes/**/*.ts");

  let matchedModule: any = null;
  for (const [path, module] of routesMap) {
    const normalized = path.replace(/\\/g, "/");
    
    // API Route Match
    if (url.pathname.startsWith("/api/")) {
      const name = normalized.split("/routes/api/")[1]?.replace(".ts", "");
      if (name && url.pathname === `/api/${name}`) {
        matchedModule = module;
        break;
      }
    } else {
      // UI Page Match
      if (url.pathname === "/" && normalized.endsWith("routes/index.ts")) {
        matchedModule = module;
        break;
      }
      const name = normalized.split("/routes/")[1]?.replace(".ts", "");
      if (name && url.pathname === `/${name}`) {
        matchedModule = module;
        break;
      }
    }
  }

  if (!matchedModule || !matchedModule.default) {
    return new Response("404 Not Found", { status: 404 });
  }

  // Handle API Endpoint
  if (url.pathname.startsWith("/api/")) {
    const c = {
      req: {
        query: (key: string) => url.searchParams.get(key) || undefined,
        json: async () => req.body ? await req.json() : {},
      },
      json: (data: any) => new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" }
      })
    };
    try {
      return await matchedModule.default(c);
    } catch (err) {
      console.error(err);
      return new Response(String(err), { status: 500 });
    }
  }

  // Handle UI Endpoint via SSR
  try {
    const body = renderToString(React.createElement(matchedModule.default));

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>etok.zo.space - Deno SSR</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-[#0a100a] text-white">
    <div id="root">${body}</div>
  </body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  } catch (err) {
    console.error(err);
    return new Response(String(err), { status: 500 });
  }
});
