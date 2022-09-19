import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rgbaster-plus",
      fileName: format => `rgbaster-plus.${format}.js`,
    },
    outDir: resolve(__dirname, "lib"),
  },
});
