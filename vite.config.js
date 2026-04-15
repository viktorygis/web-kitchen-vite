import { defineConfig } from "vite";
import path from "node:path";
import fs from "node:fs";
import htmlIncludePlugin from "./scripts/vite-plugin-html-include.js";

// Recursively collect all .html files under `dir`, returning
// { inputKey: absolutePath } for Rollup MPA inputs.
// Files inside a "partials" directory are excluded.
function collectHtmlInputs(dir, base = dir) {
  const inputs = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "partials") continue; // skip partials folder
      Object.assign(inputs, collectHtmlInputs(fullPath, base));
    } else if (entry.name.endsWith(".html")) {
      // Use a slash-based key (works on Windows too)
      const rel = path.relative(base, fullPath).split(path.sep).join("/");
      const key = rel.replace(/\.html$/, "");
      inputs[key] = fullPath;
    }
  }
  return inputs;
}

const srcDir = path.resolve(__dirname, "src");

export default defineConfig({
  root: "src",
  publicDir: "../public",

  resolve: {
    alias: {
      "/@src": srcDir,
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: "/index.html",
  },

  plugins: [htmlIncludePlugin()],

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtmlInputs(srcDir),
    },
  },
});
