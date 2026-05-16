import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: ["node_modules", "dist", ".next", ".claude/worktrees/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src",
      ),
    },
  },
});
