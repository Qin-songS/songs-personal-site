import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { handleAiRequest } from "./server/ai.js";

function aiDevServer(runtimeEnv) {
  return {
    name: "songs-ai-dev-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/ai/")) return next();

        try {
          const protocol = req.socket.encrypted ? "https" : "http";
          const url = new URL(req.url, `${protocol}://${req.headers.host}`);
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const request = new Request(url, {
            method: req.method,
            headers: req.headers,
            body,
          });
          const response = await handleAiRequest(request, runtimeEnv);
          if (!response) return next();

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          server.config.logger.error(error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Local AI endpoint failed" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const runtimeEnv = { ...process.env, ...loadEnv(mode, import.meta.dirname, "") };

  return {
    plugins: [react(), aiDevServer(runtimeEnv)],
    build: {
      rollupOptions: {
        input: {
          home: resolve(import.meta.dirname, "index.html"),
          field: resolve(import.meta.dirname, "field/index.html"),
          lab: resolve(import.meta.dirname, "lab/index.html"),
          zh: resolve(import.meta.dirname, "zh/index.html"),
          note: resolve(import.meta.dirname, "notes/why-this-site/index.html"),
          zhNote: resolve(
            import.meta.dirname,
            "zh/notes/why-this-site/index.html",
          ),
        },
      },
    },
  };
});
