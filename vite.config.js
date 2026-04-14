import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  root: "src/site",          // <-- теперь HTML корень тут
  publicDir: "../../public", // <-- public относительно root

  resolve: {
    alias: {
      "/@src": path.resolve(__dirname, "src"),
    },
  },

  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: "/index.html",
  },

  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
});