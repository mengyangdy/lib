import { defineConfig } from "tsdown/config";

export default defineConfig({
  entry: "src/index.ts",
  dts: true,
  clean: true,
  format: ["es", "cjs"],
  minify: true,
});
