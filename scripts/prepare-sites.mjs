import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });

await copyFile(
  resolve(root, "server", "index.js"),
  resolve(dist, "server", "index.js"),
);
await copyFile(
  resolve(root, "server", "ai.js"),
  resolve(dist, "server", "ai.js"),
);
await copyFile(
  resolve(root, ".openai", "hosting.json"),
  resolve(dist, ".openai", "hosting.json"),
);

for (const page of ["thoughts", "about", "profile"]) {
  const pageDirectory = resolve(dist, "field", page);
  await mkdir(pageDirectory, { recursive: true });
  await copyFile(
    resolve(dist, "field", "index.html"),
    resolve(pageDirectory, "index.html"),
  );
}
