// scripts/vite-plugin-html-include.js
// Vite plugin that processes @@include('path', {vars}) directives in HTML files.

import fs from "node:fs";
import path from "node:path";

/**
 * Parse and inline @@include('file', {vars}) calls in HTML.
 * Supports:
 *   @@include('partials/head.html', {"title": "My Page", "description": "..."})
 *   @@include('../partials/footer.html', {})
 * Variables are substituted as @@key in the included file.
 */
function processIncludes(html, filePath) {
  const fileDir = path.dirname(filePath);

  // We iterate to handle nested includes (included files may themselves include others)
  let MAX_PASSES = 10;
  let result = html;

  while (MAX_PASSES-- > 0 && result.includes("@@include(")) {
    result = expandIncludes(result, fileDir, filePath);
    if (!result.includes("@@include(")) break;
  }

  return result;
}

function expandIncludes(html, fileDir, filePath) {
  const output = [];
  let i = 0;

  while (i < html.length) {
    const marker = "@@include(";
    const startIdx = html.indexOf(marker, i);

    if (startIdx === -1) {
      output.push(html.slice(i));
      break;
    }

    output.push(html.slice(i, startIdx));
    let j = startIdx + marker.length;

    // Skip whitespace
    while (j < html.length && /\s/.test(html[j])) j++;

    // Read quote character
    const quote = html[j];
    if (quote !== '"' && quote !== "'") {
      // Not a valid @@include — emit as-is and move past the marker
      output.push(html.slice(startIdx, startIdx + marker.length));
      i = startIdx + marker.length;
      continue;
    }
    j++; // skip opening quote

    // Read include path
    const pathStart = j;
    while (j < html.length && html[j] !== quote) j++;
    const includePath = html.slice(pathStart, j);
    j++; // skip closing quote

    // Skip whitespace
    while (j < html.length && /\s/.test(html[j])) j++;

    // Read optional vars object
    let vars = {};
    if (j < html.length && html[j] === ",") {
      j++; // skip comma
      while (j < html.length && /\s/.test(html[j])) j++;

      if (j < html.length && html[j] === "{") {
        // Find matching closing brace, accounting for nested braces and strings
        const objStart = j;
        let depth = 1;
        j++; // skip opening {
        let inStr = false;
        let strChar = "";

        while (j < html.length && depth > 0) {
          const ch = html[j];
          if (inStr) {
            if (ch === "\\" && html[j + 1]) {
              j += 2;
              continue;
            }
            if (ch === strChar) inStr = false;
          } else {
            if (ch === '"' || ch === "'") {
              inStr = true;
              strChar = ch;
            } else if (ch === "{") {
              depth++;
            } else if (ch === "}") {
              depth--;
            }
          }
          j++;
        }

        const objStr = html.slice(objStart, j);
        try {
          vars = JSON.parse(objStr);
        } catch {
          // Ignore parse errors — treat as no vars
        }
      }
    }

    // Skip to closing paren
    while (j < html.length && html[j] !== ")") j++;
    j++; // skip ')'

    // Resolve the included file path
    const resolvedPath = path.resolve(fileDir, includePath);

    try {
      let content = fs.readFileSync(resolvedPath, "utf-8");

      // Substitute @@key placeholders with values from vars
      for (const [key, value] of Object.entries(vars)) {
        content = content.split(`@@${key}`).join(value != null ? String(value) : "");
      }

      // Clear any remaining @@key placeholders that had no matching var
      content = content.replace(/@@[a-zA-Z_]\w*/g, "");

      output.push(content);
    } catch {
      // File not found or unreadable — leave the original directive
      output.push(html.slice(startIdx, j));
    }

    i = j;
  }

  return output.join("");
}

export default function htmlIncludePlugin() {
  return {
    name: "vite-plugin-html-include",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        if (!ctx.filename) return html;
        return processIncludes(html, ctx.filename);
      },
    },
  };
}
