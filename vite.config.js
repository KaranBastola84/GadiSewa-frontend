import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "react-router-dom": path.resolve(
        "node_modules/react-router-dom/dist/index.mjs",
      ),
      "react-router/dom": path.resolve(
        "node_modules/react-router/dist/development/dom-export.mjs",
      ),
      "react-router": path.resolve(
        "node_modules/react-router/dist/development/index.mjs",
      ),
    },
  },
});
