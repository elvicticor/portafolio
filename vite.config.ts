import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    target: "es2022",
    sourcemap: true,
    // Three.js lives in a lazy chunk; this threshold avoids a misleading warning.
    chunkSizeWarningLimit: 600,
  },
});
