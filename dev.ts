import * as esbuild from "npm:esbuild@^0.24.2";

console.log("Zo Space CLI listening on http://localhost:5173/");

Deno.serve({ port: 5173 }, async (req) => {
  const url = new URL(req.url);

  // Serve bundled routes
  if (url.pathname === "/routes/index.js") {
    try {
      const result = await esbuild.build({
        entryPoints: ["./routes/index.ts"],
        bundle: true,
        write: false,
        format: "esm",
        jsx: "automatic",
        jsxImportSource: "https://esm.sh/react@19.0.0",
        loader: { ".ts": "tsx" },
        external: ["react", "react-dom", "react-dom/client"],
      });

      return new Response(result.outputFiles[0].text, {
        headers: { "content-type": "application/javascript" },
      });
    } catch (err) {
      console.error(err);
      return new Response(String(err), { status: 500 });
    }
  }

  // Render the single HTML page
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>etok.zo.space - Deno Local</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19.0.0?dev",
        "react/jsx-runtime": "https://esm.sh/react@19.0.0/jsx-runtime?dev",
        "react-dom/client": "https://esm.sh/react-dom@19.0.0/client?dev"
      }
    }
    </script>
  </head>
  <body class="bg-[#0a100a] text-white">
    <div id="root"></div>
    <script type="module">
      import React from "react";
      import ReactDOM from "react-dom/client";
      import Profile from "/routes/index.js";

      ReactDOM.createRoot(document.getElementById("root")).render(
        React.createElement(React.StrictMode, null, React.createElement(Profile))
      );
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
});
