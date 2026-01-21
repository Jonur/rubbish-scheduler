import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    clearMocks: true,
    restoreMocks: true,

    // ✅ So you don't import describe/it/expect/vi in every file
    globals: true,

    // ✅ Node environment (correct for your project)
    environment: "node",

    // ✅ One-time setup (mocks, timezone, reset hooks)
    setupFiles: ["./src/test/setupTests.ts"],

    // Where tests can live (you said src, api, scripts)
    include: ["src/**/*.{test,spec}.ts", "api/**/*.{test,spec}.ts", "scripts/**/*.{test,spec}.ts"],

    // Common excludes
    exclude: ["node_modules", "dist", "build", ".vercel", "coverage"],

    // Optional: nicer output / CI friendliness
    reporters: ["default"],

    coverage: {
      provider: "v8",
      enabled: false, // enabled via CLI in test:coverage

      // Comprehensive set of reports
      reporter: ["text", "html", "lcov", "json-summary"],

      reportsDirectory: "./coverage",

      // Only measure coverage for your real runtime code
      include: ["src/**/*.ts", "api/**/*.ts", "scripts/**/*.ts"],

      // Exclude tests + the files you explicitly listed
      exclude: [
        "scripts/**",
        "**/*.{test,spec}.ts",
        "**/__mocks__/**",
        "src/**/types.ts",
        "src/**/config.ts",
        "src/**/index.ts",
        "src/**/constants.ts",
      ],
    },
  },
});
