import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        zh: resolve(import.meta.dirname, "zh/index.html"),
        note: resolve(import.meta.dirname, "notes/why-this-site/index.html"),
        zhNote: resolve(
          import.meta.dirname,
          "zh/notes/why-this-site/index.html",
        ),
      },
    },
  },
});
