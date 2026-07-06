import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // The catalog grows over time (mediaData.ts entries), so tests that render/filter/sort
    // the full list get slower — especially on CI runners, which are slower than local dev
    // machines. A generous global timeout avoids flaky failures as the data set grows.
    testTimeout: 20000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "scripts/**/*.mjs"],
      exclude: [
        "src/components/ui/**", // vendored shadcn/ui primitives — exercised indirectly
        "src/main.tsx", // bootstrap
        "src/test/**",
        "src/vite-env.d.ts",
      ],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
