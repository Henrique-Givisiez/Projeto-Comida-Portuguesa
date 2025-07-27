import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true, // permite usar describe/test/expect sem importar
    environment: "node", // ou "jsdom" se for testar frontend
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
