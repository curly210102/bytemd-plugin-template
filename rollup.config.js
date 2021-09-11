import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const packageConfig = {
  input: "src/index.js",
  output: [
    { file: pkg.module, format: "es", sourcemap: true },
    {
      format: "cjs",
      sourcemap: true,
      file: pkg.main,
      exports: "auto", // fix warning
    },
  ],
  plugins: [svelte(), resolve(), json()],
  external: {
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  },
};

const umdConfig = {
  input: "src/index.js",
  output: {
    format: "umd",
    name: pkg.name,
    sourcemap: true,
    inlineDynamicImports: true,
    file: pkg.unpkg,
  },
  plugins: [svelte(), resolve(), json(), terser()],
  external: Object.keys(pkg.peerDependencies || {}),
};

export default [packageConfig, umdConfig];
